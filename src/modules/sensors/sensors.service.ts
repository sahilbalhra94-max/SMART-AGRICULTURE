import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SensorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.sensor.findMany({
      where: { userId },
      include: {
        farm: { select: { id: true, name: true } },
        readings: { orderBy: { timestamp: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const sensor = await this.prisma.sensor.findUnique({
      where: { id },
      include: { farm: true },
    });
    if (!sensor) throw new NotFoundException('Sensor not found');
    if (sensor.userId !== userId) throw new ForbiddenException('Access denied');
    return sensor;
  }

  async create(userId: string, data: any) {
    const farm = await this.prisma.farm.findUnique({ where: { id: data.farmId } });
    if (!farm) throw new NotFoundException('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.sensor.create({
      data: { ...data, userId },
    });
  }

  async update(id: string, userId: string, data: any) {
    const sensor = await this.prisma.sensor.findUnique({ where: { id } });
    if (!sensor) throw new NotFoundException('Sensor not found');
    if (sensor.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.sensor.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    const sensor = await this.prisma.sensor.findUnique({ where: { id } });
    if (!sensor) throw new NotFoundException('Sensor not found');
    if (sensor.userId !== userId) throw new ForbiddenException('Access denied');

    await this.prisma.sensor.delete({ where: { id } });
    return { message: 'Sensor deleted successfully' };
  }

  async getReadings(sensorId: string, userId: string) {
    const sensor = await this.prisma.sensor.findUnique({ where: { id: sensorId } });
    if (!sensor) throw new NotFoundException('Sensor not found');
    if (sensor.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.sensorReading.findMany({
      where: { sensorId },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
  }

  async addReading(sensorId: string, userId: string, data: any) {
    const sensor = await this.prisma.sensor.findUnique({ where: { id: sensorId } });
    if (!sensor) throw new NotFoundException('Sensor not found');
    if (sensor.userId !== userId) throw new ForbiddenException('Access denied');

    await this.prisma.sensor.update({
      where: { id: sensorId },
      data: { lastSeenAt: new Date() },
    });

    return this.prisma.sensorReading.create({
      data: { ...data, sensorId },
    });
  }
}
