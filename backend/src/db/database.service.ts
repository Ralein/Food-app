import { Injectable, OnModuleInit } from '@nestjs/common';
import { db } from '../db/db';
import * as schema from '../db/schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public readonly db = db;
  public readonly schema = schema;

  async onModuleInit() {
    // Connection is established automatically
    console.log('✅ Database connected');
  }
}

