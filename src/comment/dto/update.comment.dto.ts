import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDTO {
  @ApiProperty({
    description: 'Содержимое комментария',
    example: 'красавчик крутая ручка у тебя',
    required: true,
  })
  @IsOptional()
  @IsString()
  @MinLength(1, {
    message: 'Минимальная длина комметрария начинается с 1 символа',
  })
  content: string;
}
