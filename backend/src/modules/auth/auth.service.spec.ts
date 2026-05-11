import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as passwordUtil from '../../common/utils/password.util';

const mockUser = {
  id: 'uuid-1',
  email: 'test@example.com',
  password: 'hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register successfully and return user without password', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);
      jest.spyOn(passwordUtil, 'hashPassword').mockResolvedValue('hashedpassword');

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@example.com');
      expect(result.id).toBe('uuid-1');
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({ email: 'test@example.com', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login successfully and return access_token', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(passwordUtil, 'comparePassword').mockResolvedValue(true);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token', 'mock.jwt.token');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedException when email not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'notfound@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(passwordUtil, 'comparePassword').mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
