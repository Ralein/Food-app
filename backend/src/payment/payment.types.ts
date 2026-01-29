import { ObjectType, Field, Float, InputType, Int } from '@nestjs/graphql';
import { Order } from '../order/order.types';

@ObjectType()
export class PaymentMethod {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  cardNumber: string;

  @Field()
  cardHolder: string;

  @Field(() => Int)
  expiryMonth: number;

  @Field(() => Int)
  expiryYear: number;

  @Field()
  isDefault: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Payment {
  @Field()
  id: string;

  @Field()
  orderId: string;

  @Field(() => Order, { nullable: true })
  order?: Order;

  @Field()
  paymentMethodId: string;

  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: PaymentMethod;

  @Field(() => Float)
  amount: number;

  @Field()
  createdAt: Date;
}

@InputType()
export class CreatePaymentMethodInput {
  @Field()
  cardNumber: string;

  @Field()
  cardHolder: string;

  @Field(() => Int)
  expiryMonth: number;

  @Field(() => Int)
  expiryYear: number;

  @Field({ defaultValue: false })
  isDefault: boolean;
}

@InputType()
export class UpdatePaymentMethodInput {
  @Field({ nullable: true })
  cardNumber?: string;

  @Field({ nullable: true })
  cardHolder?: string;

  @Field(() => Int, { nullable: true })
  expiryMonth?: number;

  @Field(() => Int, { nullable: true })
  expiryYear?: number;

  @Field({ nullable: true })
  isDefault?: boolean;
}

@InputType()
export class ProcessPaymentInput {
  @Field()
  orderId: string;

  @Field()
  paymentMethodId: string;
}
