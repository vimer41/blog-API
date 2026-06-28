import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service.js';
import { PaginCommentDTO } from './dto/pag.dto.js';
import { CreateCommentDTO } from './dto/create.comment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard.js';
import { UpdateCommentDTO } from './dto/update.comment.dto.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Комментарии')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Просмотр комментариев к посту' })
  @ApiResponse({ status: 200, description: 'Успешное получение комментариев' })
  @ApiResponse({ status: 404, description: 'Комментарии не найдены' })
  @ApiParam({
    name: 'postId',
    description: 'uuid поста',
    example: 'ffed541e-a5fe-4cd3-88de-542c70b07111',
  })
  @Get('post/:postId')
  async getComments(
    @Query() dto: PaginCommentDTO,
    @Param('postId') postId: string,
  ) {
    return this.commentService.findAllComments(postId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание комментариев к посту' })
  @ApiParam({
    name: 'postId',
    description: 'uuid поста',
    example: 'ffed541e-a5fe-4cd3-88de-542c70b07111',
  })
  @ApiResponse({ status: 201, description: 'Комментарий успешно создан' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({
    status: 404,
    description: 'Пост к которому вы хотите оставить комментарий не найден',
  })
  @UseGuards(JwtAuthGuard)
  @Post('post/:postId')
  async createComment(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDTO,
    @Req() req,
  ) {
    return this.commentService.createComment(postId, dto, req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Редактирование комментария' })
  @ApiParam({
    name: 'commentId',
    description: 'uuid комментаррия',
    example: 'ffed541e-a5fe-4cd3-88de-542c70b07111',
  })
  @ApiResponse({ status: 200, description: 'Комментарий успешно обновлен' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({
    status: 403,
    description: 'У вас нет доступа к редактированию чужого комментария',
  })
  @ApiResponse({
    status: 404,
    description: 'Комментарий для редактирования не найден',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Req() req,
    @Body() dto: UpdateCommentDTO,
  ) {
    return this.commentService.updateComment(commentId, dto, req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление комментария' })
  @ApiParam({
    name: 'commentId',
    description: 'uuid комментария',
    example: 'ffed541e-a5fe-4cd3-88de-542c70b07111',
  })
  @ApiResponse({
    status: 200,
    description: 'Комментарий commentId был успешно удален',
  })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({
    status: 403,
    description: 'У вас нет доступа к редактированию чужого комментария',
  })
  @ApiResponse({
    status: 404,
    description: 'Комментарий для удаления не найден',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: string, @Req() req) {
    return this.commentService.deleteComment(commentId, req.user);
  }
}
