import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDTO } from './dto/create.user.dto.js';
import * as bcrypt from 'bcrypt';
import { Role } from '../generated/prisma/enums.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDTO) {
    const { username, email, password } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже сущетсвует');
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: username,
        email: email,
        passwordHash: hash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
  }

  async updateRole(id: string, newRol: Role) {
    try {
      return await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          role: newRol,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Пользователь не найден');
      }
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
        select: {
          id: true,
        },
      });

      return {
        message: `Пользователь с id ${user.id} удален`,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Пользователь не найден');
      }
    }
  }
}
