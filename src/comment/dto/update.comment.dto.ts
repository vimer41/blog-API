import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCommentDTO {
  @IsOptional()
  @IsString()
  @MinLength(1, {
    message: 'Минимальная длина комметрария начинается с 1 символа',
  })
  content: string;
}
