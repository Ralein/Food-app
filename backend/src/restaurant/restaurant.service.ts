import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { restaurants, menuItems } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class RestaurantService {
  constructor(private dbService: DatabaseService) {}

  async getRestaurants(userCountry: string) {
    const restaurantList = await this.dbService.db
      .select()
      .from(restaurants)
      .where(eq(restaurants.country, userCountry as any));

    // Get menu items for each restaurant
    const restaurantsWithMenus = await Promise.all(
      restaurantList.map(async (restaurant) => {
        const items = await this.dbService.db
          .select()
          .from(menuItems)
          .where(eq(menuItems.restaurantId, restaurant.id));
        return { ...restaurant, menuItems: items };
      })
    );

    return restaurantsWithMenus;
  }

  async getRestaurant(id: string, userCountry: string) {
    const [restaurant] = await this.dbService.db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, id))
      .limit(1);

    if (restaurant && restaurant.country !== userCountry) {
      throw new Error('Access denied: Restaurant not in your country');
    }

    if (restaurant) {
      const items = await this.dbService.db
        .select()
        .from(menuItems)
        .where(eq(menuItems.restaurantId, id));
      return { ...restaurant, menuItems: items };
    }

    return restaurant;
  }

  async getMenuItems(restaurantId: string, userCountry: string) {
    const [restaurant] = await this.dbService.db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .limit(1);

    if (restaurant && restaurant.country !== userCountry) {
      throw new Error('Access denied: Restaurant not in your country');
    }

    return this.dbService.db
      .select()
      .from(menuItems)
      .where(eq(menuItems.restaurantId, restaurantId));
  }
}
