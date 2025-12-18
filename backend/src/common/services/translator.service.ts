import { Injectable } from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';

/**
 * Сервис переводов с автоматическим fallback
 * 
 * Приоритет поиска перевода:
 * 1. Текущий язык (из контекста или параметра)
 * 2. Fallback язык (по умолчанию 'en')
 * 3. Сам ключ перевода (если не найден нигде)
 */
@Injectable()
export class TranslatorService {
  constructor(private readonly i18n: I18nService) {}

  /**
   * Получить перевод с автоматическим fallback
   * 
   * @param key - ключ перевода (например, 'errors.USER_ALREADY_EXISTS')
   * @param options - опции перевода (lang, args)
   * @returns переведенная строка или сам ключ если перевод не найден
   */
  async translate(
    key: string,
    options?: {
      lang?: string;
      args?: Record<string, any>;
    },
  ): Promise<string> {
    const currentLang = options?.lang || I18nContext.current()?.lang || 'ru';
    const fallbackLang = 'en';

    try {
      // Пытаемся получить перевод на текущем языке
      const translation = String(await this.i18n.translate(key, {
        lang: currentLang,
        args: options?.args,
      }));

      // Если перевод найден и это не сам ключ
      if (translation && translation !== key) {
        return translation;
      }

      // Если не найден, пытаемся получить на fallback языке
      if (currentLang !== fallbackLang) {
        const fallbackTranslation = String(await this.i18n.translate(key, {
          lang: fallbackLang,
          args: options?.args,
        }));

        if (fallbackTranslation && fallbackTranslation !== key) {
          return fallbackTranslation;
        }
      }

      // Если ничего не найдено, возвращаем сам ключ
      return key;
    } catch (error) {
      // В случае ошибки возвращаем ключ
      return key;
    }
  }

  /**
   * Синхронная версия translate для использования в контексте
   * 
   * @param key - ключ перевода
   * @param options - опции
   * @returns переведенная строка
   */
  t(key: string, options?: { args?: Record<string, any> }): string {
    const context = I18nContext.current();
    if (!context) {
      return key;
    }

    try {
      const translation = String(context.t(key, options));
      return translation !== key ? translation : key;
    } catch {
      return key;
    }
  }

  /**
   * Получить текущий язык из контекста
   */
  getCurrentLang(): string {
    return I18nContext.current()?.lang || 'ru';
  }

  /**
   * Проверить существует ли перевод
   */
  async exists(key: string, lang?: string): Promise<boolean> {
    try {
      const translation = await this.translate(key, { lang });
      return translation !== key;
    } catch {
      return false;
    }
  }
}

