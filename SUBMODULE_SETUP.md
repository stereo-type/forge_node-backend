# Настройка Frontend как Git Submodule

Это руководство по настройке директории `frontend` как отдельного Git submodule.

## Шаг 1: Создание отдельного репозитория для Frontend

```bash
# Перейдите в директорию frontend
cd frontend

# Инициализируйте git репозиторий
git init

# Добавьте все файлы
git add .

# Создайте первый коммит
git commit -m "Initial commit: Next.js frontend setup"

# Создайте ветку main (если её нет)
git branch -M main

# Добавьте remote origin (замените URL на ваш)
git remote add origin <URL-вашего-frontend-репозитория>

# Отправьте код в удалённый репозиторий
git push -u origin main
```

## Шаг 2: Удаление frontend из основного репозитория

```bash
# Вернитесь в корень проекта
cd ..

# Удалите директорию frontend из git (но не с диска!)
git rm -r --cached frontend

# Удалите саму директорию
rm -rf frontend

# Закоммитьте изменения
git add .
git commit -m "Remove frontend directory to prepare for submodule"
```

## Шаг 3: Добавление frontend как submodule

```bash
# Добавьте frontend как submodule
git submodule add <URL-вашего-frontend-репозитория> frontend

# Закоммитьте изменения
git add .
git commit -m "Add frontend as git submodule"

# Отправьте изменения
git push
```

## Шаг 4: Клонирование проекта с submodules

Когда кто-то клонирует основной репозиторий:

```bash
# Вариант 1: Клонировать с submodules сразу
git clone --recurse-submodules <URL-основного-репозитория>

# Вариант 2: Клонировать, затем инициализировать submodules
git clone <URL-основного-репозитория>
cd forge-node
git submodule init
git submodule update
```

## Работа с Submodules

### Обновление submodule до последней версии

```bash
# Перейти в директорию submodule
cd frontend

# Получить последние изменения
git pull origin main

# Вернуться в корень проекта
cd ..

# Закоммитить обновление submodule
git add frontend
git commit -m "Update frontend submodule"
git push
```

### Внесение изменений в submodule

```bash
# Перейти в директорию submodule
cd frontend

# Создать новую ветку
git checkout -b feature/new-feature

# Внести изменения
# ... редактирование файлов ...

# Закоммитить изменения
git add .
git commit -m "Add new feature"

# Отправить изменения
git push origin feature/new-feature

# Вернуться в основную ветку
git checkout main

# Вернуться в корень проекта
cd ..

# Обновить ссылку на submodule в основном проекте
git add frontend
git commit -m "Update frontend submodule reference"
git push
```

### Удаление submodule (если нужно)

```bash
# Удалить submodule из конфигурации
git submodule deinit -f frontend

# Удалить директорию submodule
rm -rf .git/modules/frontend

# Удалить директорию из рабочей копии
git rm -f frontend

# Закоммитить изменения
git commit -m "Remove frontend submodule"
```

## Важные замечания

1. **Submodule всегда указывает на конкретный коммит** - когда вы обновляете submodule, нужно закоммитить новую ссылку в основном репозитории

2. **Docker Compose работает с локальной копией** - изменения в submodule видны сразу в Docker, не нужна пересборка

3. **CI/CD настройки** - при настройке CI/CD не забудьте клонировать с `--recurse-submodules`

4. **Разработка** - можно работать в директории `frontend` как с обычным git репозиторием

## Альтернатива: Локальный путь для разработки

Если вы не хотите создавать отдельный удалённый репозиторий для frontend сразу, можно использовать локальный путь:

```bash
# Создайте bare репозиторий локально
git init --bare ../forge-node-frontend.git

# Добавьте как submodule с локальным путём
git submodule add ../forge-node-frontend.git frontend
```

Позже можно изменить URL на удалённый:

```bash
# Отредактируйте .gitmodules
# Измените URL на удалённый

# Синхронизируйте конфигурацию
git submodule sync

# Обновите submodule
cd frontend
git remote set-url origin <новый-URL>
cd ..
```

## Готово!

Теперь frontend настроен как независимый git submodule и может разрабатываться отдельно от основного проекта.
