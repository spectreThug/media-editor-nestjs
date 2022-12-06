import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheManagerModule } from './cache-manager/cache-manager.module';
import { AuthGuard } from './guards/auth.guard';
import { OrganizationModule } from './organization/organization.module';
import { CronModule } from './cron/cron.module';
import { WatermarkModule } from './watermark/watermark.module';
import { DestinationModule } from './destination/destination.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),

    EventEmitterModule.forRoot({
      wildcard: false,

      delimiter: '.',

      newListener: false,

      removeListener: false,

      maxListeners: 10,

      verboseMemoryLeak: false,

      ignoreErrors: true,
    }),
    ScheduleModule.forRoot(),
    CronModule,
    OrganizationModule,
    CacheManagerModule,
    WatermarkModule,
    DestinationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
