import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { AuthGuard } from '../auth/auth.guard';
import { Restaurant, MenuItem } from './restaurant.types';

@Resolver()
export class RestaurantResolver {
  constructor(private restaurantService: RestaurantService) {}

  @Query(() => [Restaurant])
  @UseGuards(AuthGuard)
  async restaurants(@Context() context) {
    const user = context.req.user;
    return this.restaurantService.getRestaurants(user.country);
  }

  @Query(() => Restaurant, { nullable: true })
  @UseGuards(AuthGuard)
  async restaurant(
    @Args('id') id: string,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.restaurantService.getRestaurant(id, user.country);
  }

  @Query(() => [MenuItem])
  @UseGuards(AuthGuard)
  async menuItems(
    @Args('restaurantId') restaurantId: string,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.restaurantService.getMenuItems(restaurantId, user.country);
  }
}
