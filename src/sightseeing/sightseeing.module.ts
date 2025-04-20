import { Module } from '@nestjs/common';
import { SightseeingController } from './sightseeing.controller';
import { SightseeingService } from './sightseeing.service';
import { CsrfService } from 'src/auth/csrf.service';

@Module({
  controllers: [SightseeingController],
  providers: [SightseeingService, CsrfService]
})
export class SightseeingModule {}
