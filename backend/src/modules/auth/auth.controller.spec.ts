import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const mockUserResponse = {
  id: 'uuid-1',
  email: 'test@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockLoginResponse = {
  access_token: 'mock.jwt.token',
  user: mockUserResponse,
};

const mockAuthService = {
  register: jest.fn().mockResolvedValue(mockUserResponse),
  login: jest.fn().mockResolvedValue(mockLoginResponse),
  getMe: jest.fn().mockResolvedValue(mockUserResponse),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should return user without password on success', async () => {
      mockAuthService.register.mockResolvedValue(mockUserResponse);

      const result = await controller.register({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockUserResponse);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('POST /auth/login', () => {
    it('should return access_token and user on success', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token', 'mock.jwt.token');
      expect(result.user).not.toHaveProperty('password');
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user data with valid token', async () => {
      mockAuthService.getMe.mockResolvedValue(mockUserResponse);

      const req = { user: { userId: 'uuid-1', email: 'test@example.com' } };
      const result = await controller.getMe(req);

      expect(result).toEqual(mockUserResponse);
      expect(mockAuthService.getMe).toHaveBeenCalledWith('uuid-1');
    });

    it('should be protected by JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        AuthController.prototype.getMe,
      );
      expect(guards).toBeDefined();
      expect(guards.length).toBeGreaterThan(0);
    });
  });
});
