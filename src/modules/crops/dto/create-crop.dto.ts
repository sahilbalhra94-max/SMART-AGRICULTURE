import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCropDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  variety?: string;

  @ApiProperty()
  @IsDateString()
  sowingDate: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expectedHarvestDate?: string;

  @ApiProperty()
  @IsNumber()
  area: number;

  @ApiProperty()
  @IsString()
  farmId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  growthStage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;
}
