import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  controllers: [SessionController],
  providers: [SessionService, PrismaService],
  imports: [],
})
export class SessionModule {}
