import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { AppLogger } from '../app-logger/services/app-logger';
import * as nodemailer from 'nodemailer';

describe('MailService', () => {
  let service: MailService;
  let appLogger: AppLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: AppLogger,
          useValue: { logError: jest.fn(), logInfo: jest.fn() },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
    appLogger = module.get<AppLogger>(AppLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log error on sendMail failure', async () => {
    service['resend'] = {
      emails: {
        send: jest.fn().mockImplementation(() => Promise.resolve({
          data: null,
          error: { message: 'API key is invalid', name: 'validation_error', statusCode: 401 },
        }))
      }
    } as any;
    const result = await service.sendMail('to', 'subject', 'text');
    expect(result).toEqual({
      data: null,
      error: expect.objectContaining({ message: 'API key is invalid' })
    });
    expect(appLogger.logError).toHaveBeenCalled();
  });
});
