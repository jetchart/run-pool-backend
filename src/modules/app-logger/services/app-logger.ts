import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppLogger {
  constructor(private readonly pinoLogger: PinoLogger) {}

  logInfo(
    location: string,
    message: string,
    context?: Record<string, unknown>,
  ): void {
    this.pinoLogger.info(
      { location, ...(context ?? {}) },
      `[${location}] ${message}`,
    );
  }

  logError(
    location: string,
    message: string,
    context?: Record<string, unknown>,
    error?: unknown,
  ): void {
    this.pinoLogger.error(
      { location, error, ...(context ?? {}) },
      `[${location}] ${message}`,
    );
  }

  logWarn(
    location: string,
    message: string,
    context?: Record<string, unknown>,
  ): void {
    this.pinoLogger.warn(
      { location, ...(context ?? {}) },
      `[${location}] ${message}`,
    );
  }
}
