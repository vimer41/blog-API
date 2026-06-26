import { Role } from '../../generated/prisma/enums.js';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsEnum(Role, {
    message: 'Роль должны быть одна из списка: Admin, User, Reader',
  })
  @IsNotEmpty({ message: 'Поле изменение роли обязательно' })
  role: Role;
}
