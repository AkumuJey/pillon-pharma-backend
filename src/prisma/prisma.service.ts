import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public prisma: PrismaClient;

  constructor() {
    // Pass the required adapter
    this.prisma = new PrismaClient({
      adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
    });
  }

  async onModuleInit() {
    await this.prisma.$connect();
    console.log('✅ Prisma connected successfully!');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    console.log('🔌 Prisma disconnected successfully!');
  }
}
