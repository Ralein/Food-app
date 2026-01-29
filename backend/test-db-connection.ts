import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;

console.log('Testing database connection...');
console.log('Connection string format:', connectionString.substring(0, 30) + '...');

const client = postgres(connectionString);
const db = drizzle(client);

async function testConnection() {
    try {
        await client`SELECT 1`;
        console.log('✅ Database connection successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

testConnection();
