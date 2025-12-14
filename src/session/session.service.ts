import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/CreateSessionDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SessionService {
  constructor(private prismaClient: PrismaService) {}
  async hashToken(token: string): Promise<string> {
    const hashedToken = await bcrypt.hash(token, 10);
    return hashedToken;
  }
  async compareTokens(
    plainToken: string,
    hashedToken: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainToken, hashedToken);
  }
  async createSession(expiresAt: Date, sessionData: CreateSessionDto) {
    const { userId, refreshToken, ipAddress, userAgent } = sessionData;
    const hashedRefreshToken = await this.hashToken(refreshToken);
    const newSession = await this.prismaClient.prisma.session.create({
      data: {
        userId,
        refreshToken: hashedRefreshToken,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });
    return newSession;
  }

  async invalidateSession(sessionId: string) {
    await this.prismaClient.prisma.session.delete({
      where: { id: sessionId },
    });
  }

  async checkRefreshToken(userId: string) {
    try {
      const session = await this.prismaClient.prisma.session.findFirst({
        where: { userId },
      });
      return session;
    } catch (err) {
      throw new UnauthorizedException('Invalid session');
      console.error(err);
    }
  }
}
