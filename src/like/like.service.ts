import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PostService } from '../post/post.service.js';
import { JwtPayloadInterface } from '../auth/interfaces/jwt.payload.interface.js';

@Injectable()
export class LikeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postService: PostService,
  ) {}

  async getLikes(postId: string) {
    const post = await this.postService.findPostById(postId);

    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    const countLikesOfPost = await this.prisma.like.count({
      where: { postId },
    });

    return {
      postId,
      countLikesOfPost,
    };
  }

  async createLike(postId: string, user: JwtPayloadInterface) {
    const post = await this.postService.findPostById(postId);
    if (!post) {
      throw new NotFoundException(
        'Пост которому вы пытаетесь поставить лайк не существует',
      );
    }

    const existLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          postId: postId,
          userId: user.id,
        },
      },
    });

    if (existLike) {
      await this.prisma.like.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: postId,
          },
        },
      });

      return { message: 'Лайк убран' };
    } else {
      await this.prisma.like.create({
        data: {
          userId: user.id,
          postId: postId,
        },
      });

      return { message: 'Лайк поставлен' };
    }
  }
}
