# Client — Next.js Frontend

## Stack

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| Next.js | 16 (App Router) | Framework |
| React | 19 | UI |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| shadcn/ui (Radix UI) | latest | Component library |
| TanStack Query | 5 | Server state |
| React Hook Form | 7 | Form state |
| Zod | 4 | Schema validation |
| Axios | 1 | HTTP client |
| Sonner | 2 | Toast notifications |

## Cấu trúc thư mục

```
app/                    — Next.js App Router pages
  (dashboard)/          — Route group, dùng layout riêng có sidebar/header
  login/                — Public page
  register/             — Public page
  providers/            — QueryProvider, ThemeProvider
  layout.tsx            — Root layout (font Outfit, ThemeProvider)
components/
  form/                 — BaseForm, InputField, SelectField, CheckboxField, TextareaField
  layout/               — AppHeader, AppFooter, AppSidebar
  ui/                   — shadcn generated components
features/
  auth/                 — auth.api.ts, auth.hooks.ts, auth.schema.ts, auth.types.ts
lib/
  axios.ts              — Axios instance + request/response interceptor
  token.ts              — getAccessToken, getRefreshToken, setTokens, clearTokens (localStorage)
  utils.ts              — cn() utility
```

## Quy ước viết code

- **Feature folder pattern**: mỗi domain có folder riêng trong `features/`, gồm `.api.ts`, `.hooks.ts`, `.schema.ts`, `.types.ts`
- **API types**: mọi response API đều được wrap bởi `ApiResponse<T>` (xem `auth.types.ts`)
- **Mutations**: dùng `useMutation` từ TanStack Query, xử lý `onSuccess`/`onError` với toast
- **Forms**: React Hook Form + Zod schema, wrap bằng `BaseForm` component
- **Import alias**: `@/` trỏ đến root của project (đã cấu hình trong `tsconfig.json`)

## Lấy API response data

API trả về envelope, nên luôn truy cập `res.data.data` để lấy payload thực:

```ts
const res = await api.post("/auth/login", data);
// res.data = ApiResponse<TokenData>
// res.data.data = TokenData { access_token, refresh_token }
```

## Token management

- `lib/token.ts` — đọc/ghi localStorage
- `lib/axios.ts` — interceptor tự động gắn `Authorization: Bearer <token>` và refresh khi 401
- Refresh endpoint: `POST /auth/refresh-token` với body `{ refreshToken }`

## Thêm feature mới

1. Tạo folder `features/<domain>/`
2. Định nghĩa types trong `<domain>.types.ts`
3. Viết Zod schema trong `<domain>.schema.ts`
4. Viết API calls trong `<domain>.api.ts`
5. Viết hooks (mutations/queries) trong `<domain>.hooks.ts`

## Lệnh thường dùng

```bash
npm run dev          # dev server (port 3000)
npm run build        # production build
npm run lint         # ESLint
npx shadcn add <component>  # thêm shadcn component
```
