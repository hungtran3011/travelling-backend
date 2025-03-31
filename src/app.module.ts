import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AccommodationsModule } from './accommodations/accommodations.module';
import { SightseeingModule } from './sightseeing/sightseeing.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [UsersModule, AuthModule, AccommodationsModule, SightseeingModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
