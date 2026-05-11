// Feature: backend-authentication, Property 4: JWT payload round-trip
// Feature: backend-authentication, Property 5: Token kedaluwarsa ditolak
import * as fc from 'fast-check';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'test-secret-for-property-tests';

/**
 * Property 4: JWT payload round-trip
 * Validates: Requirements 4.1, 4.2
 *
 * Untuk setiap payload valid, sign lalu decode harus menghasilkan payload yang ekuivalen.
 */
describe('JWT - Property Tests', () => {
  describe('Property 4: JWT payload round-trip', () => {
    it('should decode to equivalent payload after signing', () => {
      fc.assert(
        fc.property(
          fc.record({
            sub: fc.uuid(),
            email: fc.emailAddress(),
          }),
          ({ sub, email }) => {
            const token = jwt.sign({ sub, email }, JWT_SECRET, { expiresIn: '7d' });
            const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

            expect(decoded.sub).toBe(sub);
            expect(decoded.email).toBe(email);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  /**
   * Property 5: Token kedaluwarsa ditolak
   * Validates: Requirements 4.5
   *
   * Token dengan expiry yang sudah lewat harus selalu ditolak.
   */
  describe('Property 5: Token kedaluwarsa ditolak', () => {
    it('should always reject expired tokens', () => {
      fc.assert(
        fc.property(
          fc.record({
            sub: fc.uuid(),
            email: fc.emailAddress(),
          }),
          ({ sub, email }) => {
            // Sign token yang sudah expired (iat di masa lalu, exp sudah lewat)
            const expiredToken = jwt.sign(
              { sub, email, iat: Math.floor(Date.now() / 1000) - 10 },
              JWT_SECRET,
              { expiresIn: '1s' },
            );

            // Tunggu sebentar tidak diperlukan karena kita set iat di masa lalu
            // dan expiresIn: '1s' berarti exp = iat + 1 yang sudah lewat
            expect(() => {
              jwt.verify(expiredToken, JWT_SECRET);
            }).toThrow(jwt.TokenExpiredError);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
