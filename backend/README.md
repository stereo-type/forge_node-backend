# Forge Node Backend

NestJS backend приложение для платформы автоматизации workflow Forge Node.

## Технологический стек

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Типобезопасность
- **TypeORM** - ORM для работы с PostgreSQL
- **BullMQ** - Очереди и выполнение workflow
- **PostgreSQL** - Основная БД
- **Redis** - Кэш и очереди
- **JWT** - Аутентификация
- **Socket.io** - Real-time коммуникация

## Архитектура

Проект следует принципам Clean Architecture и разделён на модули:

```
src/
├── main.ts              # Точка входа
├── app.module.ts        # Корневой модуль
├── config/              # Конфигурация
├── common/              # Общий код
│   ├── decorators/      # Декораторы
│   ├── guards/          # Guards для авторизации
│   ├── interceptors/    # Interceptors
│   └── filters/         # Exception filters
└── modules/             # Модули функционала
    ├── health/          # Health checks
    ├── auth/            # Аутентификация
    ├── workflow/        # Workflow engine
    ├── nodes/           # Workflow nodes
    ├── executions/      # Выполнение workflow
    └── ...
```

## Разработка

```bash
# Установка зависимостей
pnpm install

# Запуск dev сервера
pnpm start:dev

# Запуск в debug режиме
pnpm start:debug

# Сборка
pnpm build

# Запуск production
pnpm start:prod

# Тесты
pnpm test
pnpm test:watch
pnpm test:cov

# Линтинг
pnpm lint
```

## Миграции базы данных

```bash
# Создать новую миграцию
pnpm migration:create src/migrations/MigrationName

# Сгенерировать миграцию из изменений Entity
pnpm migration:generate src/migrations/MigrationName

# Применить миграции
pnpm migration:run

# Откатить последнюю миграцию
pnpm migration:revert
```

## Переменные окружения

```env
# Node
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/forge_node

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Forge Flow
FORGE_FLOW_API_URL=http://forge-flow
FORGE_FLOW_API_TOKEN=your-token
```

## API Endpoints

### Health Checks

- `GET /health` - Основной health check
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

### API

- `GET /api/*` - API endpoints под префиксом /api

## Модули

### Health Module

Модуль для health checks, используется для мониторинга состояния приложения.

### Auth Module (TODO)

Аутентификация через JWT токены, интеграция с Forge Flow для получения токена при регистрации.

### Workflow Module (TODO)

Ядро workflow engine, выполнение и управление workflow.

### Nodes Module (TODO)

Регистр доступных нод для workflow (HTTP, Database, Logic, LLM и т.д.).

## Разработка новых модулей

```bash
# Генерация модуля через NestJS CLI
nest g module modules/my-module
nest g controller modules/my-module
nest g service modules/my-module

# Генерация Entity
nest g class modules/my-module/entities/my-entity --no-spec
```

## Тестирование

```bash
# Unit тесты
pnpm test

# E2E тесты
pnpm test:e2e

# Coverage
pnpm test:cov
```

## Лицензия

UNLICENSED - Частный проект

## Автор

Жалялетдинов Вячеслав <evil_tut@mail.ru>
