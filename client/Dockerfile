FROM node:20-alpine

WORKDIR /app

# Cài đặt libc6-compat để tương thích với một số thư viện native trên Alpine
RUN apk add --no-cache libc6-compat

# Tận dụng cache của Docker cho dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1
ENV HOSTNAME "0.0.0.0"

EXPOSE 3000

# Chạy lệnh development
CMD ["npm", "run", "dev"]