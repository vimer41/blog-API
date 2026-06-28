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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin'])
  @Post()
  async createUser(@Body() dto: CreateUserDTO) {
    return this.userService.createUser(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin'])
  @Get()
  async getAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin'])
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin'])
  @Patch(':id/role')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.userService.updateRole(id, dto.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin'])
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
