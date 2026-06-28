import { SortByEnum } from '../enums/sort.by.enum.js';
import { SortOrder } from '../enums/sort.asc.desc.enum.js';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class queryPostDTO {
  @ApiProperty({ description: 'Номер страницы', required: false, default: 1 })
  @IsOptional()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Количество записей на странице',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ description: 'Поиск по заголовку', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Фильтр по автору uuid', required: false })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiProperty({ description: 'Дата создания', required: false })
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiProperty({ description: 'Сортировка', required: false, enum: SortByEnum })
  @IsOptional()
  @IsEnum(SortByEnum)
  sortBy?: SortByEnum = SortByEnum.CREATED_AT;

  @ApiProperty({
    description: 'Вид сортировки (ASC или DESC)',
    required: false,
    enum: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
