# Role-Based Food Ordering Application

A full-stack food ordering web application with role-based access control (RBAC) and country-based restrictions.

## Features

- **Role-Based Access Control**: Admin, Manager, and Member roles with specific permissions
- **Country-Based Restrictions**: Users can only access restaurants in their assigned country (India/America)
- **Restaurant & Menu Management**: Browse restaurants and menu items
- **Order Management**: Create, view, and cancel orders based on role
- **Payment Methods**: Manage payment methods (Admin only)

## Tech Stack

### Backend
- NestJS
- GraphQL (Apollo Server)
- Prisma ORM
- SQLite (for development)

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Apollo Client

## Project Structure

```
├── backend/          # NestJS GraphQL API
└── frontend/         # Next.js application
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd food-ordering-app
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Set up the database
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. Start the backend server
```bash
npm run start:dev
```

Backend will run on http://localhost:3000/graphql

5. Install frontend dependencies (in a new terminal)
```bash
cd frontend
npm install
```

6. Start the frontend development server
```bash
npm run dev
```

Frontend will run on http://localhost:3001

## Default Users

After seeding, you can login with:

**Admin (India)**
- Email: admin@india.com
- Password: password123

**Manager (India)**
- Email: manager@india.com
- Password: password123

**Member (India)**
- Email: member@india.com
- Password: password123

**Admin (America)**
- Email: admin@america.com
- Password: password123

**Manager (America)**
- Email: manager@america.com
- Password: password123

**Member (America)**
- Email: member@america.com
- Password: password123

## GraphQL Playground

Access the GraphQL playground at http://localhost:3000/graphql

## Role Permissions

| Feature | Admin | Manager | Member |
|---------|-------|---------|--------|
| View restaurants & menu items | ✅ | ✅ | ✅ |
| Create an order | ✅ | ✅ | ✅ |
| Checkout & pay | ✅ | ✅ | ❌ |
| Cancel an order | ✅ | ✅ | ❌ |
| Add/Modify payment methods | ✅ | ❌ | ❌ |

## Country-Based Access

Users can only view and order from restaurants in their assigned country.
# Food-app
