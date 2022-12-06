import { Controller, Get, Param } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEmitterNames } from 'src/constants/enums.constants';
import { CacheManagerService } from './cache-manager.service';

@Controller('config')
export class CacheManagerController {
  constructor(private readonly cacheManagerService: CacheManagerService) {}

  @Get('/get-client/:id')
  async getClient(@Param('id') id: string) {
    console.log(id);
    return await this.cacheManagerService.getClientById(id);
  }

  // @OnEvent(EventEmitterNames.ServerStarted)
  // onServerStarted(payload: { target: string; cacheAll: boolean }) {
  //   console.log(payload);
  //   this.cacheManagerService.cacheClients();
  // }
}
