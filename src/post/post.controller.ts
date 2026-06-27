import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service.js';
import { CreatePostDto } from './dto/create.post.dto.js';
import { queryPostDTO } from './dto/pag.filtr.sort.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { rolesAll } from '../auth/decorators/role.decorator.js';
import { UpdatePostDto } from './dto/update.post.dto.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Поиск списка постов' })
  @ApiResponse({ status: 200, description: 'Успешное получение постов' })
  @ApiResponse({ status: 404, description: 'Посты не найдены' })
  @Get()
  async findAll(@Query() query: queryPostDTO) {
    return this.postService.findAllPosts(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание поста' })
  @ApiResponse({ status: 201, description: 'Пост успешно создан' })
  @ApiResponse({ status: 403, description: 'Нет прав для создание поста' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin', 'User'])
  @Post()
  async create(@Body() dto: CreatePostDto, @Request() req: any) {
    return this.postService.createPost(dto, req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление поста' })
  @ApiParam({
    name: 'id',
    description: 'ID поста (UUID)',
    example: '537cb71d-7876-4481-93e0-6b8c1a51de71',
  })
  @ApiResponse({ status: 200, description: 'Пост успешно обновлен' })
  @ApiResponse({ status: 403, description: 'Нет прав для обновления поста' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Пост для обновления не найден' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin', 'User'])
  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Request() req: any,
  ) {
    return this.postService.updatePost(dto, id, req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление поста' })
  @ApiResponse({ status: 200, description: 'Пост успешно удален' })
  @ApiParam({
    name: 'id',
    description: 'ID поста (UUID)',
    example: '537cb71d-7876-4481-93e0-6b8c1a51de71',
  })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 403, description: 'Нет прав для удаления поста' })
  @ApiResponse({ status: 404, description: 'Пост для удаления не найден' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin', 'User'])
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.postService.deletePost(id, req.user);
  }
}
