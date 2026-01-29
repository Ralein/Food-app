import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key-change-in-production';

@Injectable()
export class AuthService {
  constructor(private dbService: DatabaseService) { }

  async login(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase(); // Ensure consistent email format
    console.log(`[AuthService] Attempting login for: '${cleanEmail}'`);

    const [user] = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (!user) {
      console.error(`[AuthService] User not found: '${cleanEmail}'`);
      throw new Error('User not found. Please check your email.');
    }

    console.log(`[AuthService] User found (ID: ${user.id}). Verifying password...`);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`[AuthService] Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.error(`[AuthService] Invalid password for: '${cleanEmail}'`);
      throw new Error('Invalid password. Please try again.');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, country: user.country },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const [user] = await this.dbService.db
        .select()
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getCurrentUser(userId: string) {
    const [user] = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return user;
  }
}
