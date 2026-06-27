import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MarketService {
  constructor(private prisma: PrismaService) {}

  async getPrices(commodity?: string, state?: string) {
    const where: any = {};
    if (commodity) where.commodity = commodity;
    if (state) where.state = state;

    return this.prisma.marketPrice.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 100,
    });
  }

  async getCommodityPrices(commodity: string) {
    return this.prisma.marketPrice.findMany({
      where: { commodity },
      orderBy: { date: 'desc' },
      take: 50,
    });
  }

  async getWatchlist(userId: string) {
    return this.prisma.marketWatchlist.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addToWatchlist(userId: string, data: { commodity: string; market?: string; targetPrice?: number }) {
    return this.prisma.marketWatchlist.create({
      data: { ...data, userId },
    });
  }

  async removeFromWatchlist(id: string, userId: string) {
    const item = await this.prisma.marketWatchlist.findUnique({ where: { id } });
    if (!item || item.userId !== userId) {
      throw new NotFoundException('Watchlist item not found');
    }
    await this.prisma.marketWatchlist.delete({ where: { id } });
    return { message: 'Removed from watchlist' };
  }
}
