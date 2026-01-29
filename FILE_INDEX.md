# Project File Index

Complete list of all files in the Food Ordering Application project.

## 📚 Documentation Files (Root)

| File | Description |
|------|-------------|
| `README.md` | Main project overview and setup instructions |
| `QUICKSTART.md` | Step-by-step quick start guide |
| `RBAC_IMPLEMENTATION.md` | Detailed RBAC documentation |
| `FEATURES.md` | Complete feature checklist |
| `PROJECT_SUMMARY.md` | High-level project summary |
| `ARCHITECTURE.md` | System architecture diagrams |
| `GRAPHQL_EXAMPLES.md` | GraphQL query examples |
| `FILE_INDEX.md` | This file - complete file listing |

## 🔧 Configuration Files (Root)

| File | Description |
|------|-------------|
| `.gitignore` | Git ignore patterns |
| `setup.sh` | Automated setup script |

## 🔙 Backend Files

### Configuration
| File | Description |
|------|-------------|
| `backend/package.json` | NPM dependencies and scripts |
| `backend/tsconfig.json` | TypeScript configuration |
| `backend/nest-cli.json` | NestJS CLI configuration |
| `backend/.env` | Environment variables |

### Database (Prisma)
| File | Description |
|------|-------------|
| `backend/prisma/schema.prisma` | Database schema (7 models) |
| `backend/prisma/seed.ts` | Database seeding script |

### Core Application
| File | Description |
|------|-------------|
| `backend/src/main.ts` | Application entry point |
| `backend/src/app.module.ts` | Root module |
| `backend/src/prisma/prisma.service.ts` | Prisma database service |

### Authentication Module
| File | Description |
|------|-------------|
| `backend/src/auth/auth.module.ts` | Auth module definition |
| `backend/src/auth/auth.resolver.ts` | GraphQL auth resolver |
| `backend/src/auth/auth.service.ts` | Auth business logic |
| `backend/src/auth/auth.types.ts` | Auth GraphQL types |
| `backend/src/auth/auth.guard.ts` | JWT authentication guard |
| `backend/src/auth/roles.guard.ts` | Role-based authorization guard |
| `backend/src/auth/roles.decorator.ts` | Roles decorator |

### Restaurant Module
| File | Description |
|------|-------------|
| `backend/src/restaurant/restaurant.module.ts` | Restaurant module definition |
| `backend/src/restaurant/restaurant.resolver.ts` | GraphQL restaurant resolver |
| `backend/src/restaurant/restaurant.service.ts` | Restaurant business logic |
| `backend/src/restaurant/restaurant.types.ts` | Restaurant GraphQL types |

### Order Module
| File | Description |
|------|-------------|
| `backend/src/order/order.module.ts` | Order module definition |
| `backend/src/order/order.resolver.ts` | GraphQL order resolver |
| `backend/src/order/order.service.ts` | Order business logic |
| `backend/src/order/order.types.ts` | Order GraphQL types |

### Payment Module
| File | Description |
|------|-------------|
| `backend/src/payment/payment.module.ts` | Payment module definition |
| `backend/src/payment/payment.resolver.ts` | GraphQL payment resolver |
| `backend/src/payment/payment.service.ts` | Payment business logic |
| `backend/src/payment/payment.types.ts` | Payment GraphQL types |

## 🎨 Frontend Files

### Configuration
| File | Description |
|------|-------------|
| `frontend/package.json` | NPM dependencies and scripts |
| `frontend/tsconfig.json` | TypeScript configuration |
| `frontend/next.config.js` | Next.js configuration |
| `frontend/tailwind.config.ts` | Tailwind CSS configuration |
| `frontend/postcss.config.js` | PostCSS configuration |

### Application Root
| File | Description |
|------|-------------|
| `frontend/src/app/layout.tsx` | Root layout component |
| `frontend/src/app/page.tsx` | Home page (redirects) |
| `frontend/src/app/globals.css` | Global styles |

