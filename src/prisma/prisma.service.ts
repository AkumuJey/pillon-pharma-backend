// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaMssql } from '@prisma/adapter-mssql';

import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaMssql({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected to the database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('✅ Prisma disconnected to the database');
  }
}
