import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Заголовок поста',
    example: 'Крутой пост',
    required: true,
  })
  @IsNotEmpty({ message: 'Заголовок является обязательным ' })
  @IsString()
  @MinLength(3, { message: 'Миинимальная длина заголовка - 3 символа' })
  title: string;

  @ApiProperty({
    description: 'Содержание поста',
    example: 'Пост 2482852',
    required: true,
  })
  @IsNotEmpty({ message: 'Содержание поста не должно быть пустым' })
  @IsString()
  @MinLength(5, { message: 'Минимальная длина содержания поста - 5 символов' })
  content: string;
}
