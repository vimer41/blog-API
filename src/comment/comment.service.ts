import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaginCommentDTO } from './dto/pag.dto.js';
import { Prisma } from '../generated/prisma/client.js';
import { CreateCommentDTO } from './dto/create.comment.dto.js';
import { JwtPayloadInterface } from '../auth/interfaces/jwt.payload.interface.js';
import { PostService } from '../post/post.service.js';
import { UpdateCommentDTO } from './dto/update.comment.dto.js';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postService: PostService,
  ) {}

  async createComment(
    postId: string,
    dto: CreateCommentDTO,
    user: JwtPayloadInterface,
  ) {
    const post = await this.postService.findPostById(postId);
    if (!post) {
      throw new NotFoundException(
        `Поста ${postId}, который вы хотите прокоментировать не существует`,
      );
    }

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        authorId: user.id,
        postId: postId,
      },
    });
  }

  async findAllComments(postId: string, dto: PaginCommentDTO) {
    const { page = 1, limit = 10 } = dto;

    const skip = (page - 1) * limit;

    const comments = await this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
      skip: skip,
      take: limit,
    });

    if (comments.length === 0) {
      throw new NotFoundException(`Комменты для ${postId} поста не найдены`);
    }

    return comments;
  }

  async updateComment(
    commentId: string,
    dto: UpdateCommentDTO,
    user: JwtPayloadInterface,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Комментарий для редактирования не найден');
    }

    if (comment.authorId !== user.id && user.role !== 'Admin') {
      throw new ForbiddenException(
        'У вас нет доступа к редактированию чужого комментария ',
      );
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: dto.content,
      },
    });
  }

  async deleteComment(commentId: string, user: JwtPayloadInterface) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Комментарий для удаления не найден');
    }

    if (comment.authorId !== user.id && user.role !== 'Admin') {
      throw new ForbiddenException(
        'У вас нет доступа к редактированию чужого комментария ',
      );
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
    return { message: `Комментарий ${commentId} был успшено удален` };
  }
}
