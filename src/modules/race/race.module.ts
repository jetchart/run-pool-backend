import { Module } from '@nestjs/common';
import { RaceController } from './controllers/race.controller';
import { RaceService } from './services/race.service';
import { RaceEntity } from './entities/race.entity';
import { AppLoggerModule } from '../app-logger/app-logger.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceDistanceEntity } from './entities/race-distance.entity';
import { DistanceEntity } from './entities/distance.entity';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([RaceEntity, RaceDistanceEntity, DistanceEntity]),
        AppLoggerModule,
      ],
      controllers: [RaceController],
      providers: [RaceService],
})
export class RaceModule {}
