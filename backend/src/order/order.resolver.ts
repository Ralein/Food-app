import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/auth.types';
import { Order, CreateOrderInput } from './order.types';

@Resolver()
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Mutation(() => Order)
  @UseGuards(AuthGuard)
  async createOrder(
    @Args('input') input: CreateOrderInput,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.orderService.createOrder(user.id, user.country, input);
  }

  @Query(() => [Order])
  @UseGuards(AuthGuard)
  async orders(@Context() context) {
    const user = context.req.user;
    return this.orderService.getOrders(user.id, user.role);
  }

  @Query(() => Order)
  @UseGuards(AuthGuard)
  async order(
    @Args('id') id: string,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.orderService.getOrder(id, user.id, user.role);
  }

  @Mutation(() => Order)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async cancelOrder(
    @Args('id') id: string,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.orderService.cancelOrder(id, user.id, user.role);
  }
}
