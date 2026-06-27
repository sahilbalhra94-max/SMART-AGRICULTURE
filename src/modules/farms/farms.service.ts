import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.farm.findMany({
      where: { userId, deletedAt: null },
      include: {
        _count: { select: { crops: true, sensors: true, irrigationZones: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: {
        crops: { where: { deletedAt: null } },
        sensors: true,
        irrigationZones: true,
      },
    });
    if (!farm) throw new NotFoundException('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenException('Access denied');
    return farm;
  }

  async create(userId: string, dto: CreateFarmDto) {
    return this.prisma.farm.create({
      data: { ...dto, userId },
    });
  }

  async update(id: string, userId: string, dto: UpdateFarmDto) {
    const farm = await this.prisma.farm.findUnique({ where: { id } });
    if (!farm) throw new NotFoundException('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.farm.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id } });
    if (!farm) throw new NotFoundException('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenException('Access denied');

    await this.prisma.farm.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Farm deleted successfully' };
  }
}
