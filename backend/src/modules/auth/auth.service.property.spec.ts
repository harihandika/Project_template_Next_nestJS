// Feature: backend-authentication, Property 7: Response tidak mengandung field password
// Feature: backend-authentication, Property 8: Input invalid selalu ditolak
import * as fc from 'fast-check';
import { AuthService } from './auth.service';
import * as passwordUtil from '../../common/utils/password.util';
import { ConflictException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './dto/register.dto';

/**
 * Property 7: Response tidak mengandung field password
 * Validates: Requirements 1.6, 2.4, 6.3
 */
describe('AuthService - Property Tests', () => {
  describe('Property 7: Response tidak mengandung field password', () => {
    it('register response should never contain password field', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 8, maxLength: 20 }),
          }),
          async ({ email, password }) => {
            const mockUser = {
              id: 'uuid-test',
              email,
              password: 'hashedvalue',
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            const mockUserService = {
              findByEmail: jest.fn().mockResolvedValue(null),
              findById: jest.fn(),
              create: jest.fn().mockResolvedValue(mockUser),
            };
            const mockJwtService = { sign: jest.fn().mockReturnValue('token') };

            jest.spyOn(passwordUtil, 'hashPassword').mockResolvedValue('hashedvalue');

            const service = new AuthService(mockUserService as any, mockJwtService as any);
            const result = await service.register({ email, password });

            expect(result).not.toHaveProperty('password');
          },
        ),
        { numRuns: 50 },
      );
    }, 30000);

    it('login response should never contain password field', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 8, maxLength: 20 }),
          }),
          async ({ email, password }) => {
            const mockUser = {
              id: 'uuid-test',
              email,
              password: 'hashedvalue',
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            const mockUserService = {
              findByEmail: jest.fn().mockResolvedValue(mockUser),
              findById: jest.fn(),
              create: jest.fn(),
            };
            const mockJwtService = { sign: jest.fn().mockReturnValue('token') };

            jest.spyOn(passwordUtil, 'comparePassword').mockResolvedValue(true);

            const service = new AuthService(mockUserService as any, mockJwtService as any);
            const result = await service.login({ email, password });

            expect(result.user).not.toHaveProperty('password');
          },
        ),
        { numRuns: 50 },
      );
    }, 30000);
  });

  /**
   * Property 8: Input invalid selalu ditolak
   * Validates: Requirements 1.3, 1.4
   */
  describe('Property 8: Input invalid selalu ditolak', () => {
    it('should reject non-email strings', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1 }).filter((s) => !s.includes('@')),
          fc.string({ minLength: 8 }),
          async (invalidEmail, password) => {
            const dto = plainToInstance(RegisterDto, { email: invalidEmail, password });
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            const emailErrors = errors.filter((e) => e.property === 'email');
            expect(emailErrors.length).toBeGreaterThan(0);
          },
        ),
        { numRuns: 50 },
      );
    }, 30000);

    it('should reject passwords shorter than 8 characters', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 7 }),
          async (email, shortPassword) => {
            const dto = plainToInstance(RegisterDto, { email, password: shortPassword });
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            const passwordErrors = errors.filter((e) => e.property === 'password');
            expect(passwordErrors.length).toBeGreaterThan(0);
          },
        ),
        { numRuns: 50 },
      );
    }, 30000);
  });
});
