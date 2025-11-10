import { Test, TestingModule } from '@nestjs/testing';
import { NotifierService } from './notifier.service';
import { WhatsappService } from '../whatsapp/services/whatsapp.service';
import { MailService } from './mail.service';

describe('NotifierService', () => {
  let service: NotifierService;
  let whatsappService: WhatsappService;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotifierService,
        {
          provide: WhatsappService,
          useValue: {
            notifyTripCreated: jest.fn(),
            notifyTripConfirmed: jest.fn(),
            notifyTripJoin: jest.fn(),
            notifyTripRejected: jest.fn(),
            notifyTripLeaved: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            notifyTripCreated: jest.fn(),
            notifyTripConfirmed: jest.fn(),
            notifyTripJoin: jest.fn(),
            notifyTripRejected: jest.fn(),
            notifyTripLeaved: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<NotifierService>(NotifierService);
    whatsappService = module.get<WhatsappService>(WhatsappService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call both services on notifyTripCreated', async () => {
    await service.notifyTripCreated({}, {}, {}, 'url');
    expect(whatsappService.notifyTripCreated).toHaveBeenCalled();
    expect(mailService.notifyTripCreated).toHaveBeenCalled();
  });
});
