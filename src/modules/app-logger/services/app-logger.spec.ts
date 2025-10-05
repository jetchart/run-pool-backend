import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AppLogger } from './app-logger';
import { PinoLogger } from 'nestjs-pino';

describe('AppLoggerService', () => {
  let service: AppLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppLogger,
        {
          provide: PinoLogger,
          useValue: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AppLogger>(AppLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
