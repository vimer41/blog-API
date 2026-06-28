import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDTO {
  @ApiProperty({
    description: 'Содержимое комментария',
    example: 'красавчик крутая ручка у тебя',
    required: true,
  })
  @IsNotEmpty({ message: 'Комментарий не может быть пустым' })
  @IsString()
  @MinLength(1, {
    message: 'Минимальная длина комметрария начинается с 1 символа',
  })
  content: string;
}
