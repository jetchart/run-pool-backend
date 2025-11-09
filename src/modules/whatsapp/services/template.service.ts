import { Injectable } from '@nestjs/common';
import { WhatsappTemplate } from '../templates/whatsapp-template.enum';

@Injectable()
export class TemplateService {
  renderTemplate(template: WhatsappTemplate, params: Record<string, string | number>): string {
    return template.replace(/{(\w+)}/g, (_, key) => params[key]?.toString() ?? '');
  }
}
