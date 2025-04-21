import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { CsrfService } from 'src/auth/csrf.service';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService, CsrfService],
})
export class ReservationsModule {}
