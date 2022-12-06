import { Module } from '@nestjs/common';
import { DestinationService } from './destination.service';

@Module({
  controllers: [],
  providers: [DestinationService],
  exports: [DestinationService],
})
export class DestinationModule {}
