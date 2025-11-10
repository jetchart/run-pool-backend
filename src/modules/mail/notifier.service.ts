import { Injectable } from '@nestjs/common';
import { WhatsappService } from '../whatsapp/services/whatsapp.service';
import { MailService } from './mail.service';
import { MailTemplate } from './mail-template.enum';

@Injectable()
export class NotifierService {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly mailService: MailService,
  ) {}

  async notifyTripCreated(driver: any, race: any, trip: any, tripUrl: string) {
    await this.whatsappService.notifyTripCreated(driver, race, trip, tripUrl);
    await this.mailService.notifyTripCreated(driver, race, trip, tripUrl);
  }

  async notifyTripConfirmed(userProfile: any, race: any, trip: any, tripUrl: string) {
    await this.whatsappService.notifyTripConfirmed(userProfile, race, trip, tripUrl);
    await this.mailService.notifyTripConfirmed(userProfile, race, trip, tripUrl);
  }

  async notifyTripJoin(driverProfile: any, race: any, passengerProfile: any, tripUrl: string) {
    await this.whatsappService.notifyTripJoin(driverProfile, race, passengerProfile, tripUrl);
    await this.mailService.notifyTripJoin(driverProfile, race, passengerProfile, tripUrl);
  }

  async notifyTripRejected(passengerProfile: any, race: any, trip: any, raceUrl: string) {
    await this.whatsappService.notifyTripRejected(passengerProfile, race, trip, raceUrl);
    await this.mailService.notifyTripRejected(passengerProfile, race, trip, raceUrl);
  }

  async notifyTripLeaved(driverProfile: any, race: any, passengerProfile: any, tripUrl: string) {
    await this.whatsappService.notifyTripLeaved(driverProfile, race, passengerProfile, tripUrl);
    await this.mailService.notifyTripLeaved(driverProfile, race, passengerProfile, tripUrl);
  }
}
