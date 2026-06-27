import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SatelliteService {
  private readonly logger = new Logger(SatelliteService.name);

  constructor(private prisma: PrismaService) {}

  async getData(farmId: string, userId: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) throw new NotFoundException('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.satelliteData.findMany({
      where: { farmId },
      orderBy: { date: 'desc' },
    });
  }

  async fetchNewData(farmId: string, userId: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) throw new NotFoundException('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenException('Access denied');

    const mockData = this.getMockSatelliteData(farm.latitude, farm.longitude);

    return this.prisma.satelliteData.create({
      data: {
        farmId,
        latitude: farm.latitude,
        longitude: farm.longitude,
        ndvi: mockData.ndvi,
        healthIndex: mockData.healthIndex,
        vegetation: mockData.vegetation,
        soilMoisture: mockData.soilMoisture,
        metadata: JSON.stringify(mockData),
      },
    });
  }

  private getMockSatelliteData(latitude: number, longitude: number) {
    return {
      ndvi: 0.45 + Math.random() * 0.4,
      healthIndex: 60 + Math.random() * 35,
      vegetation: 50 + Math.random() * 40,
      soilMoisture: 30 + Math.random() * 40,
      cloudCover: Math.random() * 20,
      resolution: '10m',
    };
  }
}
