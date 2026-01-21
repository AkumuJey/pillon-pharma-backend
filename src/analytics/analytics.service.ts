import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly prisma: PrismaClient;
  constructor(private prismaService: PrismaService) {
    this.prisma = prismaService.prisma;
  }
  async salesOverTime(from?: Date, to?: Date) {
    return this.prisma.sale.groupBy({
      by: ['createdAt'],
      _sum: { totalAmount: true },
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      _count: { id: true },
      orderBy: { createdAt: 'asc' },
    });
  }
  async salesByUser(from?: Date, to?: Date) {
    return this.prisma.sale.groupBy({
      by: ['createdById'],
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      _count: { id: true },
      _sum: { totalAmount: true },
    });
  }
  async mostSoldDrugs(limit = 20) {
    return this.prisma.saleItem.groupBy({
      by: ['drugId'],
      _sum: { quantity: true, totalPrice: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });
  }
  async stockExpenditure(from?: Date, to?: Date) {
    return this.prisma.inventoryBatch.aggregate({
      where: { receivedAt: { gte: from, lte: to } },
      _sum: { buyingPrice: true },
    });
  }
}
