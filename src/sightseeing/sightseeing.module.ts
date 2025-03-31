import { Module } from '@nestjs/common';
import { SightseeingController } from './sightseeing.controller';
import { SightseeingService } from './sightseeing.service';

@Module({
  controllers: [SightseeingController],
  providers: [SightseeingService]
})
export class SightseeingModule {}
