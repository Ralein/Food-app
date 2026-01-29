# Quick Start Guide

## Prerequisites

- Node.js 18+ and npm installed
- Terminal/Command line access

## Installation & Setup

### Option 1: Automated Setup (Recommended)

```bash
# Make setup script executable (Mac/Linux)
chmod +x setup.sh

# Run setup script
./setup.sh
```

### Option 2: Manual Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed database with demo data
npx prisma db seed

# Start backend server
npm run start:dev
```

Backend will run on **http://localhost:3000/graphql**

#### Frontend Setup (Open new terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on **http://localhost:3001**

## Access the Application

1. Open browser and go to **http://localhost:3001**
2. You'll be redirected to the login page
3. Use one of the demo accounts below

## Demo Accounts

### India Users

**Admin (Full Access)**
- Email: `admin@india.com`
- Password: `password123`
- Can: View, Order, Checkout, Cancel, Manage Payments

**Manager (Most Access)**
- Email: `manager@india.com`
- Password: `password123`
- Can: View, Order, Checkout, Cancel
- Cannot: Manage Payments

**Member (Limited Access)**
- Email: `member@india.com`
- Password: `password123`
- Can: View, Order
- Cannot: Checkout, Cancel, Manage Payments

### America Users

**Admin**
- Email: `admin@america.com`
- Password: `password123`

**Manager**
- Email: `manager@america.com`
- Password: `password123`

**Member**
- Email: `member@america.com`
- Password: `password123`

## Testing the Application

### Test Role-Based Access

1. **Login as Member** (`member@india.com`)
   - Browse restaurants (only India restaurants visible)
   - Add items to cart and create order
   - Go to Orders page
   - Notice: No "Pay Now" or "Cancel" buttons (restricted)

2. **Login as Manager** (`manager@india.com`)
   - Create an order
   - Go to Orders page
   - Click "Pay Now" to checkout (allowed)
   - Click "Cancel Order" (allowed)
   - Try to access Payment Methods page (should redirect - not allowed)

3. **Login as Admin** (`admin@india.com`)
   - Full access to all features
   - Can manage payment methods
   - Can checkout and cancel orders

### Test Country-Based Access

1. **Login as India user** (`admin@india.com`)
   - See only Indian restaurants (Spice Garden, Curry House)
   - Prices in Rupees (₹)

2. **Login as America user** (`admin@america.com`)
   - See only American restaurants (Burger Palace, Pizza Corner)
   - Prices in Dollars ($)

## GraphQL Playground

Access the GraphQL playground at **http://localhost:3000/graphql**

### Example Queries

**Login:**
```graphql
mutation {
  login(email: "admin@india.com", password: "password123") {
    token
    user {
      id
      name
      role
      country
    }
  }
}
```

**Get Restaurants (requires auth token):**
```graphql
query {
  restaurants {
    id
    name
    description
    country
  }
}
```

Add token to HTTP Headers:
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Demo data
│   └── src/
│       ├── auth/              # Authentication & authorization
│       ├── restaurant/        # Restaurant & menu logic
│       ├── order/             # Order management
│       └── payment/           # Payment methods
│
└── frontend/
    └── src/
        ├── app/               # Next.js pages
        ├── components/        # React components
        └── lib/               # Utilities (auth, apollo)
```

## Common Issues

### Port Already in Use

If port 3000 or 3001 is already in use:

**Backend:**
Edit `backend/src/main.ts` and change port:
```typescript
await app.listen(3002); // Change to any available port
```

**Frontend:**
Edit `frontend/package.json`:
```json
"dev": "next dev -p 3002"
```

### Database Issues

Reset database:
```bash
cd backend
rm prisma/dev.db
npx prisma db push
npx prisma db seed
```

### Module Not Found

Reinstall dependencies:
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read `RBAC_IMPLEMENTATION.md` for detailed RBAC documentation
- Explore the GraphQL schema at http://localhost:3000/graphql
- Modify `prisma/seed.ts` to add more restaurants/menu items
- Customize the UI in `frontend/src/app` and `frontend/src/components`

## Production Deployment

Before deploying to production:

1. Change JWT secret in `backend/src/auth/auth.service.ts`
2. Use PostgreSQL/MySQL instead of SQLite
3. Add environment variables for sensitive data
4. Enable HTTPS
5. Add rate limiting
6. Implement proper logging
7. Add input validation
8. Set up CI/CD pipeline

## Support

For issues or questions:
- Check `README.md` for overview
- Review `RBAC_IMPLEMENTATION.md` for RBAC details
- Inspect GraphQL schema in playground
