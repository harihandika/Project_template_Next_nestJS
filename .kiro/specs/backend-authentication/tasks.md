# Rencana Implementasi: Backend Authentication

## Overview

Implementasi sistem autentikasi backend menggunakan NestJS, Prisma ORM, PostgreSQL, JWT, dan bcrypt. Setiap task dibangun secara inkremental dan saling terhubung hingga sistem autentikasi berfungsi penuh.

## Tasks

- [x] 1. Setup project NestJS dan konfigurasi awal
  - Inisialisasi project NestJS baru di folder `/backend`
  - Install dependencies: `@nestjs/passport`, `passport`, `passport-jwt`, `@nestjs/jwt`, `bcrypt`, `@prisma/client`, `prisma`, `class-validator`, `class-transformer`, `@nestjs/config`
  - Install dev dependencies: `@types/bcrypt`, `@types/passport-jwt`
  - Setup `ConfigModule` global di `AppModule` untuk membaca environment variables
  - Buat file `.env` dengan variabel: `DATABASE_URL`, `JWT_SECRET`
  - _Requirements: 4.2_

- [x] 2. Setup Prisma dan database schema
  - [x] 2.1 Inisialisasi Prisma dan buat schema User
    - Jalankan `npx prisma init` untuk generate `prisma/schema.prisma`
    - Definisikan model `User` dengan field: `id` (UUID), `email` (unique), `password`, `createdAt`, `updatedAt`
    - Buat `PrismaModule` dan `PrismaService` yang mengextend `PrismaClient`
    - Export `PrismaService` dari `PrismaModule`
    - _Requirements: 6.1_

  - [x] 2.2 Tulis unit test untuk PrismaService
    - Test koneksi database berhasil diinisialisasi
    - _Requirements: 6.1_

- [x] 3. Implementasi UserModule dan UserService
  - [x] 3.1 Buat UserModule dan UserService
    - Buat `src/modules/user/user.module.ts` yang mengimport `PrismaModule`
    - Buat `src/modules/user/user.service.ts` dengan method:
      - `findByEmail(email: string): Promise<User | null>`
      - `findById(id: string): Promise<User | null>`
      - `create(data: { email: string; password: string }): Promise<User>`
    - Export `UserService` dari `UserModule`
    - _Requirements: 6.2, 6.4_

  - [x] 3.2 Tulis unit test untuk UserService
    - Test `findByEmail` mengembalikan user jika ada, null jika tidak ada
    - Test `create` menyimpan user baru ke database
    - Mock `PrismaService` menggunakan Jest mock
    - _Requirements: 6.2_

  - [x] 3.3 Tulis property test untuk UserService
    - **Property 6: Email duplikat selalu ditolak**
    - **Validates: Requirements 1.2**
    - Gunakan `fast-check`: generate random email, create user, create lagi dengan email sama → assert error
    - Tag: `// Feature: backend-authentication, Property 6: Email duplikat selalu ditolak`

- [x] 4. Implementasi hashing password dengan bcrypt
  - [x] 4.1 Buat PasswordHasher utility
    - Buat `src/common/utils/password.util.ts`
    - Implementasi fungsi `hashPassword(password: string): Promise<string>` dengan salt rounds 10
    - Implementasi fungsi `comparePassword(plain: string, hash: string): Promise<boolean>`
    - _Requirements: 3.1, 3.3_

  - [x] 4.2 Tulis property test untuk PasswordHasher
    - **Property 1: Hash tidak sama dengan plaintext**
    - **Validates: Requirements 3.1, 3.2**
    - Gunakan `fast-check`: `fc.string()` → hash → assert hash !== plaintext
    - Tag: `// Feature: backend-authentication, Property 1: Hash tidak sama dengan plaintext`

  - [x] 4.3 Tulis property test untuk verifikasi round-trip
    - **Property 2: Verifikasi password round-trip**
    - **Validates: Requirements 3.3**
    - Gunakan `fast-check`: `fc.string()` → hash → compare → assert true
    - Tag: `// Feature: backend-authentication, Property 2: Verifikasi password round-trip`

  - [x] 4.4 Tulis property test untuk keunikan hash
    - **Property 3: Hash berbeda untuk password yang sama**
    - **Validates: Requirements 3.2**
    - Gunakan `fast-check`: `fc.string()` → hash dua kali → assert hash1 !== hash2
    - Tag: `// Feature: backend-authentication, Property 3: Hash berbeda untuk password yang sama`

