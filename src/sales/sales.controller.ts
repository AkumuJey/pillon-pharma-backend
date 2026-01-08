import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateSaleDto, RevokeSaleDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.recordSale(createSaleDto, '');
  }

  @Post()
  revoke(@Body() revokeSaleDto: RevokeSaleDto) {
    return this.salesService.revokeSale('', '', revokeSaleDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
