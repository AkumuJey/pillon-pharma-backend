import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDrugCategoryDto } from './dto/create-drug-category.dto';
import { UpdateDrugCategoryDto } from './dto/update-drug-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class DrugCategoryService {
  private readonly prisma: PrismaClient;
  constructor(private prismaService: PrismaService) {
    this.prisma = this.prismaService.prisma;
  }
  async create(createDrugCategoryDto: CreateDrugCategoryDto) {
    const { description, name } = createDrugCategoryDto;
    const existing = await this.prisma.drugCategory.findFirst({
      where: {
        name,
      },
    });
    if (existing) {
      throw new BadRequestException('Category already exists.');
    }
    const newDrugCategory = await this.prisma.drugCategory.create({
      data: { description, name },
    });
    return newDrugCategory;
  }

  async findAll() {
    const drugCategories = await this.prisma.drugCategory.findMany();
    return drugCategories;
  }

  async findOne(id: string) {
    const drugCategory = await this.prisma.drugCategory.findUnique({
      where: {
        id,
      },
    });
    return drugCategory;
  }

  async update(id: string, updateDrugCategoryDto: UpdateDrugCategoryDto) {
    const { description, name } = updateDrugCategoryDto;
    try {
      const updated = await this.prisma.drugCategory.update({
        where: { id },
        data: { name, description },
      });
      return updated;
    } catch (error) {
      // Prisma “record not found” error
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Drug category with id ${id} not found`);
      }
      throw new BadRequestException('Failed to update drug category');
    }
  }

  async remove(id: string) {
    const deletedDrugCategory = await this.prisma.drugCategory.delete({
      where: {
        id,
      },
    });
    return deletedDrugCategory;
  }
}
