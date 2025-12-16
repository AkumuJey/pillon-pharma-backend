import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from '../session/dto/CreateSessionDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SessionService {
  constructor(private prismaClient: PrismaService) {}

  async createSession(sessionData: CreateSessionDto) {
    try {
      const { userId, refreshToken, ipAddress, userAgent, jti, expiresAt } =
        sessionData;
      console.log('Here 2', expiresAt);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      const newSession = await this.prismaClient.prisma.session.create({
        data: {
          userId,
          refreshToken: hashedRefreshToken,
          ipAddress,
          userAgent,
          expiresAt,
          tokenId: jti,
        },
      });
      return newSession;
    } catch {
      throw new BadRequestException('Could not create session');
    }
  }

  async deleteSessionByTokenId(jti: string) {
    try {
      await this.prismaClient.prisma.session.delete({
        where: { tokenId: jti },
      });
    } catch {
      throw new UnauthorizedException('Invalid session');
    }
  }

  async findRefreshTokenById(jti: string) {
    try {
      const session = await this.prismaClient.prisma.session.findUnique({
        where: { tokenId: jti },
      });
      if (!session) {
        throw new UnauthorizedException('Invalid session');
      }
      return session;
    } catch {
      throw new UnauthorizedException('Invalid session');
    }
  }
  async updateSession(
    sessionId: string,
    refreshToken: string,
    expiresAt: Date,
    jti: string,
  ) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const updatedSession = await this.prismaClient.prisma.session.update({
      where: { id: sessionId },
      data: {
        refreshToken: hashedRefreshToken,
        expiresAt,
        tokenId: jti,
      },
    });
    return updatedSession;
  }

  async deleteAll() {
    return await this.prismaClient.prisma.session.deleteMany({});
  }
  async getSessions() {
    return await this.prismaClient.prisma.session.findMany({});
  }
}
