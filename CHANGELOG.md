# Changelog

Все значимые изменения в проекте Forge Node будут документированы в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
и этот проект придерживается [Semantic Versioning](https://semver.org/lang/ru/).

## [Unreleased]

### Добавлено

- Начальная структура проекта
- Docker Compose конфигурация с PostgreSQL, Redis, Backend и Frontend
- NestJS Backend с базовым модулем Health
- Next.js Frontend с базовой структурой
- Настройка TypeScript для backend и frontend
- Конфигурация ESLint и Prettier
- Makefile для удобной разработки
- Документация по настройке и запуску
- Конфигурация для Git submodules (Frontend)

### TODO

- [ ] Модуль аутентификации (Auth Module)
- [ ] Модуль workflow (Workflow Engine)
- [ ] Модуль нод workflow (Nodes Module)
- [ ] Модуль выполнения workflow (Executions Module)
- [ ] Интеграция с Forge Flow API
- [ ] WebSocket поддержка для real-time обновлений
- [ ] Визуальный редактор workflow (React Flow)
- [ ] Система плагинов для нод
- [ ] LLM интеграции
- [ ] Документация API (Swagger)
- [ ] Unit и E2E тесты
- [ ] CI/CD настройка

## [1.0.0] - TBD

Первый релиз

[Unreleased]: https://github.com/yourusername/forge-node/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/forge-node/releases/tag/v1.0.0
