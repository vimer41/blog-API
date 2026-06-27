import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginCommentDTO {
  @IsOptional()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  limit?: number;
}
