import { Role } from '../../generated/prisma/enums.js';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Новая роль для пользователя (Admin, User или Reader)',
    example: 'User',
    required: true,
    enum: Role,
  })
  @IsEnum(Role, {
    message: 'Роль должны быть одна из списка: Admin, User, Reader',
  })
  @IsNotEmpty({ message: 'Поле изменение роли обязательно' })
  role: Role;
}
