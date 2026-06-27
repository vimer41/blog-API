import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentDTO {
  @IsNotEmpty({ message: 'Комментарий не может быть пустым' })
  @IsString()
  @MinLength(1, {
    message: 'Минимальная длина комметрария начинается с 1 символа',
  })
  content: string;
}
