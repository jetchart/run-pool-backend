import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { AppLoggingInterceptor } from './modules/app-logger/interceptors/app-logger.interceptor';
import { HttpErrorFilter } from './filters/http-error.filter';
import { Logger } from 'nestjs-pino';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalPipes(new (await import('@nestjs/common')).ValidationPipe({ whitelist: true, transform: true }));

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new AppLoggingInterceptor(logger));
  app.useGlobalFilters(new HttpErrorFilter(logger));

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('nestport') || 3000;

  app.enableCors({
    origin: true,
    credentials: true,
  });

  logger.log(`Application running on port ${port}`);
  await app.listen(port);
}
void bootstrap();
