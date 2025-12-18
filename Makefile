# Подключаем переменные из .env
include .env
-include .env.local
export

# Цвета для вывода
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

.PHONY: help
help: ## Показать список доступных команд
	@echo "Доступные команды:"
	@grep -hE '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = " ## "}; {split($$1, a, ":"); printf "  ${YELLOW}%-30s${RESET} %s\n", a[1], $$2}'


init:
	pnpm install --filter @forge-node/backend
	pnpm install --filter @forge-node/frontend


# Установка зависимостей
install:
	@echo "Установка зависимостей backend..."
	cd backend && pnpm install
	@echo "Установка зависимостей frontend..."
	cd frontend && pnpm install
	@echo "Готово!"

# Очистка
clean:
	docker-compose down -v
	rm -rf backend/node_modules backend/dist
	rm -rf frontend/node_modules frontend/.next
	@echo "Очищено!"

# Запуск сервисов
up:
	docker compose up -d --build
	@echo "Сервисы запущены!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:3001"
	@echo "Health:   http://localhost:3001/health"

recreate:
	docker compose up -d --build --force-recreate --remove-orphans
# Остановка сервисов
down:
	docker compose down

# Перезапуск сервисов
restart: down up

# Просмотр логов
logs:
	docker compose logs -f

# Логи только backend
logs-backend:
	docker compose logs -f node-backend

# Статический анализ backend (ESLint + TypeScript)
backend-analyze: ## Статический анализ backend (ESLint + tsc --noEmit)
	cd backend && pnpm lint && pnpm run type-check

# Сборка образов
build:
	docker compose build

# Shell в backend
shell-backend:
	docker compose exec node-backend sh

# Shell в frontend
shell-frontend:
	docker compose exec node-frontend sh

# Shell в БД
shell-db:
	docker compose exec node-db psql -U forge_node -d forge_node
