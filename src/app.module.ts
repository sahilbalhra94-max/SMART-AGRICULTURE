import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import configuration, {
  databaseConfig,
  redisConfig,
  jwtConfig,
  openaiConfig,
  s3Config,
  weatherConfig,
  mqttConfig,
} from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { FarmsModule } from './modules/farms/farms.module';
import { CropsModule } from './modules/crops/crops.module';
import { WeatherModule } from './modules/weather/weather.module';
import { AiModule } from './modules/ai/ai.module';
import { DiseaseModule } from './modules/disease/disease.module';
import { IrrigationModule } from './modules/irrigation/irrigation.module';
import { SensorsModule } from './modules/sensors/sensors.module';
import { MarketModule } from './modules/market/market.module';
import { SchemesModule } from './modules/schemes/schemes.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { FilesModule } from './modules/files/files.module';
import { SatelliteModule } from './modules/satellite/satellite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        configuration,
        databaseConfig,
        redisConfig,
        jwtConfig,
        openaiConfig,
        s3Config,
        weatherConfig,
        mqttConfig,
      ],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    FarmsModule,
    CropsModule,
    WeatherModule,
    AiModule,
    DiseaseModule,
    IrrigationModule,
    SensorsModule,
    MarketModule,
    SchemesModule,
    NotificationsModule,
    AnalyticsModule,
    FilesModule,
    SatelliteModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