### Pages
| File | Description |
|------|-------------|
| `frontend/src/app/login/page.tsx` | Login page |
| `frontend/src/app/dashboard/page.tsx` | Restaurant listing page |
| `frontend/src/app/restaurant/[id]/page.tsx` | Restaurant detail & cart |
| `frontend/src/app/orders/page.tsx` | Order history page |
| `frontend/src/app/checkout/[orderId]/page.tsx` | Checkout page |
| `frontend/src/app/payments/page.tsx` | Payment methods page |

### Components
| File | Description |
|------|-------------|
| `frontend/src/components/ApolloWrapper.tsx` | Apollo Client provider |
| `frontend/src/components/Navbar.tsx` | Navigation bar component |
| `frontend/src/components/RestaurantCard.tsx` | Restaurant card component |

### Utilities
| File | Description |
|------|-------------|
| `frontend/src/lib/apollo-client.ts` | Apollo Client configuration |
| `frontend/src/lib/auth.ts` | Auth utilities & helpers |

## 📊 File Statistics

### Backend
- **Total Files**: 24
- **Modules**: 4 (Auth, Restaurant, Order, Payment)
- **Resolvers**: 4
- **Services**: 5
- **Guards**: 2
- **Types**: 4

### Frontend
- **Total Files**: 17
- **Pages**: 6
- **Components**: 3
- **Utilities**: 2
- **Config Files**: 5

### Documentation
- **Total Files**: 8
- **Setup Guides**: 2
- **Technical Docs**: 4
- **Reference Docs**: 2

### Total Project
- **All Files**: 49+
- **Lines of Code**: ~2000+
- **Languages**: TypeScript, GraphQL, CSS

## 🗂️ Directory Structure

```
food-ordering-app/
├── 📄 Documentation (8 files)
│   ├── README.md
│   ├── QUICKSTART.md
│   ├── RBAC_IMPLEMENTATION.md
│   ├── FEATURES.md
│   ├── PROJECT_SUMMARY.md
│   ├── ARCHITECTURE.md
│   ├── GRAPHQL_EXAMPLES.md
│   └── FILE_INDEX.md
│
├── 🔧 Configuration (2 files)
│   ├── .gitignore
│   └── setup.sh
│
├── 🔙 backend/ (24 files)
│   ├── 📦 Configuration (4 files)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── nest-cli.json
│   │   └── .env
│   │
│   ├── 🗄️ prisma/ (2 files)
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   └── 📁 src/ (18 files)
│       ├── main.ts
│       ├── app.module.ts
│       │
│       ├── 🔐 auth/ (7 files)
│       │   ├── auth.module.ts
│       │   ├── auth.resolver.ts
│       │   ├── auth.service.ts
│       │   ├── auth.types.ts
│       │   ├── auth.guard.ts
│       │   ├── roles.guard.ts
│       │   └── roles.decorator.ts
│       │
│       ├── 🍽️ restaurant/ (4 files)
│       │   ├── restaurant.module.ts
│       │   ├── restaurant.resolver.ts
│       │   ├── restaurant.service.ts
│       │   └── restaurant.types.ts
│       │
│       ├── 📦 order/ (4 files)
│       │   ├── order.module.ts
│       │   ├── order.resolver.ts
│       │   ├── order.service.ts
│       │   └── order.types.ts
│       │
│       ├── 💳 payment/ (4 files)
│       │   ├── payment.module.ts
│       │   ├── payment.resolver.ts
│       │   ├── payment.service.ts
│       │   └── payment.types.ts
│       │
│       └── 🗄️ prisma/ (1 file)
│           └── prisma.service.ts
│
└── 🎨 frontend/ (17 files)
    ├── 📦 Configuration (5 files)
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── next.config.js
    │   ├── tailwind.config.ts
    │   └── postcss.config.js
    │
    └── 📁 src/ (12 files)
        ├── 📱 app/ (8 files)
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── globals.css
        │   ├── login/page.tsx
        │   ├── dashboard/page.tsx
        │   ├── restaurant/[id]/page.tsx
        │   ├── orders/page.tsx
        │   ├── checkout/[orderId]/page.tsx
        │   └── payments/page.tsx
        │
        ├── 🧩 components/ (3 files)
        │   ├── ApolloWrapper.tsx
        │   ├── Navbar.tsx
        │   └── RestaurantCard.tsx
        │
        └── 🔧 lib/ (2 files)
            ├── apollo-client.ts
            └── auth.ts
```

