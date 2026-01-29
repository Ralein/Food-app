import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/auth.types';
import { PaymentMethod, Payment, CreatePaymentMethodInput, UpdatePaymentMethodInput, ProcessPaymentInput } from './payment.types';

@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Query(() => [PaymentMethod])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async paymentMethods(@Context() context) {
    const user = context.req.user;
    return this.paymentService.getPaymentMethods(user.id, user.role);
  }

  @Mutation(() => PaymentMethod)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createPaymentMethod(
    @Args('input') input: CreatePaymentMethodInput,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.paymentService.createPaymentMethod(user.id, user.role, input);
  }

  @Mutation(() => PaymentMethod)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updatePaymentMethod(
    @Args('id') id: string,
    @Args('input') input: UpdatePaymentMethodInput,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.paymentService.updatePaymentMethod(id, user.id, user.role, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deletePaymentMethod(
    @Args('id') id: string,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.paymentService.deletePaymentMethod(id, user.id, user.role);
  }

  @Mutation(() => Payment)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async processPayment(
    @Args('input') input: ProcessPaymentInput,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.paymentService.processPayment(user.id, user.role, input);
  }
}
