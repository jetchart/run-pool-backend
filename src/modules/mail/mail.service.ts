import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { AppLogger } from '../app-logger/services/app-logger';
import { Resend } from 'resend';
import { MailTemplate, MailTemplateConfig } from './mail-template.enum';
import { UserProfileEntity } from '../user/entities/user-profile.entity';
import { RaceEntity } from '../race/entities/race.entity';
import { TripEntity } from '../trip/entities/trip.entity';

@Injectable()
export class MailService {
  private resend: Resend;
  constructor(@Inject(AppLogger) private readonly appLogger: AppLogger) {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_123');
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      const from = process.env.RESEND_FROM_EMAIL || 'no-reply@runpool.com.ar';
      const response = await this.resend.emails.send({
        from,
        to,
        subject,
        html: html || text,
      });
      if (response?.error) {
        this.appLogger.logError('MailService.sendMail', 'Error enviando mail', { to, subject }, response.error);
      }
      return response;
    } catch (error) {
      this.appLogger.logError('MailService.sendMail', 'Error enviando mail', { to, subject }, error);
      return null;
    }
  }

  async sendTemplateMail(template: MailTemplate, to: string, params: any) {
    try {
      const config = MailTemplateConfig[template];
      if (!config) throw new Error('Template no encontrado');
      return await this.sendMail(
        to,
        config.subject,
        '',
        config.html(params)
      );
    } catch (error) {
      this.appLogger.logError('MailService.sendTemplateMail', 'Error enviando mail con template', { template, to, params }, error);
      return null;
    }
  }

  async notifyTripCreated(driver: UserProfileEntity, race: RaceEntity, trip: TripEntity, tripUrl: string) {
    try {
      if (!driver.email) return null;
      return await this.sendTemplateMail(MailTemplate.TRIP_CREATED, driver.email, {
        name: driver.name,
        raceName: race.name,
        tripDate: trip.departureDay?.toDateString?.() || trip.departureDay,
        tripUrl,
      });
    } catch (error) {
      this.appLogger.logError('MailService.notifyTripCreated', 'Error enviando mail de viaje creado', { driver, race, trip, tripUrl }, error);
      return null;
    }
  }

  async notifyTripConfirmed(userProfile: UserProfileEntity, race: RaceEntity, trip: TripEntity, tripUrl: string) {
    try {
      if (!userProfile.email) return null;
      return await this.sendTemplateMail(MailTemplate.TRIP_CONFIRMED, userProfile.email, {
        name: userProfile.name,
        raceName: race.name,
        tripDate: trip.departureDay?.toDateString?.() || trip.departureDay,
        tripUrl,
      });
    } catch (error) {
      this.appLogger.logError('MailService.notifyTripConfirmed', 'Error enviando mail de viaje confirmado', { userProfile, race, trip, tripUrl }, error);
      return null;
    }
  }

  async notifyTripJoin(driverProfile: UserProfileEntity, race: RaceEntity, passengerProfile: UserProfileEntity, tripUrl: string) {
    try {
      if (!driverProfile.email) return null;
      return await this.sendTemplateMail(MailTemplate.TRIP_JOIN, driverProfile.email, {
        name: driverProfile.name,
        raceName: race.name,
        passengerName: passengerProfile.name,
        tripUrl,
      });
    } catch (error) {
      this.appLogger.logError('MailService.notifyTripJoin', 'Error enviando mail de pasajero unido', { driverProfile, race, passengerProfile, tripUrl }, error);
      return null;
    }
  }

  async notifyTripRejected(passengerProfile: UserProfileEntity, race: RaceEntity, trip: TripEntity, raceUrl: string) {
    try {
      if (!passengerProfile.email) return null;
      return await this.sendTemplateMail(MailTemplate.TRIP_REJECTED, passengerProfile.email, {
        name: passengerProfile.name,
        raceName: race.name,
        tripDate: trip.departureDay?.toDateString?.() || trip.departureDay,
        raceUrl,
      });
    } catch (error) {
      this.appLogger.logError('MailService.notifyTripRejected', 'Error enviando mail de rechazo', { passengerProfile, race, trip, raceUrl }, error);
      return null;
    }
  }

  async notifyTripLeaved(driverProfile: UserProfileEntity, race: RaceEntity, passengerProfile: UserProfileEntity, tripUrl: string) {
    try {
      if (!driverProfile.email) return null;
      return await this.sendTemplateMail(MailTemplate.TRIP_LEAVED, driverProfile.email, {
        name: driverProfile.name,
        raceName: race.name,
        passengerName: passengerProfile.name,
        tripUrl,
      });
    } catch (error) {
      this.appLogger.logError('MailService.notifyTripLeaved', 'Error enviando mail de abandono', { driverProfile, race, passengerProfile, tripUrl }, error);
      return null;
    }
  }
}
