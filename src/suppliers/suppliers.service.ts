import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SuppliersService {
  private readonly prisma: PrismaClient;
  constructor(private prismaService: PrismaService) {
    this.prisma = prismaService.prisma;
  }
  async create(createSupplierDto: CreateSupplierDto) {
    const { address, name, contactPerson, email, phone } = createSupplierDto;
    const existing = await this.prisma.supplier.findFirst({
      where: {
        name,
      },
    });
    if (existing) {
      throw new BadRequestException('Supplier already exists');
    }
    const newSupplier = await this.prisma.supplier.create({
      data: {
        name,
        address,
        contactPerson,
        email,
        phone,
      },
    });
    return newSupplier;
  }

  async findAll() {
    const suppliers = await this.prisma.supplier.findMany();
    return suppliers;
  }

  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id,
      },
    });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const { address, contactPerson, email, name, phone } = updateSupplierDto;
    try {
      const updatedSupplier = await this.prisma.supplier.update({
        where: { id },
        data: { address, contactPerson, email, name, phone },
      });
      return updatedSupplier;
    } catch (error) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Drug category with id ${id} not found`);
      }
      throw new BadRequestException('Failed to update drug category');
    }
  }

  async remove(id: string) {
    const deletedSupplier = await this.prisma.supplier.delete({
      where: {
        id,
      },
    });
    return deletedSupplier;
  }
}
