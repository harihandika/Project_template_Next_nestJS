# Dokumen Requirements

## Pendahuluan

Fitur ini mencakup sistem autentikasi backend menggunakan NestJS. Sistem menyediakan endpoint untuk registrasi dan login pengguna, pengelolaan password menggunakan bcrypt, serta penerbitan dan validasi JWT token untuk proteksi route. Backend dibangun di atas NestJS dengan PostgreSQL sebagai database dan Prisma sebagai ORM.

## Glosarium

- **Auth_Service**: Layanan NestJS yang menangani logika autentikasi (registrasi, login, validasi token)
- **User_Service**: Layanan NestJS yang menangani operasi data pengguna
- **JWT_Strategy**: Strategi Passport.js untuk memvalidasi JWT token pada setiap request
- **Auth_Guard**: Guard NestJS yang memproteksi route dari akses tanpa autentikasi
- **Password_Hasher**: Komponen yang bertanggung jawab melakukan hashing dan verifikasi password menggunakan bcrypt
- **Token**: JWT access token yang diterbitkan setelah login berhasil
- **Payload**: Data yang dikodekan di dalam JWT token (userId, email, role)
- **Prisma_Client**: ORM client yang digunakan untuk berinteraksi dengan database PostgreSQL

---

## Requirements

### Requirement 1: Registrasi Pengguna

**User Story:** Sebagai pengguna baru, saya ingin mendaftarkan akun dengan email dan password, sehingga saya dapat mengakses sistem.

#### Acceptance Criteria

1. WHEN pengguna mengirim request POST ke `/auth/register` dengan email dan password yang valid, THE Auth_Service SHALL membuat akun pengguna baru dan menyimpannya ke database melalui Prisma_Client
2. WHEN pengguna mengirim request registrasi dengan email yang sudah terdaftar, THE Auth_Service SHALL mengembalikan error dengan HTTP status 409 (Conflict) dan pesan "Email sudah terdaftar"
3. WHEN pengguna mengirim request registrasi dengan email yang tidak valid (bukan format email), THE Auth_Service SHALL mengembalikan error dengan HTTP status 400 (Bad Request)
4. WHEN pengguna mengirim request registrasi dengan password kurang dari 8 karakter, THE Auth_Service SHALL mengembalikan error dengan HTTP status 400 (Bad Request)
5. WHEN registrasi berhasil, THE Password_Hasher SHALL menyimpan password dalam bentuk hash bcrypt dengan salt rounds minimal 10, bukan plaintext
6. WHEN registrasi berhasil, THE Auth_Service SHALL mengembalikan HTTP status 201 beserta data pengguna (tanpa field password)

---

### Requirement 2: Login Pengguna

**User Story:** Sebagai pengguna terdaftar, saya ingin login menggunakan email dan password, sehingga saya mendapatkan token untuk mengakses resource yang diproteksi.

#### Acceptance Criteria

1. WHEN pengguna mengirim request POST ke `/auth/login` dengan email dan password yang valid, THE Auth_Service SHALL memverifikasi kredensial dan mengembalikan JWT access token
2. WHEN pengguna mengirim request login dengan email yang tidak terdaftar, THE Auth_Service SHALL mengembalikan error dengan HTTP status 401 (Unauthorized) dan pesan "Kredensial tidak valid"
3. WHEN pengguna mengirim request login dengan password yang salah, THE Auth_Service SHALL mengembalikan error dengan HTTP status 401 (Unauthorized) dan pesan "Kredensial tidak valid"
4. WHEN login berhasil, THE Auth_Service SHALL mengembalikan response berisi `access_token` (JWT) dan data pengguna (tanpa field password)
5. WHEN login berhasil, THE Auth_Service SHALL menerbitkan JWT token dengan masa berlaku 7 hari
6. IF email atau password tidak disertakan dalam request, THEN THE Auth_Service SHALL mengembalikan error dengan HTTP status 400 (Bad Request)

---

### Requirement 3: Hashing Password

**User Story:** Sebagai sistem, saya ingin memastikan password pengguna disimpan dengan aman, sehingga data pengguna terlindungi jika terjadi kebocoran database.

#### Acceptance Criteria

1. THE Password_Hasher SHALL menggunakan algoritma bcrypt dengan salt rounds minimal 10 untuk setiap operasi hashing password
2. WHEN password baru di-hash, THE Password_Hasher SHALL menghasilkan hash yang berbeda untuk password yang sama (karena salt acak)
3. WHEN memverifikasi password saat login, THE Password_Hasher SHALL membandingkan password plaintext dengan hash yang tersimpan menggunakan `bcrypt.compare`
4. THE User_Service SHALL menyimpan hanya hash password ke database, tidak pernah menyimpan plaintext password

---

### Requirement 4: JWT Token

**User Story:** Sebagai sistem, saya ingin menerbitkan dan memvalidasi JWT token, sehingga pengguna yang sudah login dapat mengakses resource yang diproteksi.

#### Acceptance Criteria

1. WHEN JWT token diterbitkan, THE Auth_Service SHALL menyertakan payload berisi `sub` (userId), `email`, dan `iat` (issued at)
2. WHEN JWT token diterbitkan, THE Auth_Service SHALL menandatangani token menggunakan secret key dari environment variable `JWT_SECRET`
3. WHEN JWT token diterbitkan, THE Auth_Service SHALL menetapkan masa berlaku token sebesar 7 hari (`expiresIn: '7d'`)
4. WHEN request masuk dengan JWT token yang valid di header `Authorization: Bearer <token>`, THE JWT_Strategy SHALL mengekstrak payload dan meneruskan data pengguna ke handler
5. IF JWT token tidak valid atau sudah kedaluwarsa, THEN THE JWT_Strategy SHALL mengembalikan error HTTP 401 (Unauthorized)
6. IF header `Authorization` tidak disertakan pada route yang diproteksi, THEN THE Auth_Guard SHALL mengembalikan error HTTP 401 (Unauthorized)

---

### Requirement 5: Proteksi Route

**User Story:** Sebagai developer, saya ingin memproteksi endpoint tertentu agar hanya dapat diakses oleh pengguna yang sudah login, sehingga data sensitif terlindungi.

#### Acceptance Criteria

1. THE Auth_Guard SHALL dapat diterapkan pada controller atau handler manapun menggunakan decorator `@UseGuards(JwtAuthGuard)`
2. WHEN request masuk ke route yang diproteksi tanpa token, THE Auth_Guard SHALL menolak request dengan HTTP status 401
3. WHEN request masuk ke route yang diproteksi dengan token valid, THE Auth_Guard SHALL mengizinkan request dan meneruskan data pengguna melalui `request.user`
4. THE Auth_Service SHALL menyediakan endpoint GET `/auth/me` yang diproteksi, mengembalikan data pengguna yang sedang login berdasarkan token

---

### Requirement 6: Manajemen Data Pengguna

**User Story:** Sebagai sistem, saya ingin menyimpan dan mengambil data pengguna dari database, sehingga informasi pengguna dapat dikelola dengan konsisten.

#### Acceptance Criteria

1. THE User_Service SHALL menyimpan data pengguna dengan field: `id` (UUID), `email` (unique), `password` (hash), `createdAt`, `updatedAt`
2. WHEN mencari pengguna berdasarkan email, THE User_Service SHALL mengembalikan data pengguna lengkap termasuk field password (untuk keperluan verifikasi internal)
3. WHEN mengembalikan data pengguna ke client, THE Auth_Service SHALL menghapus field `password` dari response
4. THE Prisma_Client SHALL mengelola koneksi database PostgreSQL dan menyediakan type-safe query untuk operasi CRUD pengguna
