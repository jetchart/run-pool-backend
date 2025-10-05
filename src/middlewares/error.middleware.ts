import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      next();
    } catch (error) {
      this.logger.log('Handling exception', { error });
      res.status(500).json({
        statusCode: 500,
        message: 'Unhandled error occurred',
        path: req.url,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
