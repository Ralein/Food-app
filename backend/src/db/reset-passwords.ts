import 'dotenv/config';
import { db } from './db';
import { users } from './schema';
import { inArray } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

async function reset() {
    console.log('🔄 Resetting passwords...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const emails = [
        'admin@india.com',
        'manager@india.com',
        'member@india.com',
        'admin@america.com',
        'manager@america.com',
        'member@america.com'
    ];

    await db.update(users)
        .set({ password: hashedPassword })
        .where(inArray(users.email, emails));

    console.log('✅ Passwords reset to "password123"');
    process.exit(0);
}

reset().catch((e) => {
    console.error(e);
    process.exit(1);
});
