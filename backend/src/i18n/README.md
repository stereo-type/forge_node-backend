# Интернационализация (i18n)

Проект использует `nestjs-i18n` для локализации приложения (аналог Symfony Translation).

## 📁 Структура

```
i18n/
├── ru/                     # Русский язык (по умолчанию)
│   ├── validation.json     # Переводы ошибок валидации
│   ├── errors.json         # Системные ошибки
│   └── fields.json         # Названия полей
└── en/                     # Английский язык
    ├── validation.json
    ├── errors.json
    └── fields.json
```

## 🌐 Поддерживаемые языки

- `ru` - Русский (по умолчанию)
- `en` - Английский

## 📝 Файлы переводов

### validation.json

Содержит переводы для ошибок валидации `class-validator`:

```json
{
  "isEmail": "$property должен быть валидным email адресом",
  "minLength": "$property должно быть не менее $constraint1 символов"
}
```

**Переменные:**
- `$property` - название поля (автоматически)
- `$constraint1`, `$constraint2` и т.д. - значения из валидатора

### errors.json

Системные ошибки приложения:

```json
{
  "USER_ALREADY_EXISTS": "Пользователь с таким email уже существует",
  "INVALID_CREDENTIALS": "Неверные учетные данные"
}
```

### fields.json

Названия полей для более читабельных сообщений:

```json
{
  "email": "Email",
  "password": "Пароль",
  "firstName": "Имя"
}
```

## 🔧 Использование в коде

### В сервисе

```typescript
import { Injectable } from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class UsersService {
  constructor(private readonly i18n: I18nService) {}

  async create(dto: CreateUserDto) {
    const lang = I18nContext.current()?.lang || 'ru';
    
    // Проверка существования пользователя
    if (await this.userExists(dto.email)) {
      const message = await this.i18n.translate('errors.USER_ALREADY_EXISTS', { lang });
      throw new ConflictException(message);
    }
  }
}
```

### В контроллере

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('users')
export class UsersController {
  @Post()
  async create(
    @Body() dto: CreateUserDto,
    @I18n() i18n: I18nContext
  ) {
    const message = i18n.t('errors.VALIDATION_ERROR');
    // ...
  }
}
```

### С переменными

```typescript
// В файле переводов:
// "ITEMS_FOUND": "Найдено {count} элементов"

const message = await this.i18n.translate('messages.ITEMS_FOUND', {
  lang: 'ru',
  args: { count: 42 }
});
// Результат: "Найдено 42 элементов"
```

## 🌍 Как клиент указывает язык

Клиент может указать желаемый язык тремя способами (в порядке приоритета):

### 1. Query параметр

```bash
GET /api/users?lang=ru
```

### 2. HTTP заголовок Accept-Language

```bash
curl -H "Accept-Language: ru" http://localhost:3001/api/users
```

### 3. Кастомный заголовок x-lang

```bash
curl -H "x-lang: ru" http://localhost:3001/api/users
```

## ➕ Добавление нового языка

1. Создайте папку с кодом языка в `src/i18n/`:

```bash
mkdir src/i18n/de
```

2. Создайте файлы переводов:

```bash
touch src/i18n/de/validation.json
touch src/i18n/de/errors.json
touch src/i18n/de/fields.json
```

3. Заполните файлы переводами (используйте `en` или `ru` как шаблон)

4. Перезапустите приложение

## ➕ Добавление нового перевода

1. Откройте нужный файл (например, `ru/errors.json`)
2. Добавьте новый ключ:

```json
{
  "NEW_ERROR_KEY": "Текст ошибки на русском"
}
```

3. Добавьте тот же ключ в другие языки (`en/errors.json` и т.д.)
4. Используйте в коде:

```typescript
const message = await this.i18n.translate('errors.NEW_ERROR_KEY', { lang });
```

## 🔍 Формат ошибок валидации

При ошибках валидации клиент получает ответ с группировкой по полям:

```json
{
  "statusCode": 400,
  "error": "Ошибка валидации данных",
  "message": "Ошибка валидации данных",
  "errors": {
    "email": ["Email должен быть валидным email адресом"],
    "password": ["Пароль должно быть не менее 6 символов"]
  },
  "timestamp": "2024-12-18T10:30:45.123Z"
}
```

Это удобно для фронтенда - можно напрямую привязать ошибки к полям формы:

```typescript
// React пример
if (error.errors.email) {
  setEmailError(error.errors.email[0]);
}
```

## 📚 Документация

- [nestjs-i18n GitHub](https://github.com/toonvanstrijp/nestjs-i18n)
- [nestjs-i18n Documentation](https://nestjs-i18n.com/)

