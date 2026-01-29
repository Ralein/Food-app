import 'dotenv/config';
import { db } from './db';
import { users, restaurants, menuItems, paymentMethods } from './schema';
import * as bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const [adminIndia] = await db.insert(users).values({
    email: 'admin@india.com',
    password: hashedPassword,
    name: 'Admin India',
    role: 'ADMIN',
    country: 'INDIA',
  }).returning();

  const [managerIndia] = await db.insert(users).values({
    email: 'manager@india.com',
    password: hashedPassword,
    name: 'Manager India',
    role: 'MANAGER',
    country: 'INDIA',
  }).returning();

  const [memberIndia] = await db.insert(users).values({
    email: 'member@india.com',
    password: hashedPassword,
    name: 'Member India',
    role: 'MEMBER',
    country: 'INDIA',
  }).returning();

  const [adminAmerica] = await db.insert(users).values({
    email: 'admin@america.com',
    password: hashedPassword,
    name: 'Admin America',
    role: 'ADMIN',
    country: 'AMERICA',
  }).returning();

  const [managerAmerica] = await db.insert(users).values({
    email: 'manager@america.com',
    password: hashedPassword,
    name: 'Manager America',
    role: 'MANAGER',
    country: 'AMERICA',
  }).returning();

  const [memberAmerica] = await db.insert(users).values({
    email: 'member@america.com',
    password: hashedPassword,
    name: 'Member America',
    role: 'MEMBER',
    country: 'AMERICA',
  }).returning();

  console.log('✅ Users created');

  // Create restaurants in India
  const [restaurantIndia1] = await db.insert(restaurants).values({
    name: 'Spice Garden',
    description: 'Authentic Indian cuisine',
    country: 'INDIA',
    address: 'MG Road, Bangalore, India',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
  }).returning();

  const [restaurantIndia2] = await db.insert(restaurants).values({
    name: 'Curry House',
    description: 'Traditional North Indian food',
    country: 'INDIA',
    address: 'Connaught Place, New Delhi, India',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
  }).returning();

  // Create restaurants in America
  const [restaurantAmerica1] = await db.insert(restaurants).values({
    name: 'Burger Palace',
    description: 'Classic American burgers',
    country: 'AMERICA',
    address: '5th Avenue, New York, USA',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
  }).returning();

  const [restaurantAmerica2] = await db.insert(restaurants).values({
    name: 'Pizza Corner',
    description: 'New York style pizza',
    country: 'AMERICA',
    address: 'Broadway, New York, USA',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  }).returning();

  console.log('✅ Restaurants created');

  // Create menu items for Indian restaurants
  await db.insert(menuItems).values([
    {
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken',
      price: 350,
      category: 'Main Course',
      restaurantId: restaurantIndia1.id,
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
    },
    {
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese with spices',
      price: 280,
      category: 'Appetizer',
      restaurantId: restaurantIndia1.id,
      imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8',
    },
    {
      name: 'Biryani',
      description: 'Fragrant rice with spiced meat',
      price: 400,
      category: 'Main Course',
      restaurantId: restaurantIndia1.id,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
    },
    {
      name: 'Dal Makhani',
      description: 'Creamy black lentils',
      price: 220,
      category: 'Main Course',
      restaurantId: restaurantIndia2.id,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
    },
    {
      name: 'Naan',
      description: 'Traditional Indian bread',
      price: 50,
      category: 'Bread',
      restaurantId: restaurantIndia2.id,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    },
  ]);

  // Create menu items for American restaurants
  await db.insert(menuItems).values([
    {
      name: 'Classic Cheeseburger',
      description: 'Beef patty with cheese, lettuce, and tomato',
      price: 12.99,
      category: 'Burgers',
      restaurantId: restaurantAmerica1.id,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    },
    {
      name: 'BBQ Bacon Burger',
      description: 'Burger with BBQ sauce and crispy bacon',
      price: 14.99,
      category: 'Burgers',
      restaurantId: restaurantAmerica1.id,
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b',
    },
    {
      name: 'French Fries',
      description: 'Crispy golden fries',
      price: 4.99,
      category: 'Sides',
      restaurantId: restaurantAmerica1.id,
      imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877',
    },
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato and mozzarella',
      price: 16.99,
      category: 'Pizza',
      restaurantId: restaurantAmerica2.id,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    },
    {
      name: 'Pepperoni Pizza',
      description: 'Pizza topped with pepperoni',
      price: 18.99,
      category: 'Pizza',
      restaurantId: restaurantAmerica2.id,
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
    },
  ]);

  console.log('✅ Menu items created');

  // Create payment methods for admins
  await db.insert(paymentMethods).values({
    userId: adminIndia.id,
    cardNumber: '4111111111111111',
    cardHolder: 'Admin India',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
  });

  await db.insert(paymentMethods).values({
    userId: adminAmerica.id,
    cardNumber: '4111111111111111',
    cardHolder: 'Admin America',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
  });

  console.log('✅ Payment methods created');
  console.log('🎉 Database seeded successfully!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
