import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from 'src/generated/prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalesService {
  private readonly prisma: PrismaClient;
  constructor(prismaService: PrismaService) {
    this.prisma = prismaService.prisma;
  }
  async recordSale(dto: CreateSaleDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      let totalAmount = new Prisma.Decimal(0);
      const sale = await tx.sale.create({
        data: {
          totalAmount: 0,
          paymentMethod: dto.paymentMethod,
          createdById: userId,
        },
      });

      for (const item of dto.items) {
        const batch = await tx.inventoryBatch.findFirst({
          where: {
            drugId: item.drugId,
            isActive: true,
            expiryDate: { gt: new Date() },
            quantityRemaining: { gte: item.quantiy },
          },
          orderBy: { expiryDate: 'asc' },
        });
        if (!batch) {
          throw new BadRequestException(
            `Insufficient stock for drug ${item.drugId}`,
          );
        }
        const unitPrice = batch.sellingPriceSnapshot;
        const itemTotal = unitPrice.mul(item.quantiy);
        totalAmount = totalAmount.add(itemTotal);

        const remaining = batch.quantityRemaining - item.quantiy;
        await tx.inventoryBatch.update({
          where: { id: batch.id },
          data: {
            quantityRemaining: remaining,
            isActive: remaining > 0,
          },
        });
        await tx.stockMovement.create({
          data: {
            movementType: 'SALE',
            quantity: item.quantiy,
            inventoryBatchId: batch.id,
          },
        });
      }
      await tx.sale.update({
        where: {
          id: sale.id,
        },
        data: { totalAmount },
      });
      return sale;
    });
  }

  findAll() {
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
