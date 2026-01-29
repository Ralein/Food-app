import { Injectable, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { restaurants, menuItems, orders, orderItems, users, payments, paymentMethods } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { CreateOrderInput } from './order.types';

@Injectable()
export class OrderService {
  constructor(private dbService: DatabaseService) {}

  async createOrder(userId: string, userCountry: string, input: CreateOrderInput) {
    const [restaurant] = await this.dbService.db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, input.restaurantId))
      .limit(1);

    if (!restaurant || restaurant.country !== userCountry) {
      throw new ForbiddenException('Cannot order from restaurants outside your country');
    }

    const menuItemIds = input.items.map(item => item.menuItemId);
    const menuItemsList = await this.dbService.db
      .select()
      .from(menuItems)
      .where(eq(menuItems.restaurantId, input.restaurantId));

    let totalAmount = 0;
    const orderItemsData = input.items.map(item => {
      const menuItem = menuItemsList.find(mi => mi.id === item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      };
    });

    const [order] = await this.dbService.db
      .insert(orders)
      .values({
        userId,
        restaurantId: input.restaurantId,
        totalAmount,
        status: 'PENDING',
      })
      .returning();

    const createdOrderItems = await this.dbService.db
      .insert(orderItems)
      .values(
        orderItemsData.map(item => ({
          ...item,
          orderId: order.id,
        }))
      )
      .returning();

    // Fetch complete order with relations
    const orderItemsWithMenuItems = await Promise.all(
      createdOrderItems.map(async (item) => {
        const [menuItem] = await this.dbService.db
          .select()
          .from(menuItems)
          .where(eq(menuItems.id, item.menuItemId))
          .limit(1);
        return { ...item, menuItem };
      })
    );

    return {
      ...order,
      restaurant,
      orderItems: orderItemsWithMenuItems,
    };
  }

  async getOrders(userId: string, userRole: string) {
    let ordersList;
    
    if (userRole === 'ADMIN' || userRole === 'MANAGER') {
      ordersList = await this.dbService.db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt));
    } else {
      ordersList = await this.dbService.db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));
    }

    // Fetch relations for each order
    const ordersWithRelations = await Promise.all(
      ordersList.map(async (order) => {
        const [restaurant] = await this.dbService.db
          .select()
          .from(restaurants)
          .where(eq(restaurants.id, order.restaurantId))
          .limit(1);

        const [user] = await this.dbService.db
          .select()
          .from(users)
          .where(eq(users.id, order.userId))
          .limit(1);

        const items = await this.dbService.db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        const itemsWithMenuItems = await Promise.all(
          items.map(async (item) => {
            const [menuItem] = await this.dbService.db
              .select()
              .from(menuItems)
              .where(eq(menuItems.id, item.menuItemId))
              .limit(1);
            return { ...item, menuItem };
          })
        );

        const [payment] = await this.dbService.db
          .select()
          .from(payments)
          .where(eq(payments.orderId, order.id))
          .limit(1);

        return {
          ...order,
          restaurant,
          user,
          orderItems: itemsWithMenuItems,
          payment,
        };
      })
    );

    return ordersWithRelations;
  }

  async getOrder(orderId: string, userId: string, userRole: string) {
    const [order] = await this.dbService.db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      throw new Error('Order not found');
    }

    if (userRole === 'MEMBER' && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Fetch relations
    const [restaurant] = await this.dbService.db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, order.restaurantId))
      .limit(1);

    const [user] = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.id, order.userId))
      .limit(1);

    const items = await this.dbService.db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    const itemsWithMenuItems = await Promise.all(
      items.map(async (item) => {
        const [menuItem] = await this.dbService.db
          .select()
          .from(menuItems)
          .where(eq(menuItems.id, item.menuItemId))
          .limit(1);
        return { ...item, menuItem };
      })
    );

    const [payment] = await this.dbService.db
      .select()
      .from(payments)
      .where(eq(payments.orderId, order.id))
      .limit(1);

    let paymentWithMethod = null;
    if (payment) {
      const [paymentMethod] = await this.dbService.db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.id, payment.paymentMethodId))
        .limit(1);
      paymentWithMethod = { ...payment, paymentMethod };
    }

    return {
      ...order,
      restaurant,
      user,
      orderItems: itemsWithMenuItems,
      payment: paymentWithMethod,
    };
  }

  async cancelOrder(orderId: string, userId: string, userRole: string) {
    if (userRole === 'MEMBER') {
      throw new ForbiddenException('Members cannot cancel orders');
    }

    const [order] = await this.dbService.db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      throw new Error('Cannot cancel this order');
    }

    const [updatedOrder] = await this.dbService.db
      .update(orders)
      .set({ status: 'CANCELLED' })
      .where(eq(orders.id, orderId))
      .returning();

    // Fetch relations
    const [restaurant] = await this.dbService.db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, updatedOrder.restaurantId))
      .limit(1);

    const items = await this.dbService.db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, updatedOrder.id));

    const itemsWithMenuItems = await Promise.all(
      items.map(async (item) => {
        const [menuItem] = await this.dbService.db
          .select()
          .from(menuItems)
          .where(eq(menuItems.id, item.menuItemId))
          .limit(1);
        return { ...item, menuItem };
      })
    );

    return {
      ...updatedOrder,
      restaurant,
      orderItems: itemsWithMenuItems,
    };
  }
}
