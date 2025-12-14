ARG NODE_VERSION=20
ARG PORT=3001

FROM node:${NODE_VERSION}-alpine

# Установка зависимостей для сборки
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    wget

# Рабочая директория
WORKDIR /app

# Глобальная установка pnpm
RUN npm install -g pnpm

# Копирование файлов пакетов (корневые файлы для workspaces)
COPY package.json pnpm-workspace.yaml ./
# Копирование файлов пакетов backend
COPY backend/package*.json ./backend/

# Установка зависимостей
RUN pnpm install --filter @forge-node/backend

# Открытие порта
EXPOSE ${PORT}

# Рабочая директория для backend
WORKDIR /app/backend

# Запуск в режиме разработки
CMD ["pnpm", "run", "start:dev"]
