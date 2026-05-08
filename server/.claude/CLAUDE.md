# Server — NestJS Backend

## Stack

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| NestJS | 11 | Framework |
| TypeScript | 5 | Type safety |
| TypeORM | 0.3 | ORM |
| PostgreSQL | — | Database |
| ioredis | 5 | Redis client |
| @nestjs/jwt | 11 | JWT signing/verification |
| passport-jwt | 4 | JWT strategy |
| bcrypt | 6 | Password hashing |
| class-validator | 0.15 | DTO validation |
| class-transformer | 0.5 | Response serialization |

## Cấu trúc thư mục

```
src/
  main.ts                         — Bootstrap, global prefix, CORS, pipes, interceptors
  app.module.ts                   — Root module
  config/
    typeorm.config.ts             — TypeORM config (PostgreSQL)
  common/
    filters/
      http-exception.filter.ts    — Global HTTP exception handler
    interceptors/
      response.interceptor.ts     — Wrap response thành envelope format
    pagination/                   — PaginationDto, interface, util
    redis/
      redis.module.ts             — Redis provider (inject token: 'REDIS')
  modules/
    auth/                         — AuthModule, AuthController, AuthService
      dto/                        — LoginDto, RegisterDto
      guards/jwt-auth.guard.ts    — JwtAuthGuard
      strategies/jwt.strategy.ts  — JwtStrategy (validate từ Redis blacklist)
    user/                         — UserModule, UserController, UserService
      dto/                        — CreateUserDto, UpdateUserDto
      user.entity.ts              — User entity (id, email, password, name, role, isActive)
```

## Global configuration (main.ts)

- **API prefix**: `/api` → tất cả routes đều bắt đầu bằng `/api/`
- **CORS**: chỉ cho phép `http://localhost:3000` (cập nhật khi deploy)
- **ValidationPipe**: `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- **ResponseInterceptor**: tự động wrap mọi response thành envelope
- **HttpExceptionFilter**: chuẩn hóa error response

## Response envelope

Mọi response thành công đều có dạng:
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Request successful",
  "timestamp": "2024-...",
  "path": "/api/...",
  "data": { ... }
}
```

## Auth endpoints

| Method | Path | Guard | Mô tả |
|---|---|---|---|
| POST | `/api/auth/login` | — | Trả access + refresh token |
| POST | `/api/auth/register` | — | Tạo tài khoản mới |
| GET | `/api/auth/me` | JwtAuthGuard | Lấy thông tin user hiện tại |
| POST | `/api/auth/refresh` | — | Cấp token mới từ refresh token |
| POST | `/api/auth/logout` | JwtAuthGuard | Logout 1 thiết bị |

## JWT & Redis pattern

- **Access token**: 15 phút, secret = `JWT_ACCESS_SECRET`
- **Refresh token**: 7 ngày, secret = `JWT_REFRESH_SECRET`
- **JWT payload**: `{ sub, email, role, jti }` — `jti` là UUID duy nhất mỗi session
- **Redis keys**:
  - `refresh:{userId}:{jti}` — lưu hashed refresh token (TTL 7d)
  - `blacklist:{jti}` — token đã logout (TTL 15m, bằng access token TTL)
- **Refresh flow**: verify → kiểm tra Redis → bcrypt.compare → xóa key cũ → cấp token mới

## User entity

```ts
User { id (uuid), email (unique), password (excluded), name, role (user|admin), isActive, createdAt, updatedAt }
```

## Inject Redis

```ts
@Inject('REDIS') private readonly redis: Redis
```

## Thêm module mới

```bash
nest g module modules/<name>
nest g service modules/<name>
nest g controller modules/<name>
```

Sau đó:
1. Tạo entity trong `modules/<name>/<name>.entity.ts`, thêm vào `TypeOrmModule.forFeature([...])`
2. Tạo DTOs với class-validator decorators
3. Import module vào `app.module.ts`

## Lệnh thường dùng

```bash
npm run start:dev       # watch mode (port từ PORT env, default 3000)
npm run build           # compile TypeScript
npm run lint            # ESLint + auto-fix
npm run test            # Jest unit tests
npm run test:e2e        # E2E tests
npm run format          # Prettier
```

## Lưu ý quan trọng

- `synchronize: true` chỉ dùng trong dev — **không dùng production**
- Luôn dùng `ensureEnv()` khi đọc biến môi trường nhạy cảm (JWT secrets)
- Password hash bằng bcrypt với saltRounds=10 trước khi lưu DB
- Dùng `@Exclude()` trên field `password` của entity để không bao giờ trả về client
