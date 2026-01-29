import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { DatabaseService } from '../db/database.service';
import { AuthService } from '../auth/auth.service';

@Module({
  providers: [OrderResolver, OrderService, DatabaseService, AuthService],
})
export class OrderModule {}
