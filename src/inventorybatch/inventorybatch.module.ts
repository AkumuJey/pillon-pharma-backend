import { Module } from '@nestjs/common';
import { InventorybatchService } from './inventorybatch.service';
import { InventorybatchController } from './inventorybatch.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [InventorybatchController],
  providers: [InventorybatchService, PrismaService],
})
export class InventorybatchModule {}
