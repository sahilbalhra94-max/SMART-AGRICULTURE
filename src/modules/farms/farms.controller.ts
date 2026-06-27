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
import { FarmsService } from './farms.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@ApiTags('Farms')
@ApiBearerAuth()
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all farms for current user' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.farmsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get farm by ID' })
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.farmsService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new farm' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateFarmDto) {
    return this.farmsService.create(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a farm' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateFarmDto,
  ) {
    return this.farmsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a farm' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.farmsService.remove(id, userId);
  }
}
