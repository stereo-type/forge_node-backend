ARG NODE_VERSION=20
ARG PORT=3000

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
# Копирование файлов пакетов frontend
COPY frontend/package*.json ./frontend/

# Установка зависимостей
RUN pnpm install --filter @forge-node/frontend

# Открытие порта
EXPOSE ${PORT}

# Создание директории .next с правами для всех пользователей
# (права будут переопределены в compose.yaml через user)
RUN mkdir -p /app/frontend/.next && \
    chmod -R 777 /app/frontend/.next

# Рабочая директория для frontend
WORKDIR /app/frontend

# Запуск в режиме разработки
CMD ["pnpm", "run", "dev"]
