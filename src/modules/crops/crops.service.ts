import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@Injectable()
export class CropsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.crop.findMany({
      where: { farm: { userId }, deletedAt: null },
      include: { farm: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const crop = await this.prisma.crop.findUnique({
      where: { id },
      include: { farm: true, diseaseReports: true },
    });
    if (!crop) throw new NotFoundException('Crop not found');
    if (crop.farm.userId !== userId) throw new ForbiddenException('Access denied');
    return crop;
  }

  async create(userId: string, dto: CreateCropDto) {
    const farm = await this.prisma.farm.findUnique({ where: { id: dto.farmId } });
    if (!farm) throw new NotFoundException('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.crop.create({ data: dto });
  }

  async update(id: string, userId: string, dto: UpdateCropDto) {
    const crop = await this.prisma.crop.findUnique({
      where: { id },
      include: { farm: true },
    });
    if (!crop) throw new NotFoundException('Crop not found');
    if (crop.farm.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.crop.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    const crop = await this.prisma.crop.findUnique({
      where: { id },
      include: { farm: true },
    });
    if (!crop) throw new NotFoundException('Crop not found');
    if (crop.farm.userId !== userId) throw new ForbiddenException('Access denied');

    await this.prisma.crop.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Crop deleted successfully' };
  }

  async findByFarm(farmId: string, userId: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) throw new NotFoundException('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.crop.findMany({
      where: { farmId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }
}
