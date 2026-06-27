import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../generated/prisma/client.js';
import { RegisterDto } from './dto/register.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDTO } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.userService.createUser(dto);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async login(user: Omit<User, 'passwordHash'>) {
    const { accessToken, refreshToken } =
      await this.genAccessAndRefreshToken(user);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });

    return {
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshTokens(badToken: string) {
    const tokenDb = await this.prisma.refreshToken.findFirst({
      where: {
        token: badToken,
      },
    });

    if (!tokenDb) {
      throw new UnauthorizedException('Данного Refresh токена не существует');
    }

    await this.prisma.refreshToken.delete({
      where: {
        token: badToken,
      },
    });

    const user = await this.userService.findById(tokenDb.userId);

    if (!user) {
      throw new UnauthorizedException('Данного Refresh токена не существует');
    }
    const { accessToken, refreshToken } =
      await this.genAccessAndRefreshToken(user);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });
    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId: userId,
      },
    });

    return { details: 'Выход успешен' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isMatchedPassHash = await bcrypt.compare(password, user.passwordHash);
    if (isMatchedPassHash) {
      const { passwordHash, ...result } = user;
      return result;
    }

    return null;
  }

  private async genAccessAndRefreshToken(user: Omit<User, 'passwordHash'>) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '15d',
    });

    return { accessToken, refreshToken };
  }
}
