import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';

@Module({
  providers: [RestaurantsService],
  controllers: [RestaurantsController]
})
export class RestaurantsModule {}
