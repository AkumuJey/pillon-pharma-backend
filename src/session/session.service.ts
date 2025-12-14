import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from '../session/dto/CreateSessionDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SessionService {
  constructor(private prismaClient: PrismaService) {}

  async createSession(expiresAt: Date, sessionData: CreateSessionDto) {
    const { userId, refreshToken, ipAddress, userAgent } = sessionData;
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
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

  async invalidateSession(sessionId: string, userId: string) {
    await this.prismaClient.prisma.session.delete({
      where: { id: sessionId, userId },
    });
  }

  async findRefreshToken(userId: string) {
    try {
      const session = await this.prismaClient.prisma.session.findFirst({
        where: { userId },
      });
      return session;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Invalid session');
    }
  }
}
