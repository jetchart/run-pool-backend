import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService } from './whatsapp.service';
import { TemplateService } from './template.service';
import { AppLogger } from '../../app-logger/services/app-logger';

describe('WhatsappService', () => {
  let service: WhatsappService;
  let templateService: TemplateService;
  let appLogger: AppLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappService,
        TemplateService,
        {
          provide: AppLogger,
          useValue: { logError: jest.fn(), logInfo: jest.fn() },
        },
      ],
    }).compile();
    service = module.get<WhatsappService>(WhatsappService);
    templateService = module.get<TemplateService>(TemplateService);
    appLogger = module.get<AppLogger>(AppLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Agrega tests de lógica de templates y logging
  it('should log error on sendMessage failure', async () => {
    service['client'] = { sendMessage: jest.fn().mockRejectedValue(new Error('fail')) } as any;
    const result = await service.sendMessage(['123'], 'msg');
    expect(result[0].success).toBe(false);
    expect(appLogger.logError).toHaveBeenCalled();
  });
});
