import { Injectable, OnModuleInit } from '@nestjs/common';
import { TemplateService } from './template.service';
import { WhatsappTemplate } from '../templates/whatsapp-template.enum';
import * as qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { UserProfileEntity } from 'src/modules/user/entities/user-profile.entity';
import { RaceEntity } from 'src/modules/race/entities/race.entity';
import { TripEntity } from 'src/modules/trip/entities/trip.entity';


@Injectable()
export class WhatsappService implements OnModuleInit {
    private client: Client;
    private ready: boolean = false;

    constructor(private readonly templateService: TemplateService) {}

    async onModuleInit() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: { 
                headless: true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-accelerated-2d-canvas",
                    "--no-zygote",
                    "--no-first-run",
                    "--single-process",
                    "--disable-gpu",
                    ],
            },
        });
        this.client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
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
                console.error(`Error al enviar mensaje a ${phone}:`, error);
                results.push({ success: false, info: error.message });
            }
        }
        return results;
    }

    async notifyTripCreated(driver: UserProfileEntity, race: RaceEntity, trip: TripEntity): Promise<{ success: boolean; info: string }[]> {
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
        return this.sendMessage([driverPhone], message);
    }

    async notifyTripConfirmed(userProfile: UserProfileEntity, race: RaceEntity, trip: TripEntity): Promise<{ success: boolean; info: string }[]> {
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
        return this.sendMessage([driverPhone], message);
    }

    async notifyTripJoin(driverProfile: UserProfileEntity, race: RaceEntity, passengerProfile: UserProfileEntity): Promise<{ success: boolean; info: string }[]> {
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
        return this.sendMessage([driverPhone], message);
    }

    async notifyTripRejected(passengerProfile: UserProfileEntity, race: RaceEntity, trip: TripEntity): Promise<{ success: boolean; info: string }[]> {
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
        return this.sendMessage([passengerPhone], message);
    }

    async notifyTripLeaved(driverProfile: UserProfileEntity, race: RaceEntity, passengerProfile: UserProfileEntity): Promise<{ success: boolean; info: string }[]> {
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
        return this.sendMessage([driverPhone], message);
    }
}
