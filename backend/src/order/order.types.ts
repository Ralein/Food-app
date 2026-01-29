import { ObjectType, Field, Float, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { Restaurant } from '../restaurant/restaurant.types';
import { User } from '../auth/auth.types';
import { MenuItem } from '../restaurant/restaurant.types';
import { Payment } from '../payment/payment.types';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class OrderItem {
  @Field()
  id: string;

  @Field()
  menuItemId: string;

  @Field()
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field(() => MenuItem, { nullable: true })
  menuItem?: MenuItem;
}


@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  restaurantId: string;

  @Field(() => Restaurant, { nullable: true })
  restaurant?: Restaurant;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @Field(() => Payment, { nullable: true })
  payment?: Payment;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class OrderItemInput {
  @Field()
  menuItemId: string;

  @Field(() => Int)
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field()
  restaurantId: string;

  @Field(() => [OrderItemInput])
  items: OrderItemInput[];
}
