import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Заголовок является обязательным ' })
  @IsString()
  @MinLength(3, { message: 'Миинимальная длина заголовка - 3 символа' })
  title: string;

  @IsNotEmpty({ message: 'Содержание поста не должно быть пустым' })
  @IsString()
  @MinLength(5, { message: 'Минимальная длина содержания поста - 5 символов' })
  content: string;
}
