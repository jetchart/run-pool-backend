import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { NotifierService } from './notifier.service';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { AppLoggerModule } from '../app-logger/app-logger.module';

@Module({
  imports: [WhatsappModule, AppLoggerModule],
  providers: [MailService, NotifierService],
  exports: [MailService, NotifierService],
})
export class MailModule {}
