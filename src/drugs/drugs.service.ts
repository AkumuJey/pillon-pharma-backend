import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DrugsService {
  constructor(private prismaClient: PrismaService) {}
  async create(createDrugDto: CreateDrugDto) {
    try {
      const {
        brandName,
        dosage,
        standardSellingPrice,
        barcode,
        categoryId,
        genericName,
        isPrescriptionRequired,
      } = createDrugDto;
      if (createDrugDto.standardSellingPrice < 0) {
        throw new BadRequestException(
          'Standard selling price must be greater than zero',
        );
      }
      const existing = await this.prismaClient.prisma.drug.findFirst({
        where: {
          brandName: brandName,
          dosage: dosage,
        },
      });

      if (existing) {
        throw new BadRequestException(
          'Drug with the same brand name and dosage already exists',
        );
      }

      const newDrug = await this.prismaClient.prisma.drug.create({
        data: {
          brandName,
          dosage,
          standardSellingPrice,
          barcode,
          genericName,
          isPrescriptionRequired,
          categoryId,
        },
      });
      return newDrug;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new BadRequestException('Duplicate value violates uniqueness');
      }
      throw new BadRequestException('Failed to create drug');
    }
  }

  async findAll() {
    const result = await this.prismaClient.prisma.drug.findMany();
    return result;
  }

  async findOne(id: string) {
    const result = await this.prismaClient.prisma.drug.findUnique({
      where: { id },
    });
    return result;
  }

  async update(id: string, updateDrugDto: UpdateDrugDto) {
    const {
      barcode,
      brandName,
      categoryId,
      dosage,
      genericName,
      isPrescriptionRequired,
      standardSellingPrice,
    } = updateDrugDto;

    try {
      const updatedDrug = await this.prismaClient.prisma.drug.update({
        where: { id },
        data: {
          barcode,
          brandName,
          categoryId,
          dosage,
          genericName,
          isPrescriptionRequired,
          standardSellingPrice,
        },
      });
      return updatedDrug;
    } catch (error) {
      // Prisma “record not found” error
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Drug category with id ${id} not found`);
      }
      throw new BadRequestException('Failed to update drug category');
    }
  }

  async remove(id: string) {
    const deletedDrug = await this.prismaClient.prisma.drug.delete({
      where: { id },
    });
    return deletedDrug;
  }
}
