import { Module } from '@nestjs/common';
import { WhatsappService } from './services/whatsapp.service';
import { TemplateService } from './services/template.service';
import { AppLoggerModule } from '../app-logger/app-logger.module';

@Module({
  imports: [AppLoggerModule],
  providers: [WhatsappService, TemplateService],
  exports: [WhatsappService, TemplateService],
})
export class WhatsappModule {}
