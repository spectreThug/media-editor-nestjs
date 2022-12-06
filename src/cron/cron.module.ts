import { Module } from '@nestjs/common';
import { CacheManagerModule } from 'src/cache-manager/cache-manager.module';
import { CronService } from './cron.service';

@Module({
  imports: [CacheManagerModule],
  providers: [CronService],
  controllers: [],
})
export class CronModule {}
