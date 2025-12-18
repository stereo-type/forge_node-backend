import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm';
import {I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver} from 'nestjs-i18n';
import * as path from 'path';
import {HealthModule} from '@modules/health/health.module';
import {AuthModule} from '@modules/auth/auth.module';
import {UsersModule} from '@modules/users/users.module';
import {WorkflowsModule} from '@modules/workflows/workflows.module';
import {ExecutionsModule} from '@modules/executions/executions.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      /**
       * Порядок важен:
       * - .env.local перекрывает .env
       * - сначала ищем файлы в рабочей директории процесса (Docker: /app)
       * - затем в корне репозитория относительно backend (локальный запуск)
       *
       * Итог: как в Symfony — .env в гите, .env.local локально и перекрывает.
       */
      envFilePath: ['.env.local', '.env', '../.env.local', '../.env'],
    }),

    // Translations (Internationalization)
    I18nModule.forRoot({
      fallbackLanguage: 'en', // Fallback язык если перевод не найден
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        {use: QueryResolver, options: ['lang']}, // ?lang=ru
        AcceptLanguageResolver, // Accept-Language: ru
        new HeaderResolver(['x-lang']), // x-lang: ru
      ],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useFactory: (...args: any[]): TypeOrmModuleOptions => {
        const [configService] = args as [ConfigService];
        return {
          type: 'postgres',
          url: configService.getOrThrow<string>('DATABASE_URL'),
          autoLoadEntities: true,
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
    } as unknown as Parameters<typeof TypeOrmModule.forRootAsync>[0]),

    // Modules
    HealthModule,
    AuthModule,
    UsersModule,
    WorkflowsModule,
    ExecutionsModule,
  ],
})
export class AppModule {
}
