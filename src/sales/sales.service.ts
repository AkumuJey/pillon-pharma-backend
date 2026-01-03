import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleDto, RevokeSaleDto } from './dto/create-sale.dto';
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
  async revokeSale(
    saleId: string,
    revokedByUserId: string,
    revokeSaleDto: RevokeSaleDto,
  ) {
    const { reason } = revokeSaleDto;

    return this.prisma.$transaction(async (tx: PrismaClient) => {
      // 1️⃣ Fetch the sale with items and void relation
      const sale = await tx.sale.findUniqueOrThrow({
        where: { id: saleId },
        include: { saleItems: true },
      });

      if (!sale) {
        throw new NotFoundException('Sale not found');
      }

      // 2️⃣ Check if already voided
      if (sale.status === 'VOIDED') {
        throw new BadRequestException('Sale already voided');
      }

      // 3️⃣ Restore inventory for each sale item
      for (const item of sale.saleItems) {
        await tx.inventoryBatch.update({
          where: { id: item.inventoryBatchId },
          data: { quantityRemaining: { increment: item.quantity } },
        });

        await tx.stockMovement.create({
          data: {
            inventoryBatchId: item.inventoryBatchId,
            movementType: 'ADJUSTMENT_IN',
            quantity: item.quantity,
            referenceId: sale.id,
          },
        });
      }

      // 4️⃣ Mark the sale as VOIDED
      await tx.sale.update({
        where: { id: sale.id },
        data: { status: 'VOIDED' },
      });

      await tx.saleVoid.create({
        data: {
          reason,
          createdById: revokedByUserId,
          saleId: sale.id,
        },
      });

      // 6️⃣ Return success
      return { message: 'Sale revoked successfully' };
    });
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
