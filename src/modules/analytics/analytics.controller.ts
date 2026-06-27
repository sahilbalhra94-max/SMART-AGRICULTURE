import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('farms/:farmId')
  @ApiOperation({ summary: 'Get analytics for a farm' })
  async getFarmAnalytics(
    @Param('farmId') farmId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.analyticsService.getFarmAnalytics(farmId, userId);
  }

  @Post('farms/:farmId')
  @ApiOperation({ summary: 'Create analytics entry for a farm' })
  async createAnalyticsEntry(
    @Param('farmId') farmId: string,
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ) {
    return this.analyticsService.createAnalyticsEntry(farmId, userId, body);
  }
}
