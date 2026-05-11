// Feature: backend-authentication, Property 1: Hash tidak sama dengan plaintext
// Feature: backend-authentication, Property 2: Verifikasi password round-trip
// Feature: backend-authentication, Property 3: Hash berbeda untuk password yang sama
import * as fc from 'fast-check';
import { hashPassword, comparePassword } from './password.util';

/**
 * Property 1: Hash tidak sama dengan plaintext
 * Validates: Requirements 3.1, 3.2
 */
describe('PasswordHasher - Property Tests', () => {
  describe('Property 1: Hash tidak sama dengan plaintext', () => {
    it('should never produce a hash equal to the plaintext', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 72 }),
          async (password) => {
            const hash = await hashPassword(password);
            expect(hash).not.toBe(password);
          },
        ),
        { numRuns: 20 },
      );
    }, 60000);
  });

  /**
   * Property 2: Verifikasi password round-trip
   * Validates: Requirements 3.3
   */
  describe('Property 2: Verifikasi password round-trip', () => {
    it('should always verify correctly after hashing', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 72 }),
          async (password) => {
            const hash = await hashPassword(password);
            const isValid = await comparePassword(password, hash);
            expect(isValid).toBe(true);
          },
        ),
        { numRuns: 20 },
      );
    }, 60000);
  });

  /**
   * Property 3: Hash berbeda untuk password yang sama
   * Validates: Requirements 3.2
   */
  describe('Property 3: Hash berbeda untuk password yang sama', () => {
    it('should produce different hashes for the same password', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 72 }),
          async (password) => {
            const hash1 = await hashPassword(password);
            const hash2 = await hashPassword(password);
            expect(hash1).not.toBe(hash2);
          },
        ),
        { numRuns: 20 },
      );
    }, 60000);
  });
});
