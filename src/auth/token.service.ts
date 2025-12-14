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
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    return accessToken;
  }
  async generateRefreshToken(payload: JwtPayload) {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return refreshToken;
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

  async validateToken(token: string) {
    try {
      const decoded: { email: string; sub: string } =
        await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_ACCESS_SECRET,
        });
      return decoded;
    } catch (err) {
      console.log('Token validation error:', err);
      throw new UnauthorizedException('Invalid token');
    }
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
    return bcrypt.compare(plainToken, hashedToken);
  }
}
