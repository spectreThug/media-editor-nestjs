import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';

@Injectable()
export class CronService {
  constructor(private cacheManagerService: CacheManagerService) {}
  private readonly logger = new Logger(CronService.name);
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    //12:00 AM
    name: 'package-cron-job-daily',
    timeZone: 'Africa/Cairo',
  })
  async cronJob() {
    this.logger.debug('=> [ORGANIZATIONS] : Daily cron job started');
    const clients = await this.cacheManagerService.organizationService.getAll();

    if (clients.length > 0) {
      for (let i = 0; i < clients.length; i++) {
        await this.cacheManagerService.setClient(clients[i]);
      }
    }
  }
}
