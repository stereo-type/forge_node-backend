.PHONY: help install up down restart logs build clean

# Цель по умолчанию
help:
	@echo "Forge Node - Команды для разработки"
	@echo ""
	@echo "Использование: make [цель]"
	@echo ""
	@echo "Цели:"
	@echo "  install    Установить зависимости для backend и frontend"
	@echo "  up         Запустить все Docker сервисы"
	@echo "  down       Остановить все Docker сервисы"
	@echo "  restart    Перезапустить все Docker сервисы"
	@echo "  logs       Просмотр логов всех сервисов"
	@echo "  build      Собрать Docker образы"
	@echo "  clean      Удалить контейнеры, volumes и зависимости"
	@echo "  backend    Открыть shell в backend контейнере"
	@echo "  frontend   Открыть shell в frontend контейнере"
	@echo "  db         Открыть psql в базе данных"

# Установка зависимостей
install:
	@echo "Установка зависимостей backend..."
	cd backend && pnpm install
	@echo "Установка зависимостей frontend..."
	cd frontend && pnpm install
	@echo "Готово!"

# Запуск сервисов
up:
	docker compose up -d --build
	@echo "Сервисы запущены!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:3001"
	@echo "Health:   http://localhost:3001/health"

# Остановка сервисов
down:
	docker compose down

# Перезапуск сервисов
restart: down up

# Просмотр логов
logs:
	docker compose logs -f

# Сборка образов
build:
	docker compose build

# Очистка
clean:
	docker-compose down -v
	rm -rf backend/node_modules backend/dist
	rm -rf frontend/node_modules frontend/.next
	@echo "Очищено!"

# Shell в backend
backend:
	docker compose exec node-backend sh

# Shell в frontend
frontend:
	docker compose exec node-frontend sh

# Shell в БД
db:
	docker compose exec node-db psql -U forge_node -d forge_node
