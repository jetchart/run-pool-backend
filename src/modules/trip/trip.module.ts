import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripEntity } from './entities/trip.entity';
import { TripPassengerEntity } from './entities/trip-passenger.entity';
import { RaceEntity } from '../race/entities/race.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CarEntity } from '../user/entities/car.entity';
import { UserProfileEntity } from '../user/entities/user-profile.entity';
import { TripService } from './services/trip.service';
import { TripController } from './controllers/trip.controller';
import { TripRatingEntity } from './entities/trip-rating.entity';
import { TripRatingService } from './services/trip-rating.service';
import { TripRatingController } from './controllers/trip-rating.controller';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TripEntity,
      TripPassengerEntity,
      RaceEntity,
      UserEntity,
      CarEntity,
      UserProfileEntity,
      TripRatingEntity,
    ]),
    WhatsappModule,
  ],
  controllers: [TripController, TripRatingController],
  providers: [TripService, TripRatingService],
  exports: [TypeOrmModule, TripService],
})
export class TripModule {}