import { Injectable, OnModuleInit } from '@nestjs/common';
import { TemplateService } from './template.service';
import { WhatsappTemplate } from '../templates/whatsapp-template.enum';
import * as qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { UserProfileEntity } from 'src/modules/user/entities/user-profile.entity';
import { RaceEntity } from 'src/modules/race/entities/race.entity';
import { TripEntity } from 'src/modules/trip/entities/trip.entity';
import QRCode from "qrcode";
import { AppLogger } from '../../app-logger/services/app-logger';


@Injectable()
export class WhatsappService implements OnModuleInit {
    private client: Client;
    private ready: boolean = false;

    constructor(
        private readonly templateService: TemplateService,
        private readonly appLogger: AppLogger,
    ) {}

    async onModuleInit() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: { 
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            },
        }); 
        this.client.on('qr', async (qr) => {
            console.clear();
            qrcode.generate(qr, { small: true });
            await QRCode.toFile("whatsapp-qr.png", qr);
            console.log('Escaneá el QR para iniciar sesión en WhatsApp Web');
        });
        this.client.on('ready', () => {
            this.ready = true;
            console.log('WhatsApp Web client is ready!');
        });
        this.client.initialize();
    }

    async sendMessage(phones: string[], message: string): Promise<{ success: boolean; info: string }[]> {
        const results: { success: boolean; info: string }[] = [];
        for (const phone of phones) {
            try {
                const chatId = phone.endsWith('@c.us') ? phone : `${phone}@c.us`;
                await this.client.sendMessage(chatId, message);
                results.push({ success: true, info: `Mensaje enviado a ${phone}` });
            } catch (error: any) {
                this.appLogger.logError('WhatsappService.sendMessage', `Error al enviar mensaje a ${phone}`, { phone, message }, error);
                results.push({ success: false, info: error.message });
            }
        }
        return results;
    }

    async notifyTripCreated(driver: UserProfileEntity, race: RaceEntity, trip: TripEntity): Promise<{ success: boolean; info: string }[]> {
        try {
            const driverPhone = driver.phoneCountryCode && driver.phoneNumber
                ? `${driver.phoneCountryCode}${driver.phoneNumber}`
                : undefined;
            if (!driverPhone) {
                return [{ success: false, info: 'El conductor no tiene teléfono registrado' }];
            }
            const message = this.templateService.renderTemplate(
                WhatsappTemplate.TRIP_CREATED,
                {
                    name: driver.name,
                    raceName: race.name,
                    tripDate: trip.departureDay.toDateString()
                }
            );
            return await this.sendMessage([driverPhone], message);
        } catch (error) {
            this.appLogger.logError('WhatsappService.notifyTripCreated', 'Error enviando notificación de viaje creado', { driver, race, trip }, error);
            return [{ success: false, info: 'Error enviando notificación de viaje creado' }];
        }
    }

    async notifyTripConfirmed(userProfile: UserProfileEntity, race: RaceEntity, trip: TripEntity): Promise<{ success: boolean; info: string }[]> {
        try {
            const driverPhone = userProfile.phoneCountryCode && userProfile.phoneNumber
                ? `${userProfile.phoneCountryCode}${userProfile.phoneNumber}`
                : undefined;
            if (!driverPhone) {
                return [{ success: false, info: 'El conductor no tiene teléfono registrado' }];
            }
            const message = this.templateService.renderTemplate(
                WhatsappTemplate.TRIP_CONFIRMED,
                {
                    name: userProfile.name,
                    raceName: race.name,
                    tripDate: trip.departureDay.toDateString(),
                }
            );
            return await this.sendMessage([driverPhone], message);
        } catch (error) {
            this.appLogger.logError('WhatsappService.notifyTripConfirmed', 'Error enviando notificación de viaje confirmado', { userProfile, race, trip }, error);
            return [{ success: false, info: 'Error enviando notificación de viaje confirmado' }];
        }
    }

    async notifyTripJoin(driverProfile: UserProfileEntity, race: RaceEntity, passengerProfile: UserProfileEntity): Promise<{ success: boolean; info: string }[]> {
        try {
            const driverPhone = driverProfile.phoneCountryCode && driverProfile.phoneNumber
                ? `${driverProfile.phoneCountryCode}${driverProfile.phoneNumber}`
                : undefined;
            if (!driverPhone) {
                return [{ success: false, info: 'El conductor no tiene teléfono registrado' }];
            }
            const message = this.templateService.renderTemplate(
                WhatsappTemplate.TRIP_JOIN,
                {
                    name: driverProfile.name,
                    raceName: race.name,
                    passengerName: passengerProfile.name,
                }
            );
            return await this.sendMessage([driverPhone], message);
        } catch (error) {
            this.appLogger.logError('WhatsappService.notifyTripJoin', 'Error enviando notificación de postulación', { driverProfile, race, passengerProfile }, error);
            return [{ success: false, info: 'Error enviando notificación de postulación' }];
        }
    }

    async notifyTripRejected(passengerProfile: UserProfileEntity, race: RaceEntity, trip: TripEntity): Promise<{ success: boolean; info: string }[]> {
        try {
            const passengerPhone = passengerProfile.phoneCountryCode && passengerProfile.phoneNumber
                ? `${passengerProfile.phoneCountryCode}${passengerProfile.phoneNumber}`
                : undefined;
            if (!passengerPhone) {
                return [{ success: false, info: 'El pasajero no tiene teléfono registrado' }];
            }
            const message = this.templateService.renderTemplate(
                WhatsappTemplate.TRIP_REJECTED,
                {
                    name: passengerProfile.name,
                    raceName: race.name,
                    tripDate: trip.departureDay.toDateString(),
                }
            );
            return await this.sendMessage([passengerPhone], message);
        } catch (error) {
            this.appLogger.logError('WhatsappService.notifyTripRejected', 'Error enviando notificación de rechazo', { passengerProfile, race, trip }, error);
            return [{ success: false, info: 'Error enviando notificación de rechazo' }];
        }
    }

    async notifyTripLeaved(driverProfile: UserProfileEntity, race: RaceEntity, passengerProfile: UserProfileEntity): Promise<{ success: boolean; info: string }[]> {
        try {
            const driverPhone = driverProfile.phoneCountryCode && driverProfile.phoneNumber
                ? `${driverProfile.phoneCountryCode}${driverProfile.phoneNumber}`
                : undefined;
            if (!driverPhone) {
                return [{ success: false, info: 'El conductor no tiene teléfono registrado' }];
            }
            const message = this.templateService.renderTemplate(
                WhatsappTemplate.TRIP_LEAVED,
                {
                    name: driverProfile.name,
                    raceName: race.name,
                    passengerName: passengerProfile.name,
                }
            );
            return await this.sendMessage([driverPhone], message);
        } catch (error) {
            this.appLogger.logError('WhatsappService.notifyTripLeaved', 'Error enviando notificación de abandono', { driverProfile, race, passengerProfile }, error);
            return [{ success: false, info: 'Error enviando notificación de abandono' }];
        }
    }
}
