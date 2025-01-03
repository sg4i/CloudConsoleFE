# 构建阶段
FROM node:22-alpine as builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY pnpm-lock.yaml ./
COPY package.json ./

# 使用 pnpm 安装依赖
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY deployment/docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]