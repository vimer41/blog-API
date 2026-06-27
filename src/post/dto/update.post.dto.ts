import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Новый заголовок поста',
    example: 'Новый крутой пост',
    nullable: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Миинимальная длина заголовка - 3 символа' })
  title?: string;

  @ApiProperty({
    description: 'Новый текст поста',
    example: 'Новое крутое содержание',
    nullable: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Минимальная длина содержания поста - 5 символов' })
  content?: string;
}
