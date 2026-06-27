import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SchemesService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string, state?: string) {
    const where: any = {};
    if (category) where.category = category;
    if (state) where.state = state;

    return this.prisma.scheme.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const scheme = await this.prisma.scheme.findUnique({ where: { id } });
    if (!scheme) throw new NotFoundException('Scheme not found');
    return scheme;
  }
}
