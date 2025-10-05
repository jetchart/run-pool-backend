import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration as devConfiguration } from '../config/config.development';
import { configuration as productionConfiguration } from '../config/config.production';
import { configuration as stagingConfiguration } from '../config/config.staging';
import { configuration as testingConfiguration } from '../config/config.testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LoggerModule } from 'nestjs-pino';
import { AppLoggerModule } from './app-logger/app-logger.module';
import { ErrorMiddleware } from 'src/middlewares/error.middleware';
import { RaceModule } from './race/race.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: (() => {
        const env = process.env.NODE_ENV;
        if (env === 'production') return [productionConfiguration];
        if (env === 'staging') return [stagingConfiguration];
        if (env === 'testing' || env === 'test') return [testingConfiguration];
        return [devConfiguration];
      })(),
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions =>
        config.get<TypeOrmModuleOptions>('database')!,
    }),
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    UserModule,
    AppLoggerModule,
    RaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorMiddleware).forRoutes('*');
  }
}
