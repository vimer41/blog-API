import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty({ message: 'Имя пользователя является обязательным' })
  username: string;

  @IsEmail({}, { message: 'Неверный формат почты' })
  @IsNotEmpty({ message: 'Почта является обязательной' })
  email: string;

  @IsNotEmpty({ message: 'Пароль является обязательнымм' })
  @IsString()
  @MinLength(8, { message: 'Минимальное количество символов пароля - 8' })
  password: string;
}
