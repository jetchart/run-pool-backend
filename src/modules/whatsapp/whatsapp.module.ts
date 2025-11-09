import { Module } from '@nestjs/common';
import { WhatsappService } from './services/whatsapp.service';
import { TemplateService } from './services/template.service';

@Module({
  providers: [WhatsappService, TemplateService],
  exports: [WhatsappService, TemplateService],
})
export class WhatsappModule {}
