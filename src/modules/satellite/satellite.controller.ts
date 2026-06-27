import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SatelliteService } from './satellite.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Satellite')
@ApiBearerAuth()
@Controller('satellite')
export class SatelliteController {
  constructor(private readonly satelliteService: SatelliteService) {}

  @Get(':farmId')
  @ApiOperation({ summary: 'Get satellite data for a farm' })
  async getData(
    @Param('farmId') farmId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.satelliteService.getData(farmId, userId);
  }

  @Post(':farmId')
  @ApiOperation({ summary: 'Fetch new satellite data for a farm' })
  async fetchNewData(
    @Param('farmId') farmId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.satelliteService.fetchNewData(farmId, userId);
  }
}
