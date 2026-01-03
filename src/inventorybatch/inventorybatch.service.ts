import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInventoryBatchDto } from './dto/create-inventorybatch.dto';
import { UpdateInventoryBatchDto } from './dto/update-inventorybatch.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class InventorybatchService {
  private readonly prisma: PrismaClient;
  constructor(private prismaService: PrismaService) {
    this.prisma = prismaService.prisma;
  }
  async create(createInventoryBatchDto: CreateInventoryBatchDto) {
    const {
      batchNumber,
      buyingPrice,
      drugId,
      expiryDate,
      quantityReceived,
      sellingPriceSnapshot,
      supplierId,
    } = createInventoryBatchDto;
    const existing = await this.prisma.inventoryBatch.findFirst({
      where: { batchNumber },
    });
    if (existing) {
      throw new BadRequestException('Batch number already exists.');
    }
    const newBatch = await this.prisma.inventoryBatch.create({
      data: {
        batchNumber,
        buyingPrice,
        expiryDate,
        quantityReceived,
        quantityRemaining: quantityReceived,
        sellingPriceSnapshot,
        supplierId,
        drugId,
        createdById: '',
      },
    });
    return newBatch;
  }

  async findAll() {
    const inventoryBatches = await this.prisma.inventoryBatch.findMany();
    return inventoryBatches;
  }

  async findOne(id: string) {
    const inventoryBatch = await this.prisma.inventoryBatch.findUnique({
      where: { id },
    });
    if (!inventoryBatch) {
      throw new BadRequestException('Batch not found');
    }
    return inventoryBatch;
  }

  async update(id: string, updateInventoryBatchDto: UpdateInventoryBatchDto) {
    const {
      batchNumber,
      buyingPrice,
      drugId,
      expiryDate,
      quantityReceived,
      sellingPriceSnapshot,
      supplierId,
    } = updateInventoryBatchDto;
    const updatedBatch = await this.prisma.inventoryBatch.update({
      where: { id },
      data: {
        batchNumber,
        buyingPrice,
        drugId,
        expiryDate,
        quantityReceived,
        sellingPriceSnapshot,
        supplierId,
      },
    });
    return updatedBatch;
  }

  async remove(id: string) {
    const deletedbatch = await this.prisma.inventoryBatch.delete({
      where: { id },
    });
    return deletedbatch;
  }
}
