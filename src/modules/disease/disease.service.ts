import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DiseaseService {
  private readonly logger = new Logger(DiseaseService.name);

  constructor(private prisma: PrismaService) {}

  async analyzeImage(userId: string, imageUrl: string, cropId?: string, farmId?: string) {
    const result = this.getMockAnalysis();

    const report = await this.prisma.diseaseReport.create({
      data: {
        diseaseName: result.diseaseName,
        confidence: result.confidence,
        severity: result.severity,
        description: result.description,
        treatment: result.treatment,
        prevention: result.prevention,
        imageUrl,
        cropId,
        farmId,
        userId,
      },
    });

    return report;
  }

  async getReports(userId: string) {
    return this.prisma.diseaseReport.findMany({
      where: { userId },
      include: {
        crop: { select: { id: true, name: true } },
        farm: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReport(id: string, userId: string) {
    const report = await this.prisma.diseaseReport.findUnique({
      where: { id },
      include: {
        crop: true,
        farm: true,
      },
    });
    if (!report || report.userId !== userId) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  private getMockAnalysis() {
    const diseases = [
      {
        diseaseName: 'Leaf Blight',
        confidence: 0.87,
        severity: 'MEDIUM',
        description: 'Leaf blight detected on the crop. This fungal disease causes brown spots on leaves.',
        treatment: 'Apply fungicide containing chlorothalonil or mancozeb. Remove affected leaves.',
        prevention: 'Ensure proper spacing between plants. Avoid overhead irrigation.',
      },
      {
        diseaseName: 'Powdery Mildew',
        confidence: 0.92,
        severity: 'LOW',
        description: 'White powdery coating on leaves indicates powdery mildew infection.',
        treatment: 'Spray neem oil solution or sulfur-based fungicide.',
        prevention: 'Maintain proper air circulation. Avoid excessive nitrogen fertilization.',
      },
      {
        diseaseName: 'Root Rot',
        confidence: 0.78,
        severity: 'HIGH',
        description: 'Root rot detected. Plants showing wilting despite adequate water.',
        treatment: 'Improve drainage. Apply fungicide drench to soil. Remove severely affected plants.',
        prevention: 'Avoid waterlogging. Use well-draining soil mix.',
      },
    ];
    return diseases[Math.floor(Math.random() * diseases.length)];
  }
}
