FROM node:24-alpine AS pnpm

# 安裝 pnpm
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate


FROM pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

CMD ["pnpm", "start"]
