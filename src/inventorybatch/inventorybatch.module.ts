import { Module } from '@nestjs/common';
import { InventorybatchService } from './inventorybatch.service';
import { InventorybatchController } from './inventorybatch.controller';

@Module({
  controllers: [InventorybatchController],
  providers: [InventorybatchService],
})
export class InventorybatchModule {}
