import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SessionService } from 'src/session/session.service';

interface JwtPayload {
  email: string;
  sub: string;
}
@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}
  async generateAccessToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
  }
  async generateRefreshToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }
  async generateTokens(userId: string, email: string) {
    const payload = { email, sub: userId };
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    const refreshTokenExpiry = this.refreshTokenExpiry();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    const newSessionData = await this.sessionService.createSession(
      refreshTokenExpiry,
      {
        userId,
        refreshToken,
      },
    );
    return { accessToken, refreshToken, newSessionData };
  }

  refreshTokenExpiry(): Date {
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
    return refreshTokenExpiry;
  }

  async compareTokens(
    plainToken: string,
    hashedToken: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainToken, hashedToken);
  }
  async validateRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const { email, sub: userId } =
        await this.validateRefreshToken(refreshToken);
      const session = await this.sessionService.findRefreshToken(userId);
      if (!session) {
        throw new UnauthorizedException('Invalid session');
      }
      const isTokenValid = await this.compareTokens(
        refreshToken,
        session.refreshToken,
      );
      if (!isTokenValid || session.expiresAt < new Date()) {
        await this.sessionService.invalidateSession(session.id);
        throw new UnauthorizedException('Invalid refresh token');
      }
      const {
        accessToken,
        refreshToken: newRefreshToken,
        newSessionData,
      } = await this.generateTokens(userId, email);
      await this.sessionService.updateSession(
        session.id,
        newRefreshToken,
        newSessionData.expiresAt,
      );
      return { accessToken, refreshToken: newRefreshToken, newSessionData };
    } catch {
      throw new UnauthorizedException('Could not refresh tokens');
    }
  }
}
