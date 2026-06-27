import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SensorsService } from './sensors.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Sensors')
@ApiBearerAuth()
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sensors' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.sensorsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sensor by ID' })
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.sensorsService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new sensor' })
  async create(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.sensorsService.create(userId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update sensor' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ) {
    return this.sensorsService.update(id, userId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete sensor' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.sensorsService.remove(id, userId);
  }

  @Get(':id/readings')
  @ApiOperation({ summary: 'Get sensor readings' })
  async getReadings(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.sensorsService.getReadings(id, userId);
  }

  @Post(':id/readings')
  @ApiOperation({ summary: 'Add sensor reading' })
  async addReading(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ) {
    return this.sensorsService.addReading(id, userId, body);
  }
}
