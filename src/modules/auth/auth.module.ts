import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { AppLoggerModule } from '../app-logger/app-logger.module';
import { AuthService } from './services/auth.service';
import { TripRatingEntity } from '../trip/entities/trip-rating.entity';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'THE_SECRET',
      signOptions: { expiresIn: '7d' },
    }),
  TypeOrmModule.forFeature([UserEntity, TripRatingEntity]),
    AppLoggerModule,
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService],
  exports: [UserService, AuthService],
})
export class AuthModule {}
