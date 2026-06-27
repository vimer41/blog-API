import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePostDto } from './dto/create.post.dto.js';
import { queryPostDTO } from './dto/pag.filtr.sort.dto.js';
import { Prisma } from '../generated/prisma/client.js';
import { SortByEnum } from './enums/sort.by.enum.js';
import { UpdatePostDto } from './dto/update.post.dto.js';
import { JwtPayloadInterface } from '../auth/interfaces/jwt.payload.interface.js';
@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(dto: CreatePostDto, user: JwtPayloadInterface) {
    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        authorId: user.id,
      },
    });
  }

  async findAllPosts(query: queryPostDTO) {
    const {
      page = 1,
      limit = 10,
      title,
      sortBy,
      authorId,
      sortOrder,
      createdAt,
    } = query;
    const skip: number = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {};

    if (title) {
      where.title = {
        contains: title,
      };
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (createdAt) {
      where.createdAt = {
        gte: new Date(createdAt),
      };
    }

    let orderBy: Prisma.PostOrderByWithRelationInput = {};

    if (sortBy === SortByEnum.LIKES) {
      orderBy = { Like: { _count: sortOrder } };
    } else {
      orderBy = { createdAt: sortOrder };
    }

    const posts = await this.prisma.post.findMany({
      where: where,
      skip: skip,
      orderBy: orderBy,
      take: limit,
    });

    if (!posts) {
      throw new NotFoundException('Посты не найдены');
    }

    return posts;
  }

  async findPostById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async updatePost(dto: UpdatePostDto, id: string, user: JwtPayloadInterface) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Такого поста не существует');
    }

    if (post.authorId !== user.id && user.role !== 'Admin') {
      throw new ForbiddenException(
        'У вас нет доступа для изменения данного поста',
      );
    }

    return this.prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title: dto.title,
        content: dto.content,
      },
    });
  }

  async deletePost(id: string, user: JwtPayloadInterface) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Такого поста не существует');
    }

    if (post.authorId !== user.id && user.role !== 'Admin') {
      throw new ForbiddenException(
        'У вас нет доступа для изменения или удаления данного поста',
      );
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return { details: 'Пост был успешно удален' };
  }
}
