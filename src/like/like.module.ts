import { Module } from '@nestjs/common';
import { LikeService } from './like.service.js';
import { LikeController } from './like.controller.js';
import { PostModule } from '../post/post.module.js';

@Module({
  imports: [PostModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
