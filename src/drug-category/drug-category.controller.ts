import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DrugCategoryService } from './drug-category.service';
import { CreateDrugCategoryDto } from './dto/create-drug-category.dto';
import { UpdateDrugCategoryDto } from './dto/update-drug-category.dto';

@Controller('drug-category')
export class DrugCategoryController {
  constructor(private readonly drugCategoryService: DrugCategoryService) {}

  @Post()
  create(@Body() createDrugCategoryDto: CreateDrugCategoryDto) {
    return this.drugCategoryService.create(createDrugCategoryDto);
  }

  @Get()
  findAll() {
    return this.drugCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.drugCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDrugCategoryDto: UpdateDrugCategoryDto,
  ) {
    return this.drugCategoryService.update(id, updateDrugCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.drugCategoryService.remove(id);
  }
}
