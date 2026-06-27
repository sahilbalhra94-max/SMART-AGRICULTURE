import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DiseaseService } from './disease.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Disease')
@ApiBearerAuth()
@Controller('disease')
export class DiseaseController {
  constructor(private readonly diseaseService: DiseaseService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze image for disease detection' })
  async analyzeImage(
    @CurrentUser('id') userId: string,
    @Body() body: { imageUrl: string; cropId?: string; farmId?: string },
  ) {
    return this.diseaseService.analyzeImage(
      userId,
      body.imageUrl,
      body.cropId,
      body.farmId,
    );
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get all disease reports' })
  async getReports(@CurrentUser('id') userId: string) {
    return this.diseaseService.getReports(userId);
  }

  @Get('reports/:id')
  @ApiOperation({ summary: 'Get disease report by ID' })
  async getReport(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.diseaseService.getReport(id, userId);
  }
}
