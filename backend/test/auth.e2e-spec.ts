import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import * as bcrypt from 'bcrypt';
const request = (supertest as any).default ?? supertest;
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

/**
 * Integration test end-to-end untuk Auth
 * Menggunakan mock PrismaService agar tidak butuh database nyata
 */
describe('Auth (e2e)', () => {
  let app: INestApplication;

  const mockUser = {
    id: 'uuid-e2e-1',
    email: 'e2e@example.com',
    password: '$2b$10$hashedpasswordvalue',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user and return 201 without password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'e2e@example.com', password: 'password123' })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', 'e2e@example.com');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 409 when email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'e2e@example.com', password: 'password123' })
        .expect(409);
    });

    it('should return 400 for invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'not-an-email', password: 'password123' })
        .expect(400);
    });

    it('should return 400 for password shorter than 8 characters', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'e2e@example.com', password: 'short' })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login and return access_token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // Hash password yang cocok dengan mockUser.password
      const realHash = await bcrypt.hash('password123', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: realHash,
      });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e@example.com', password: 'password123' })
        .expect(200);

      expect(res.body).toHaveProperty('access_token');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should return 401 for wrong password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e@example.com', password: 'wrongpassword' })
        .expect(401);
    });

    it('should return 401 for non-existent email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'notfound@example.com', password: 'password123' })
        .expect(401);
    });
  });

  describe('GET /auth/me', () => {
    it('should return user data with valid token', async () => {
      // Login dulu untuk dapat token
      const realHash = await bcrypt.hash('password123', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: realHash,
      });

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e@example.com', password: 'password123' });

      const token = loginRes.body.access_token;

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('email', 'e2e@example.com');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });
  });
});
