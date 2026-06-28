import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { UpdateRoleDto } from './dto/update.role.dto.js';
import { CreateUserDTO } from './dto/create.user.dto.js';
import { rolesAll } from '../auth/decorators/role.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Пользователи только для админа')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({
    status: 403,
    description: 'Доступ запрещен, только Admin',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin'])
  @Post()
  async createUser(@Body() dto: CreateUserDTO) {
    return this.userService.createUser(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей получен',
  })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({
    status: 403,
    description: 'Доступ запрещен, только Admin',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin'])
  @Get()
  async getAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение одного пользователя по uuid' })
  @ApiResponse({ status: 200, description: 'Пользователь найден' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({
    status: 403,
    description: 'Доступ запрещен, только Admin',
  })
  @ApiParam({
    name: 'id',
    description: 'uuid пользователя',
    example: 'ffed541e-a5fe-4cd3-88de-542c70b07111',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin'])
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Изменение роли пользователя по uuid' })
  @ApiResponse({ status: 200, description: 'Роль успешно изменена' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({
    status: 404,
    description: 'Пользователь для изменения роли не найден',
  })
  @ApiResponse({
    status: 403,
    description: 'Доступ запрещен, только Admin',
  })
  @ApiParam({
    name: 'id',
    description: 'uuid пользователя',
    example: 'ffed541e-a5fe-4cd3-88de-542c70b07111',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin'])
  @Patch(':id/role')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.userService.updateRole(id, dto.role);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({
    status: 403,
    description: 'Доступ запрещен, только Admin',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь для удаления не найден',
  })
  @ApiParam({
    name: 'id',
    description: 'uuid пользователя',
    example: 'ffed541e-a5fe-4cd3-88de-542c70b07111',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin'])
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