## 🔍 File Purpose Quick Reference

### Need to modify authentication?
→ `backend/src/auth/`

### Need to change database schema?
→ `backend/prisma/schema.prisma`

### Need to add demo data?
→ `backend/prisma/seed.ts`

### Need to modify UI components?
→ `frontend/src/components/`

### Need to add new pages?
→ `frontend/src/app/`

### Need to change GraphQL queries?
→ `frontend/src/app/*/page.tsx`

### Need to modify business logic?
→ `backend/src/*/service.ts`

### Need to change permissions?
→ `backend/src/auth/roles.guard.ts`

### Need to update styling?
→ `frontend/src/app/globals.css` or Tailwind classes

### Need to configure environment?
→ `backend/.env`

## 📝 Key Files to Review

### For Understanding RBAC:
1. `RBAC_IMPLEMENTATION.md` - Complete RBAC documentation
2. `backend/src/auth/roles.guard.ts` - Role checking logic
3. `backend/src/auth/auth.guard.ts` - Authentication logic
4. `frontend/src/lib/auth.ts` - Frontend auth utilities

### For Understanding Data Flow:
1. `ARCHITECTURE.md` - System architecture
2. `backend/prisma/schema.prisma` - Data models
3. `backend/src/*/resolver.ts` - GraphQL endpoints
4. `frontend/src/lib/apollo-client.ts` - API client

### For Getting Started:
1. `README.md` - Project overview
2. `QUICKSTART.md` - Setup instructions
3. `setup.sh` - Automated setup
4. `GRAPHQL_EXAMPLES.md` - API examples

### For Feature Reference:
1. `FEATURES.md` - Complete feature list
2. `PROJECT_SUMMARY.md` - High-level summary
3. `FILE_INDEX.md` - This file

## 🎯 File Naming Conventions

### Backend
- **Modules**: `*.module.ts`
- **Resolvers**: `*.resolver.ts`
- **Services**: `*.service.ts`
- **Types**: `*.types.ts`
- **Guards**: `*.guard.ts`
- **Decorators**: `*.decorator.ts`

### Frontend
- **Pages**: `page.tsx`
- **Layouts**: `layout.tsx`
- **Components**: `ComponentName.tsx`
- **Utilities**: `utility-name.ts`
- **Styles**: `globals.css`

## 🔄 Generated Files (Not in Repo)

These files are generated during setup and not tracked in git:

### Backend
- `backend/node_modules/` - NPM dependencies
- `backend/dist/` - Compiled JavaScript
- `backend/prisma/dev.db` - SQLite database
- `backend/prisma/dev.db-journal` - SQLite journal

### Frontend
- `frontend/node_modules/` - NPM dependencies
- `frontend/.next/` - Next.js build output
- `frontend/out/` - Static export (if used)

## 📦 Package Dependencies

### Backend Key Packages
- `@nestjs/core` - NestJS framework
- `@nestjs/graphql` - GraphQL integration
- `@prisma/client` - Database ORM
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT tokens

### Frontend Key Packages
- `next` - Next.js framework
- `react` - React library
- `@apollo/client` - GraphQL client
- `tailwindcss` - CSS framework
- `typescript` - Type safety

## 🎓 Learning Path

To understand the codebase, review files in this order:

1. **Start Here**
   - `README.md`
   - `QUICKSTART.md`

2. **Understand Architecture**
   - `ARCHITECTURE.md`
   - `backend/prisma/schema.prisma`

3. **Learn RBAC**
   - `RBAC_IMPLEMENTATION.md`
   - `backend/src/auth/`

4. **Explore Backend**
   - `backend/src/main.ts`
   - `backend/src/app.module.ts`
   - `backend/src/*/resolver.ts`

5. **Explore Frontend**
   - `frontend/src/app/layout.tsx`
   - `frontend/src/app/login/page.tsx`
   - `frontend/src/app/dashboard/page.tsx`

6. **Test API**
   - `GRAPHQL_EXAMPLES.md`
   - GraphQL Playground

This file index provides a complete reference to navigate the entire project structure efficiently!
