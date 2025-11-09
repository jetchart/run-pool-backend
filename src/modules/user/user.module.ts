import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserProfileController } from './controllers/user-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from './entities/user.entity';
import { UserProfileEntity } from './entities/user-profile.entity';
import { CarEntity } from './entities/car.entity';
import { UserProfileRaceTypeEntity } from './entities/user-profile-race-type.entity';
import { UserProfileDistanceEntity } from './entities/user-profile-distance.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { UserService } from './services/user.service';
import { UserProfileService } from './services/user-profile.service';
import { TripRatingEntity } from '../trip/entities/trip-rating.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserProfileEntity,
      CarEntity,
      UserProfileRaceTypeEntity,
      UserProfileDistanceEntity,
      TripRatingEntity,
    ]),
    JwtModule,
  ],
  controllers: [UserController, UserProfileController],
  providers: [UserService, UserProfileService, JwtStrategy, JwtAuthGuard],
  exports: [UserService, UserProfileService],
})
export class UserModule {}
