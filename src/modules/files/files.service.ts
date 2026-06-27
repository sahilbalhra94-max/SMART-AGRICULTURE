import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async upload(userId: string, file: Express.Multer.File) {
    const key = `uploads/${randomUUID()}-${file.originalname}`;
    const bucket = this.configService.get('s3.bucket', 'agrismart-files');

    let url: string;
    try {
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
      const s3 = new S3Client({
        region: this.configService.get('s3.region'),
        credentials: {
          accessKeyId: this.configService.get('s3.accessKeyId'),
          secretAccessKey: this.configService.get('s3.secretAccessKey'),
        },
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      url = `https://${bucket}.s3.amazonaws.com/${key}`;
    } catch (error) {
      this.logger.warn('S3 upload failed, using local URL');
      url = `local://${key}`;
    }

    const fileType = file.mimetype.startsWith('image/')
      ? 'IMAGE'
      : file.mimetype.startsWith('video/')
        ? 'VIDEO'
        : 'DOCUMENT';

    return this.prisma.file.create({
      data: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        key,
        url,
        type: fileType,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.file.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, userId: string) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file || file.userId !== userId) {
      throw new NotFoundException('File not found');
    }

    await this.prisma.file.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'File deleted successfully' };
  }
}
