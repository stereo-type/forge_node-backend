# Forge Node

Платформа для автоматизации workflow, построенная на TypeScript, NestJS и Next.js.

## Архитектура

Проект состоит из трёх основных компонентов:

- **Backend** (NestJS) - API сервер и движок workflow
- **Frontend** (Next.js) - Веб-интерфейс (Git submodule)
- **Database** (PostgreSQL) - Хранилище данных
- **Cache/Queue** (Redis) - Кэширование и очередь задач

## Требования

- Docker & Docker Compose
- Node.js 20+ (для локальной разработки)
- pnpm (менеджер пакетов)
- Git

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url> forge-node
cd forge-node
```

### 2. Инициализация submodules (Frontend)

```bash
git submodule init
git submodule update
```

Или клонировать сразу с submodules:

```bash
git clone --recurse-submodules <repository-url> forge-node
```

### 3. Настройка окружения

```bash
cp env.example .env
# Отредактируйте .env под ваши настройки
```

### 4. Запуск через Docker Compose

```bash
# Сборка и запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка сервисов
docker-compose down
```

Сервисы будут доступны по адресам:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Backend Health: http://localhost:3001/health

## Разработка

### Разработка Backend

```bash
cd backend

# Установка зависимостей
pnpm install

# Запуск dev сервера
pnpm start:dev

# Запуск тестов
pnpm test

# Генерация миграции
pnpm migration:generate src/migrations/MigrationName

# Применение миграций
pnpm migration:run
```

### Разработка Frontend

```bash
cd frontend

# Установка зависимостей
pnpm install

# Запуск dev сервера
pnpm dev

# Сборка для production
pnpm build
```

## Структура проекта

```
forge-node/
├── .docker/              # Конфигурация Docker
│   ├── backend/         # Dockerfile для backend
│   ├── frontend/        # Dockerfile для frontend
│   └── db/              # Dockerfile для PostgreSQL
├── backend/             # NestJS backend
│   ├── src/
│   │   ├── modules/     # Модули функционала
│   │   ├── common/      # Общий код
│   │   └── config/      # Конфигурация
│   └── package.json
├── frontend/            # Next.js frontend (Git submodule)
│   ├── src/
│   │   ├── app/        # Страницы Next.js
│   │   ├── components/ # React компоненты
│   │   └── lib/        # Утилиты
│   └── package.json
├── compose.yaml         # Конфигурация Docker Compose
├── env.example          # Шаблон переменных окружения
└── README.md
```

## Переменные окружения

Основные переменные окружения (полный список в `env.example`):

```env
# Приложение
APP_NAME=forge-node
NODE_ENV=development

# Порты (настраиваются для разработки)
POSTGRES_PORT=5433
REDIS_PORT=6380
BACKEND_PORT=3001
FRONTEND_PORT=3000

# База данных
POSTGRES_DB=forge_node
POSTGRES_USER=forge_node
POSTGRES_PASSWORD=secret

# Интеграция с Forge Flow
FORGE_FLOW_API_URL=http://forge-nginx
FORGE_FLOW_API_TOKEN=

# JWT
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
```

## Docker сервисы

- `node-db` - PostgreSQL база данных
- `node-redis` - Redis кэш и очередь
- `node-backend` - NestJS API сервер
- `node-frontend` - Next.js веб-приложение

## Полезные команды

```bash
# Запуск всех сервисов
docker-compose up -d

# Пересборка сервисов
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f [имя-сервиса]

# Выполнение команды в контейнере
docker-compose exec node-backend pnpm migration:run

# Остановка всех сервисов
docker-compose down

# Остановка и удаление volumes
docker-compose down -v
```

## Интеграция с Forge Flow

Эта нода подключается к Forge Flow (сервер управления) для:
1. Регистрации ноды и аутентификации
2. Синхронизации конфигурации
3. Мониторинга и телеметрии

Настройте подключение в `.env`:
```env
FORGE_FLOW_API_URL=http://forge-flow-server
FORGE_FLOW_API_TOKEN=your-token-here
```

## Лицензия

UNLICENSED - Частный проект

## Автор

Жалялетдинов Вячеслав <evil_tut@mail.ru>
