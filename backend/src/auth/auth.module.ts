import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { DatabaseService } from '../db/database.service';

@Module({
  providers: [AuthResolver, AuthService, DatabaseService],
  exports: [AuthService],
})
export class AuthModule {}
