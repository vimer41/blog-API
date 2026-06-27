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

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('post/:postId')
  async getComments(
    @Query() dto: PaginCommentDTO,
    @Param('postId') postId: string,
  ) {
    return this.commentService.findAllComments(postId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('post/:postId')
  async createComment(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDTO,
    @Req() req,
  ) {
    return this.commentService.createComment(postId, dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Req() req,
    @Body() dto: UpdateCommentDTO,
  ) {
    return this.commentService.updateComment(commentId, dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: string, @Req() req) {
    return this.commentService.deleteComment(commentId, req.user);
  }
}
