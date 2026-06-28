import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginCommentDTO {
  @ApiProperty({ description: 'Номер страницы', required: false, default: 1 })
  @IsOptional()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Количество комментариев на 1 странице',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  limit?: number;
}
