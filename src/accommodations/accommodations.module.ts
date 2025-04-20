import { Module } from '@nestjs/common';
import { AccommodationsController } from './accommodations.controller';
import { AccommodationsService } from './accommodations.service';
import { CsrfService } from 'src/auth/csrf.service';

@Module({
  controllers: [AccommodationsController],
  providers: [AccommodationsService, CsrfService]
})
export class AccommodationsModule {}
