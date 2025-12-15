import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { SessionService } from 'src/session/session.service';

export interface JwtPayload {
  email: string;
  sub: string;
  jti?: string;
}
export interface RefreshPayload {
  email: string;
  sub: string;
  jti: string;
}

export interface JwtRefreshToken {
  refreshToken: string;
  jti: string;
  expiresAt: Date;
}
export interface ForStorageTokens {
  accessToken: string;
  refreshToken: string;
  jti: string;
  expiresAt: Date;
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
  async generateRefreshToken(payload: JwtPayload): Promise<JwtRefreshToken> {
    const jti = randomUUID();
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, jti },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    const expiresAt = this.refreshTokenExpiry();

    return { refreshToken, jti, expiresAt };
  }
  async generateTokens(userId: string, email: string) {
    const payload = { email, sub: userId };
    const accessToken = await this.generateAccessToken(payload);
    const { jti, refreshToken, expiresAt } =
      await this.generateRefreshToken(payload);
    return { accessToken, refreshToken, jti, expiresAt };
  }

  async storeRefreshToken(tokens: ForStorageTokens, userId: string) {
    const newSessionData = await this.sessionService.createSession({
      expiresAt: tokens.expiresAt,
      userId,
      refreshToken: tokens.refreshToken,
      jti: tokens.jti,
    });
    console.log(newSessionData);
    return { ...tokens, newSessionData };
  }

  refreshTokenExpiry(): Date {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return expiry;
  }

  async compareTokens(
    plainToken: string,
    hashedToken: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainToken, hashedToken);
  }
  async validateRefreshToken(token: string): Promise<RefreshPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshTokens(refreshToken: string) {
    const q = await this.validateRefreshToken(refreshToken);
    console.log(q);
    const {
      email,
      sub: userId,
      jti,
    } = await this.validateRefreshToken(refreshToken);
    if (!jti) throw new UnauthorizedException('Invalid refresh token');
    console.log(jti);
    const session = await this.sessionService.findRefreshTokenById(jti);
    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }
    const isTokenValid = await this.compareTokens(
      refreshToken,
      session.refreshToken,
    );
    if (!isTokenValid || session.expiresAt < new Date()) {
      await this.sessionService.deleteSessionByTokenId(jti);
      throw new UnauthorizedException('Refresh token expired or reused');
    }
    const tokens = await this.generateTokens(userId, email);
    await this.sessionService.updateSession(
      session.id,
      tokens.refreshToken,
      tokens.expiresAt,
      tokens.jti,
    );
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
    };
  }
  invalidateRefreshToken(jti: string) {
    return this.sessionService.deleteSessionByTokenId(jti);
  }

  async deleteAllSessions() {
    return await this.sessionService.deleteAll();
  }
  async getAllSessions() {
    return await this.sessionService.getSessions();
  }
}
