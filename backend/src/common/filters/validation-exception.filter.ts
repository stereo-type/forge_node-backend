import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

/**
 * Кастомный фильтр для валидационных ошибок с поддержкой переводов
 * Возвращает ошибки в удобном формате с группировкой по полям
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;
    const i18n = I18nContext.current(host);

    // Проверяем, является ли это валидационной ошибкой
    if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const messages = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message
        : [exceptionResponse.message];

      // Преобразуем массив ошибок в объект с ключами полей
      const errors = this.formatValidationErrors(messages ,i18n);

      // Если есть errors, значит это валидационная ошибка
      if (Object.keys(errors).length > 0) {
        // Получаем перевод с автоматическим fallback
        const errorMessage = this.getTranslation(
          i18n,
          'errors.VALIDATION_ERROR',
          'Validation Error',
        );

        response.status(status).json({
          statusCode: status,
          error: errorMessage,
          message: errorMessage,
          errors: errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    // Если это не валидационная ошибка, возвращаем стандартный формат
    response.status(status).json({
      statusCode: status,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.message || 'Bad Request',
      error: exceptionResponse.error || 'Bad Request',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Получить перевод с fallback
   * Приоритет: текущий язык -> английский -> defaultValue
   */
  private getTranslation(
    i18n: I18nContext | undefined,
    key: string,
    defaultValue: string,
  ): string {
    if (!i18n) {
      return defaultValue;
    }

    try {
      const translation = String(i18n.t(key));
      // Если перевод не найден, i18n возвращает сам ключ
      return translation !== key ? translation : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Преобразует массив ошибок валидации в объект с ключами полей
   * Пример: { email: ['Email должен быть валидным'], password: ['Пароль должен быть не менее 8 символов'] }
   */
  private formatValidationErrors(messages: any[],   i18n: I18nContext | undefined): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    messages.forEach((message) => {
      if (typeof message === 'string') {
        // Извлекаем поле из начала строки
        const fieldMatch = message.match(/^(\w+)\s/);
        if (fieldMatch) {
          const field = fieldMatch[1];

          if (!formattedErrors[field]) {
            formattedErrors[field] = [];
          }
          formattedErrors[field].push(this.translateError(message, i18n));
        }
      } else if (typeof message === 'object' && message !== null) {
        // Обрабатываем объекты ValidationError
        if (message.property) {
          const field = message.property;
          if (!formattedErrors[field]) {
            formattedErrors[field] = [];
          }

          // Берем либо message, либо constraints
          if (typeof message.message === 'string') {
            formattedErrors[field].push(this.translateError(message.message, i18n));
          } else if (message.constraints) {
            Object.values(message.constraints).forEach((constraint) => {
              if (typeof constraint === 'string') {
                formattedErrors[field].push(this.translateError(constraint, i18n));
              }
            });
          } else if (
            Array.isArray(message.children) &&
            message.children.length > 0
          ) {
            // Рекурсивно обрабатываем вложенные ошибки
            const nestedErrors = this.formatValidationErrors(message.children, i18n);
            Object.entries(nestedErrors).forEach(([nestedField, errors]) => {
              const fullField = `${field}.${nestedField}`;
              formattedErrors[fullField] = errors;
            });
          }
        }
      }
    });

    return formattedErrors;
  }

  /**
   * Переводит английские сообщения об ошибках используя файлы переводов
   * Единый формат: Поле "{Название}" {описание ошибки}
   */
  private translateError(message: string,  i18n: I18nContext | undefined): string {
    if (!i18n) return message;

    // Извлекаем название поля из сообщения
    const fieldMatch = message.match(/^(\w+)\s+/);
    const fieldName = fieldMatch ? fieldMatch[1] : '';

    // Переводим название поля из fields.json
    const translatedField = String(i18n.t(`fields.${fieldName}`, { defaultValue: fieldName }));

    // Определяем какой ключ валидации использовался
    let validationKey = '';
    let args: any = {};

    if (/must be an? email/i.test(message)) {
      validationKey = 'validation.isEmail';
    } else if (/should not be empty/i.test(message)) {
      validationKey = 'validation.isNotEmpty';
    } else if (/must be a string/i.test(message)) {
      validationKey = 'validation.isString';
    } else if (/must be a number/i.test(message)) {
      validationKey = 'validation.isNumber';
    } else if (/must be a boolean/i.test(message)) {
      validationKey = 'validation.isBoolean';
    } else if (/must be an array/i.test(message)) {
      validationKey = 'validation.isArray';
    } else if (/must be a date/i.test(message)) {
      validationKey = 'validation.isDate';
    } else if (/must be a UUID/i.test(message)) {
      validationKey = 'validation.isUUID';
    } else if (/must be a valid enum value/i.test(message)) {
      validationKey = 'validation.isEnum';
    } else if (/must be an integer/i.test(message)) {
      validationKey = 'validation.isInt';
    } else if (/must be a positive number/i.test(message)) {
      validationKey = 'validation.isPositive';
    } else if (/must be a negative number/i.test(message)) {
      validationKey = 'validation.isNegative';
    } else {
      // Проверяем minLength/maxLength/min/max с параметрами
      const minLengthMatch = message.match(/must be longer than or equal to (\d+)/i);
      if (minLengthMatch) {
        validationKey = 'validation.minLength';
        args = { constraint1: minLengthMatch[1] };
      }

      const maxLengthMatch = message.match(/must be shorter than or equal to (\d+)/i);
      if (maxLengthMatch) {
        validationKey = 'validation.maxLength';
        args = { constraint1: maxLengthMatch[1] };
      }

      const minMatch = message.match(/must not be less than (\d+)/i);
      if (minMatch) {
        validationKey = 'validation.min';
        args = { constraint1: minMatch[1] };
      }

      const maxMatch = message.match(/must not be greater than (\d+)/i);
      if (maxMatch) {
        validationKey = 'validation.max';
        args = { constraint1: maxMatch[1] };
      }
    }

    // Получаем перевод из файла с подстановкой $property
    if (validationKey) {
      return String(i18n.t(validationKey, {
        defaultValue: message,
        args: { property: translatedField, ...args }
      }));
    }

    // Если не нашли перевод, возвращаем оригинал
    return message;
  }

}

