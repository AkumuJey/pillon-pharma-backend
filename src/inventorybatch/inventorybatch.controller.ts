import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InventorybatchService } from './inventorybatch.service';
import { CreateInventoryBatchDto } from './dto/create-inventorybatch.dto';
import { UpdateInventorybatchDto } from './dto/update-inventorybatch.dto';

@Controller('inventorybatch')
export class InventorybatchController {
  constructor(private readonly inventorybatchService: InventorybatchService) {}

  @Post()
  create(@Body() createInventorybatchDto: CreateInventoryBatchDto) {
    return this.inventorybatchService.create(createInventorybatchDto);
  }

  @Get()
  findAll() {
    return this.inventorybatchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventorybatchService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventorybatchDto: UpdateInventorybatchDto,
  ) {
    return this.inventorybatchService.update(id, updateInventorybatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventorybatchService.remove(id);
  }
}