- [x] 5. Implementasi AuthModule, AuthService, dan DTO
  - [x] 5.1 Buat DTO untuk registrasi dan login
    - Buat `src/modules/auth/dto/register.dto.ts` dengan `@IsEmail()` dan `@MinLength(8)`
    - Buat `src/modules/auth/dto/login.dto.ts` dengan `@IsEmail()` dan `@IsNotEmpty()`
    - Aktifkan `ValidationPipe` global di `main.ts`
    - _Requirements: 1.3, 1.4, 2.6_

  - [x] 5.2 Buat AuthService dengan method register dan login
    - Buat `src/modules/auth/auth.service.ts`
    - Implementasi `register(dto: RegisterDto)`:
      - Cek email duplikat via `UserService.findByEmail` → throw `ConflictException` jika ada
      - Hash password via `hashPassword`
      - Simpan user via `UserService.create`
      - Return user tanpa field `password` (gunakan destructuring atau `Exclude`)
    - Implementasi `login(dto: LoginDto)`:
      - Cari user via `UserService.findByEmail` → throw `UnauthorizedException` jika tidak ada
      - Verifikasi password via `comparePassword` → throw `UnauthorizedException` jika salah
      - Sign JWT token via `JwtService.sign({ sub: user.id, email: user.email })`
      - Return `{ access_token, user }` tanpa field `password`
    - _Requirements: 1.1, 1.2, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4_

  - [x] 5.3 Tulis unit test untuk AuthService
    - Test `register` berhasil dengan data valid
    - Test `register` gagal dengan email duplikat → ConflictException
    - Test `login` berhasil → mengembalikan access_token
    - Test `login` gagal dengan password salah → UnauthorizedException
    - Mock `UserService` dan `JwtService`
    - _Requirements: 1.1, 1.2, 2.1, 2.3_

  - [x] 5.4 Tulis property test untuk response tanpa password
    - **Property 7: Response tidak mengandung field password**
    - **Validates: Requirements 1.6, 2.4, 6.3**
    - Gunakan `fast-check`: generate random valid user data → register/login → assert tidak ada field `password` di response
    - Tag: `// Feature: backend-authentication, Property 7: Response tidak mengandung field password`

  - [x] 5.5 Tulis property test untuk validasi input
    - **Property 8: Input invalid selalu ditolak**
    - **Validates: Requirements 1.3, 1.4**
    - Gunakan `fast-check`: generate string non-email atau password < 8 char → assert HTTP 400
    - Tag: `// Feature: backend-authentication, Property 8: Input invalid selalu ditolak`

