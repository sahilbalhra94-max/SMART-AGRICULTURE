import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IrrigationService } from './irrigation.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Irrigation')
@ApiBearerAuth()
@Controller('irrigation')
export class IrrigationController {
  constructor(private readonly irrigationService: IrrigationService) {}

  @Get('zones')
  @ApiOperation({ summary: 'Get all irrigation zones' })
  async getZones(@CurrentUser('id') userId: string) {
    return this.irrigationService.getZones(userId);
  }

  @Post('zones')
  @ApiOperation({ summary: 'Create irrigation zone' })
  async createZone(
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ) {
    return this.irrigationService.createZone(userId, body);
  }

  @Patch('zones/:id')
  @ApiOperation({ summary: 'Update irrigation zone' })
  async updateZone(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ) {
    return this.irrigationService.updateZone(id, userId, body);
  }

  @Get('schedules')
  @ApiOperation({ summary: 'Get all irrigation schedules' })
  async getSchedules(@CurrentUser('id') userId: string) {
    return this.irrigationService.getSchedules(userId);
  }

  @Post('schedules')
  @ApiOperation({ summary: 'Create irrigation schedule' })
  async createSchedule(
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ) {
    return this.irrigationService.createSchedule(userId, body);
  }

  @Patch('schedules/:id')
  @ApiOperation({ summary: 'Update irrigation schedule' })
  async updateSchedule(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ) {
    return this.irrigationService.updateSchedule(id, userId, body);
  }
}
