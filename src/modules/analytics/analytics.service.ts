import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getFarmAnalytics(farmId: string, userId: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) throw new NotFoundException('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.farmAnalytics.findMany({
      where: { farmId },
      orderBy: { startDate: 'desc' },
    });
  }

  async createAnalyticsEntry(farmId: string, userId: string, data: any) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) throw new NotFoundException('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.farmAnalytics.create({
      data: { ...data, farmId, userId },
    });
  }
}
