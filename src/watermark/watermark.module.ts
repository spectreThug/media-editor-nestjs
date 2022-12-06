import { Module } from '@nestjs/common';
import { WatermarkService } from './watermark.service';
import { WatermarkController } from './watermark.controller';
import { CacheManagerModule } from 'src/cache-manager/cache-manager.module';
import { WatermarkTokensService } from './watermark_tokens.service';
import { DestinationModule } from 'src/destination/destination.module';

@Module({
  imports: [CacheManagerModule, DestinationModule],
  controllers: [WatermarkController],
  providers: [WatermarkService, WatermarkTokensService],
})
export class WatermarkModule {}
