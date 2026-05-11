// Feature: backend-authentication, Property 6: Email duplikat selalu ditolak
import * as fc from 'fast-check';
import { UserService } from './user.service';

/**
 * Property 6: Email duplikat selalu ditolak
 * Validates: Requirements 1.2
 *
 * Untuk setiap email yang sudah ada di database,
 * percobaan create ulang dengan email yang sama harus selalu menghasilkan error.
 */
describe('UserService - Property Tests', () => {
  describe('Property 6: Email duplikat selalu ditolak', () => {
    it('should always throw when creating user with duplicate email', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          async (email) => {
            // Setup mock: simulasi email sudah ada di DB
            const existingUser = {
              id: 'existing-uuid',
              email,
              password: 'hashedpassword',
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            // Mock PrismaService: create melempar error Prisma P2002 (unique constraint)
            const prismaError = Object.assign(new Error('Unique constraint failed'), {
              code: 'P2002',
              meta: { target: ['email'] },
            });

            const mockPrisma = {
              user: {
                findUnique: jest.fn().mockResolvedValue(existingUser),
                create: jest.fn().mockRejectedValue(prismaError),
              },
            };

            const service = new UserService(mockPrisma as any);

            // Verifikasi: create dengan email yang sama harus throw
            await expect(
              service.create({ email, password: 'newpassword' }),
            ).rejects.toThrow();

            // Verifikasi: findByEmail mengembalikan user yang sudah ada
            const found = await service.findByEmail(email);
            expect(found).not.toBeNull();
            expect(found?.email).toBe(email);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
