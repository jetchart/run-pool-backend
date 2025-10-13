import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripEntity } from './entities/trip.entity';
import { TripPassengerEntity } from './entities/trip-passenger.entity';
import { RaceEntity } from '../race/entities/race.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TripEntity, TripPassengerEntity, RaceEntity, UserEntity]),
  ],
  exports: [TypeOrmModule],
})
export class TripModule {}