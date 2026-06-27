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

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll(@Query() query: queryPostDTO) {
    return this.postService.findAllPosts(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin', 'User'])
  @Post()
  async create(@Body() dto: CreatePostDto, @Request() req: any) {
    return this.postService.createPost(dto, req.user);
  }

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @rolesAll(['Admin', 'User'])
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.postService.deletePost(id, req.user);
  }
}
