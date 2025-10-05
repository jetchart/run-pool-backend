import { Module } from '@nestjs/common';
import { AppLogger } from './services/app-logger';
import { getPinoParams } from './utils/pino-params';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [LoggerModule.forRoot(getPinoParams())],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class AppLoggerModule {}
