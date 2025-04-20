import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { CsrfService } from 'src/auth/csrf.service';

@Module({
  providers: [RestaurantsService, CsrfService],
  controllers: [RestaurantsController]
})
export class RestaurantsModule {}
