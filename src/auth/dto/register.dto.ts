import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Дмитрий',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty({ message: 'Имя пользователя является обязательным' })
  username: string;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'pochta@example.com',
    nullable: false,
  })
  @IsEmail({}, { message: 'Неверный формат почты' })
  @IsNotEmpty({ message: 'Почта является обязательной' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя от 8 символов',
    example: '12345678',
    nullable: false,
  })
  @IsNotEmpty({ message: 'Пароль является обязательнымм' })
  @IsString()
  @MinLength(8, { message: 'Минимальное количество символов пароля - 8' })
  password: string;
}
