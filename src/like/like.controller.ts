import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Лайки')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Поставить/убрать лайк под постом' })
  @ApiParam({
    name: 'postId',
    description: 'uuid поста к которому нужно поставить лайк',
    example: 'ffed541e-a5fe-4cd3-88de-542c70b07111',
  })
  @ApiResponse({ status: 201, description: 'Лайк поставлен или убран' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({
    status: 404,
    description: 'Пост которому вы пытаетесь поставить лайк не существует',
  })
  @UseGuards(JwtAuthGuard)
  @Post('post/:postId')
  async likeToPost(@Param('postId') postId: string, @Req() req) {
    return this.likeService.createLike(postId, req.user);
  }
}
