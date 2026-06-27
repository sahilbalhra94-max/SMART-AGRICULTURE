import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Weather')
@ApiBearerAuth()
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current weather' })
  @ApiQuery({ name: 'latitude', required: true })
  @ApiQuery({ name: 'longitude', required: true })
  async getCurrentWeather(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ) {
    return this.weatherService.getCurrentWeather(
      Number(latitude),
      Number(longitude),
    );
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Get weather forecast' })
  @ApiQuery({ name: 'latitude', required: true })
  @ApiQuery({ name: 'longitude', required: true })
  @ApiQuery({ name: 'days', required: false })
  async getForecast(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('days') days?: number,
  ) {
    return this.weatherService.getForecast(
      Number(latitude),
      Number(longitude),
      days ? Number(days) : 3,
    );
  }

  @Get('historical')
  @ApiOperation({ summary: 'Get historical weather' })
  @ApiQuery({ name: 'latitude', required: true })
  @ApiQuery({ name: 'longitude', required: true })
  @ApiQuery({ name: 'date', required: true })
  async getHistorical(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('date') date: string,
  ) {
    return this.weatherService.getHistorical(
      Number(latitude),
      Number(longitude),
      date,
    );
  }
}
