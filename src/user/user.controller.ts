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
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { UpdateRoleDto } from './dto/update.role.dto.js';
import { CreateUserDTO } from './dto/create.user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDTO) {
    return this.userService.createUser(dto);
  }

  @Get()
  async getAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id/role')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.userService.updateRole(id, dto.role);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
