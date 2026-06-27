import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Миинимальная длина заголовка - 3 символа' })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Минимальная длина содержания поста - 5 символов' })
  content?: string;
}
