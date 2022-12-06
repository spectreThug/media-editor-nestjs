import { Module, CacheModule } from '@nestjs/common';
import { CacheManagerService } from './cache-manager.service';
import { CacheManagerController } from './cache-manager.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    OrganizationModule,
  ],
  controllers: [CacheManagerController],
  providers: [CacheManagerService],
  exports: [CacheManagerService],
})
export class CacheManagerModule {}
