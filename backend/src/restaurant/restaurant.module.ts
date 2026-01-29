import { Module } from '@nestjs/common';
import { RestaurantResolver } from './restaurant.resolver';
import { RestaurantService } from './restaurant.service';
import { DatabaseService } from '../db/database.service';
import { AuthService } from '../auth/auth.service';

@Module({
  providers: [RestaurantResolver, RestaurantService, DatabaseService, AuthService],
})
export class RestaurantModule {}
