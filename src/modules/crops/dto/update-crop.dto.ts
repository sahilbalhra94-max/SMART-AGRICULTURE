import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCropDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  variety?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expectedHarvestDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  actualHarvestDate?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  area?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  healthScore?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  moisture?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  growthStage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;
}
