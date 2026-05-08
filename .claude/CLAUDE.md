# Ecommerce Project

Monorepo gồm hai thư mục:
- `client/` — Next.js 16 frontend (port 3000)
- `server/` — NestJS 11 backend (port 3001)

## Khởi động phát triển

```bash
# Server
cd server && npm run start:dev

# Client
cd client && npm run dev
```

## Kiến trúc tổng quan

```
client/  ←→  server/  ←→  PostgreSQL
                ↕
             Redis (refresh token store)
```

**API base URL**: `http://localhost:3001/api/`  
**Client origin** được phép CORS: `http://localhost:3000`

## Auth flow

1. Login → nhận `access_token` (15 phút) + `refresh_token` (7 ngày)
2. Client lưu cả hai token vào localStorage
3. Axios interceptor tự động đính `Bearer` vào mọi request
4. Khi nhận 401 → tự động gọi `POST /auth/refresh` để lấy token mới
5. Refresh token được lưu trong Redis theo key `refresh:{userId}:{jti}`
6. Logout → xóa key Redis + thêm `blacklist:{jti}` (TTL 15 phút)

## Response envelope (tất cả API đều wrap theo format này)

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "...",
  "timestamp": "...",
  "path": "...",
  "data": { ... }
}
```

## Biến môi trường cần thiết

**Server** (`.env`):
```
DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
REDIS_HOST, REDIS_PORT
PORT
```

**Client** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/
```
