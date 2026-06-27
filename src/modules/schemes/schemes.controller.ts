import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SchemesService } from './schemes.service';

@ApiTags('Schemes')
@ApiBearerAuth()
@Controller('schemes')
export class SchemesController {
  constructor(private readonly schemesService: SchemesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all schemes' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'state', required: false })
  async findAll(
    @Query('category') category?: string,
    @Query('state') state?: string,
  ) {
    return this.schemesService.findAll(category, state);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get scheme by ID' })
  async findOne(@Param('id') id: string) {
    return this.schemesService.findOne(id);
  }
}