- [x] 6. Implementasi JWT Strategy dan Auth Guard
  - [x] 6.1 Buat JwtStrategy
    - Buat `src/modules/auth/strategies/jwt.strategy.ts`
    - Extend `PassportStrategy(Strategy)` dari `passport-jwt`
    - Konfigurasi `jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()`
    - Konfigurasi `secretOrKey` dari `ConfigService.get('JWT_SECRET')`
    - Implementasi method `validate(payload: JwtPayload)` yang mengembalikan `{ userId: payload.sub, email: payload.email }`
    - _Requirements: 4.4, 4.5_

  - [x] 6.2 Buat JwtAuthGuard
    - Buat `src/modules/auth/guards/jwt-auth.guard.ts`
    - Extend `AuthGuard('jwt')` dari `@nestjs/passport`
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 6.3 Tulis property test untuk JWT payload round-trip
    - **Property 4: JWT payload round-trip**
    - **Validates: Requirements 4.1, 4.2**
    - Gunakan `fast-check`: `fc.record({ sub: fc.uuid(), email: fc.emailAddress() })` → sign → decode → assert equal
    - Tag: `// Feature: backend-authentication, Property 4: JWT payload round-trip`

  - [x] 6.4 Tulis property test untuk token expired
    - **Property 5: Token kedaluwarsa ditolak**
    - **Validates: Requirements 4.5**
    - Generate token dengan `expiresIn: '0s'` → tunggu 1ms → validate → assert UnauthorizedException
    - Tag: `// Feature: backend-authentication, Property 5: Token kedaluwarsa ditolak`

- [x] 7. Implementasi AuthController dan wiring AuthModule
  - [x] 7.1 Buat AuthController dengan semua endpoint
    - Buat `src/modules/auth/auth.controller.ts`
    - Implementasi `POST /auth/register` → panggil `AuthService.register(dto)`
    - Implementasi `POST /auth/login` → panggil `AuthService.login(dto)`
    - Implementasi `GET /auth/me` dengan `@UseGuards(JwtAuthGuard)` → panggil `AuthService.getMe(req.user.userId)`
    - Tambahkan method `getMe(userId: string)` di `AuthService` yang memanggil `UserService.findById`
    - _Requirements: 1.1, 2.1, 5.4_

  - [x] 7.2 Wiring AuthModule
    - Buat `src/modules/auth/auth.module.ts`
    - Import: `UserModule`, `PassportModule`, `JwtModule.registerAsync(...)` dengan secret dari `ConfigService`
    - Providers: `AuthService`, `JwtStrategy`
    - Controllers: `AuthController`
    - Import `AuthModule` di `AppModule`
    - _Requirements: 4.2, 4.3_

  - [x] 7.3 Tulis unit test untuk AuthController
    - Test `POST /auth/register` mengembalikan 201 dan user tanpa password
    - Test `POST /auth/login` mengembalikan 200 dan access_token
    - Test `GET /auth/me` dengan token valid mengembalikan data user
    - Test `GET /auth/me` tanpa token mengembalikan 401
    - _Requirements: 1.6, 2.4, 5.2, 5.4_

- [x] 8. Checkpoint - Pastikan semua test berjalan
  - Pastikan semua test berjalan dengan `npm run test`
  - Pastikan tidak ada error TypeScript dengan `npm run build`
  - Tanyakan kepada user jika ada pertanyaan atau kendala

- [x] 9. Migrasi database dan integrasi akhir
  - [x] 9.1 Jalankan migrasi Prisma
    - Buat file migrasi dengan `npx prisma migrate dev --name init`
    - Pastikan tabel `User` terbuat di PostgreSQL
    - Generate Prisma Client dengan `npx prisma generate`
    - _Requirements: 6.1_

  - [x] 9.2 Tulis integration test end-to-end
    - Test alur lengkap: register → login → akses /auth/me
    - Test alur error: register duplikat, login salah password, akses tanpa token
    - Gunakan database test terpisah
    - _Requirements: 1.1, 2.1, 5.4_

- [x] 10. Checkpoint akhir - Verifikasi semua requirements terpenuhi
  - Pastikan semua test (unit + property) berjalan dengan `npm run test`
  - Verifikasi semua endpoint berfungsi sesuai requirements
  - Tanyakan kepada user jika ada pertanyaan atau kendala

## Catatan

- Setiap task mereferensikan requirements spesifik untuk keterlacakan
- Property tests memvalidasi kebenaran universal menggunakan `fast-check` (min 100 iterasi)
- Unit tests memvalidasi contoh spesifik dan kondisi error
- Checkpoint memastikan validasi inkremental di setiap tahap
