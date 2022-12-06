import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as dayjs from 'dayjs';
import { OrganizationDocument } from 'src/organization/entities/organization.entity';
import { OrganizationService } from 'src/organization/organization.service';
import { getEgyptTimeZoneDate } from 'src/utils/dayjs.utils';

@Injectable()
export class CacheManagerService implements OnApplicationBootstrap {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    public organizationService: OrganizationService,
  ) {}

  async onApplicationBootstrap() {
    console.log('Application initialized ...');
    const clients = await this.organizationService.getAll();
    for (let i = 0; i < clients.length; i++) {
      await this.setClient(clients[i]);
    }
  }

  setClient(client: OrganizationDocument) {
    return this.cacheManager.set(
      client.identifier,
      JSON.stringify(client),
      1000 * 60 * 60 * 24,
    );
  }

  getClientById(identifier: string) {
    return this.cacheManager.get(identifier);
  }
}
