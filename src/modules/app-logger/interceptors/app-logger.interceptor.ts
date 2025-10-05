import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { Request } from 'express';
import { throwError } from 'rxjs';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AppLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Record<string, unknown>> {
    const now = Date.now();

    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<Request>();
    const { method, url } = request;

    this.logger.log(`➡️  ${method} ${url} - Incoming request`);

    return next.handle().pipe(
      tap(() => {
        const response = httpCtx.getResponse();
        const statusCode = response.statusCode;
        const ms = Date.now() - now;
        this.logger.log(`⬅️  ${method} ${url} - ${statusCode} [${ms}ms]`);
      }),
      catchError((err) => {
        const ms = Date.now() - now;
        this.logger.error(`❌ ${method} ${url} - Error after ${ms}ms`, err);
        return throwError(() => err);
      }),
    );
  }
}
