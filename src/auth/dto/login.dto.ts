import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
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
  @IsNotEmpty({ message: 'Пароль является обязательным' })
  @IsString()
  @MinLength(8, { message: 'Минимальное количество символов пароля - 8' })
  password: string;
}
