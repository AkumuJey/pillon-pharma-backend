import { Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  public auth: ReturnType<typeof betterAuth>;

  constructor(private prisma: PrismaService) {
    this.auth = betterAuth({
      database: prismaAdapter(this.prisma, {
        provider: 'mysql',
      }),
      emailAndPassword: {
        enabled: true,
      },
      trustedOrigins: [process.env.TRUSTED_ORIGIN || 'http://localhost:3001'],
      baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      secret: process.env.BETTER_AUTH_SECRET || 'super-secret-key',
    });
  }
}
