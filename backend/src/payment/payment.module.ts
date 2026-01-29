import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { DatabaseService } from '../db/database.service';
import { AuthService } from '../auth/auth.service';

@Module({
  providers: [PaymentResolver, PaymentService, DatabaseService, AuthService],
})
export class PaymentModule {}
