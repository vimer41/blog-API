import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard.js';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('post/:postId')
  async likeToPost(@Param('postId') postId: string, @Req() req) {
    return this.likeService.createLike(postId, req.user);
  }
}
