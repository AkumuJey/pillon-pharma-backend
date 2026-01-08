import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AdjustStockDto,
  CreateInventoryBatchDto,
  receiveStockDto,
} from './dto/create-inventorybatch.dto';
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
  async receiveStock(dto: receiveStockDto, createdById: string) {
    const {
      batchNumber,
      buyingPrice,
      drugId,
      expiryDate,
      quantityReceived,
      sellingPriceSnapshot,
      supplierId,
    } = dto;
    return await this.prisma.$transaction(async (tx) => {
      const drug = await tx.drug.findUnique({
        where: { id: drugId },
      });
      if (!drug) {
        throw new BadRequestException('Drug not found');
      }
      let batch;
      const existingBatch = await tx.inventoryBatch.findUnique({
        where: { drugId_batchNumber: { drugId, batchNumber } },
      });
      if (existingBatch) {
        batch = await tx.inventoryBatch.update({
          where: { id: existingBatch.id },
          data: {
            quantityRemaining: {
              increment: quantityReceived,
            },
            sellingPriceSnapshot,
          },
        });
      } else {
        batch = await tx.inventoryBatch.create({
          data: {
            buyingPrice,
            drugId,
            expiryDate,
            quantityReceived,
            sellingPriceSnapshot,
            supplierId,
            batchNumber,
            quantityRemaining: quantityReceived,
            createdById,
          },
        });
      }
      await tx.stockMovement.create({
        data: {
          movementType: 'PURCHASE',
          quantity: quantityReceived,
          inventoryBatchId: batch.id as string,
          referenceId: createdById,
          reason: 'Stock received',
        },
      });
      return batch;
    });
  }
  async adjustStock(userId: string, dto: AdjustStockDto) {
    const { inventoryBatchId, movementType, quantity, reason } = dto;
    return await this.prisma.$transaction(async (tx) => {
      const batch = await tx.inventoryBatch.findUnique({
        where: { id: inventoryBatchId },
      });
      if (!batch) {
        throw new BadRequestException('Inventory batch not found');
      }
      if (
        ['EXPIRED', 'ADJUSTMENT_OUT'].includes(movementType) &&
        batch.quantityRemaining < quantity
      ) {
        throw new BadRequestException('Insufficient stock for adjustment');
      }
      if (['PURCHASE', 'SALE'].includes(movementType)) {
        throw new BadRequestException('Bad request');
      }
      const adjustment =
        movementType === 'ADJUSTMENT_IN' ? quantity : -quantity;
      const updatedBatch = await tx.inventoryBatch.update({
        where: {
          id: inventoryBatchId,
        },
        data: {
          quantityRemaining: { increment: quantity },
          isActive: batch.quantityRemaining + adjustment > 0,
        },
      });
      await tx.stockMovement.create({
        data: {
          movementType,
          quantity,
          referenceId: userId,
          inventoryBatchId,
          reason,
        },
      });
      return {
        updatedBatch,
        message: `Success: ${movementType}`,
      };
    });
  }
}
