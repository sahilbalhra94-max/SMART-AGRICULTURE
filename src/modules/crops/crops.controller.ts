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
import { CropsService } from './crops.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@ApiTags('Crops')
@ApiBearerAuth()
@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all crops for current user' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.cropsService.findAll(userId);
  }

  @Get('farm/:farmId')
  @ApiOperation({ summary: 'Get crops by farm ID' })
  async findByFarm(
    @Param('farmId') farmId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.cropsService.findByFarm(farmId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get crop by ID' })
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.cropsService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new crop' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateCropDto) {
    return this.cropsService.create(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a crop' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCropDto,
  ) {
    return this.cropsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a crop' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.cropsService.remove(id, userId);
  }
}
