import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Record<string, unknown>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Unexpected error occurred';

    // Enhanced log context with more details
    const logContext = {
      url: request.url,
      method: request.method,
      statusCode: status,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      body: request.body,
      params: request.params,
      query: request.query,
      headers: {
        authorization: request.headers.authorization ? '[REDACTED]' : undefined,
        'content-type': request.headers['content-type'],
        'user-agent': request.headers['user-agent'],
      },
    };

    // Enhanced error details
    const errorDetails = {
      name: exception instanceof Error ? exception.constructor.name : 'Unknown',
      message: exception instanceof Error ? exception.message : String(exception),
      stack: exception instanceof Error ? exception.stack : undefined,
      cause: exception instanceof Error ? exception.cause : undefined,
    };

    if (status >= 500) {
      // Server errors (5xx) - log as error with full exception details
      this.logger.error(
        {
          ...logContext,
          error: errorDetails,
          exception: exception instanceof Error ? {
            name: exception.constructor.name,
            message: exception.message,
            stack: exception.stack,
          } : exception,
        },
        `❌ INTERNAL SERVER ERROR: ${request.method} ${request.url} - ${status} - ${errorDetails.message}`,
      );
    } else if (status >= 400) {
      // Client errors (4xx) - log as warning with context
      this.logger.warn(
        {
          ...logContext,
          error: errorDetails,
        },
        `⚠️  CLIENT ERROR: ${request.method} ${request.url} - ${status} - ${errorDetails.message}`,
      );
    } else {
      // Success/redirect responses that somehow ended up here
      this.logger.log(
        logContext,
        `ℹ️  ${request.method} ${request.url} - ${status} - ${errorDetails.message}`,
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
