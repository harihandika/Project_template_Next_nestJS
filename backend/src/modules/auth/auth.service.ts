import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hashPassword, comparePassword } from '../../common/utils/password.util';

export interface UserResponse {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  access_token: string;
  user: UserResponse;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<UserResponse> {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashed = await hashPassword(dto.password);
    const user = await this.userService.create({ email: dto.email, password: hashed });

    const { password: _, ...result } = user;
    return result;
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    const isValid = await comparePassword(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    const { password: _, ...userResult } = user;
    return { access_token, user: userResult };
  }

  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan');
    }

    const { password: _, ...result } = user;
    return result;
  }
}
