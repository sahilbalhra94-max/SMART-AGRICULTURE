import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class IrrigationService {
  constructor(private prisma: PrismaService) {}

  async getZones(userId: string) {
    return this.prisma.irrigationZone.findMany({
      where: { farm: { userId } },
      include: { schedules: { orderBy: { createdAt: 'desc' }, take: 5 } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createZone(userId: string, data: any) {
    const farm = await this.prisma.farm.findUnique({ where: { id: data.farmId } });
    if (!farm) throw new NotFoundException('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.irrigationZone.create({ data });
  }

  async updateZone(id: string, userId: string, data: any) {
    const zone = await this.prisma.irrigationZone.findUnique({
      where: { id },
      include: { farm: true },
    });
    if (!zone) throw new NotFoundException('Zone not found');
    if (zone.farm.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.irrigationZone.update({ where: { id }, data });
  }

  async getSchedules(userId: string) {
    return this.prisma.irrigationSchedule.findMany({
      where: { userId },
      include: { zone: true },
      orderBy: { startTime: 'desc' },
    });
  }

  async createSchedule(userId: string, data: any) {
    const zone = await this.prisma.irrigationZone.findUnique({
      where: { id: data.zoneId },
      include: { farm: true },
    });
    if (!zone) throw new NotFoundException('Zone not found');
    if (zone.farm.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.irrigationSchedule.create({
      data: { ...data, userId },
    });
  }

  async updateSchedule(id: string, userId: string, data: any) {
    const schedule = await this.prisma.irrigationSchedule.findUnique({
      where: { id },
      include: { zone: { include: { farm: true } } },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
    if (schedule.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.irrigationSchedule.update({ where: { id }, data });
  }
}
