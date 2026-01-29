import { Injectable, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { paymentMethods, payments, orders } from '../db/schema';
import { eq, and, ne, desc } from 'drizzle-orm';
import { CreatePaymentMethodInput, ProcessPaymentInput } from './payment.types';

@Injectable()
export class PaymentService {
  constructor(private dbService: DatabaseService) {}

  async getPaymentMethods(userId: string, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can manage payment methods');
    }

    return this.dbService.db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.userId, userId))
      .orderBy(desc(paymentMethods.createdAt));
  }

  async createPaymentMethod(userId: string, userRole: string, input: CreatePaymentMethodInput) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can add payment methods');
    }

    if (input.isDefault) {
      await this.dbService.db
        .update(paymentMethods)
        .set({ isDefault: false })
        .where(eq(paymentMethods.userId, userId));
    }

    const [paymentMethod] = await this.dbService.db
      .insert(paymentMethods)
      .values({
        userId,
        ...input,
      })
      .returning();

    return paymentMethod;
  }

  async updatePaymentMethod(
    paymentMethodId: string,
    userId: string,
    userRole: string,
    input: Partial<CreatePaymentMethodInput>
  ) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can modify payment methods');
    }

    const [paymentMethod] = await this.dbService.db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.id, paymentMethodId))
      .limit(1);

    if (!paymentMethod || paymentMethod.userId !== userId) {
      throw new ForbiddenException('Payment method not found');
    }

    if (input.isDefault) {
      await this.dbService.db
        .update(paymentMethods)
        .set({ isDefault: false })
        .where(and(
          eq(paymentMethods.userId, userId),
          ne(paymentMethods.id, paymentMethodId)
        ));
    }

    const [updated] = await this.dbService.db
      .update(paymentMethods)
      .set(input)
      .where(eq(paymentMethods.id, paymentMethodId))
      .returning();

    return updated;
  }

  async deletePaymentMethod(paymentMethodId: string, userId: string, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete payment methods');
    }

    const [paymentMethod] = await this.dbService.db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.id, paymentMethodId))
      .limit(1);

    if (!paymentMethod || paymentMethod.userId !== userId) {
      throw new ForbiddenException('Payment method not found');
    }

    await this.dbService.db
      .delete(paymentMethods)
      .where(eq(paymentMethods.id, paymentMethodId));

    return true;
  }

  async processPayment(userId: string, userRole: string, input: ProcessPaymentInput) {
    if (userRole === 'MEMBER') {
      throw new ForbiddenException('Members cannot process payments');
    }

    const [order] = await this.dbService.db
      .select()
      .from(orders)
      .where(eq(orders.id, input.orderId))
      .limit(1);

    if (!order) {
      throw new Error('Order not found');
    }

    const [existingPayment] = await this.dbService.db
      .select()
      .from(payments)
      .where(eq(payments.orderId, input.orderId))
      .limit(1);

    if (existingPayment) {
      throw new Error('Order already paid');
    }

    if (order.status === 'CANCELLED') {
      throw new Error('Cannot pay for cancelled order');
    }

    const [paymentMethod] = await this.dbService.db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.id, input.paymentMethodId))
      .limit(1);

    if (!paymentMethod || paymentMethod.userId !== userId) {
      throw new ForbiddenException('Invalid payment method');
    }

    const [payment] = await this.dbService.db
      .insert(payments)
      .values({
        orderId: input.orderId,
        paymentMethodId: input.paymentMethodId,
        amount: order.totalAmount,
      })
      .returning();

    await this.dbService.db
      .update(orders)
      .set({ status: 'CONFIRMED' })
      .where(eq(orders.id, input.orderId));

    return {
      ...payment,
      paymentMethod,
    };
  }
}
