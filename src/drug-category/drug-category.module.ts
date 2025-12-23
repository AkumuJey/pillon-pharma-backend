import { Module } from '@nestjs/common';
import { DrugCategoryService } from './drug-category.service';
import { DrugCategoryController } from './drug-category.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DrugCategoryController],
  providers: [DrugCategoryService, PrismaService],
})
export class DrugCategoryModule {}
