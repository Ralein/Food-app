# Role-Based Access Control (RBAC) Implementation

## Overview

This application implements a comprehensive Role-Based Access Control system with three roles: **Admin**, **Manager**, and **Member**. Additionally, it includes country-based restrictions (India/America) to limit user access to restaurants within their assigned country.

## Role Hierarchy & Permissions

### Admin (Highest Privileges)
- ✅ View restaurants & menu items (country-restricted)
- ✅ Create orders
- ✅ Checkout & pay for orders
- ✅ Cancel orders
- ✅ Add/Modify/Delete payment methods
- ✅ View all orders (not just their own)

### Manager (Medium Privileges)
- ✅ View restaurants & menu items (country-restricted)
- ✅ Create orders
- ✅ Checkout & pay for orders
- ✅ Cancel orders
- ❌ Cannot manage payment methods
- ✅ View all orders (not just their own)

### Member (Basic Privileges)
- ✅ View restaurants & menu items (country-restricted)
- ✅ Create orders
- ❌ Cannot checkout or pay
- ❌ Cannot cancel orders
- ❌ Cannot manage payment methods
- ✅ View only their own orders

## Country-Based Access Control (Re-BAC)

Users are assigned to either **India** or **America** and can only:
- View restaurants in their country
- Order from restaurants in their country
- See menu items from restaurants in their country

This is enforced at the backend level in all restaurant and order queries.

## Backend Implementation

### 1. Authentication Guard (`auth.guard.ts`)
```typescript
@UseGuards(AuthGuard)
```
- Validates JWT token from Authorization header
- Attaches user object to request context
- Used on all protected routes

### 2. Role-Based Guard (`roles.guard.ts`)
```typescript
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
```
- Checks if user has required role
- Works in combination with `@Roles()` decorator
- Throws ForbiddenException if unauthorized

### 3. Service-Level Checks

**Restaurant Service:**
```typescript
async getRestaurants(userCountry: Country) {
  return this.prisma.restaurant.findMany({
    where: { country: userCountry },
  });
}
```

**Order Service:**
```typescript
async cancelOrder(orderId: string, userId: string, userRole: Role) {
  if (userRole === Role.MEMBER) {
    throw new ForbiddenException('Members cannot cancel orders');
  }
  // ... cancel logic
}
```

**Payment Service:**
```typescript
async createPaymentMethod(userId: string, userRole: Role, input) {
  if (userRole !== Role.ADMIN) {
    throw new ForbiddenException('Only admins can add payment methods');
  }
  // ... create logic
}
```

## Frontend Implementation

### 1. Auth Utilities (`lib/auth.ts`)
```typescript
export const canCheckout = (user: User | null): boolean => {
  return user?.role === 'ADMIN' || user?.role === 'MANAGER';
};

export const canCancelOrder = (user: User | null): boolean => {
  return user?.role === 'ADMIN' || user?.role === 'MANAGER';
};

export const canManagePayments = (user: User | null): boolean => {
  return user?.role === 'ADMIN';
};
```

### 2. Conditional UI Rendering

**Orders Page:**
```typescript
{canCheckout(user) && order.status === 'PENDING' && !order.payment && (
  <button onClick={() => router.push(`/checkout/${order.id}`)}>
    Pay Now
  </button>
)}

{canCancelOrder(user) && order.status !== 'CANCELLED' && (
  <button onClick={() => handleCancelOrder(order.id)}>
    Cancel Order
  </button>
)}
```

**Navbar:**
```typescript
{canManagePayments(user) && (
  <Link href="/payments">Payment Methods</Link>
)}
```

### 3. Route Protection
```typescript
useEffect(() => {
  if (!user || !canManagePayments(user)) {
    router.push('/dashboard');
  }
}, [user, router]);
```

## GraphQL Schema Enforcement

### Mutations with Role Guards

**Cancel Order (Admin & Manager only):**
```graphql
@Mutation(() => Order)
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
async cancelOrder(@Args('id') id: string, @Context() context) {
  // ...
}
```

**Process Payment (Admin & Manager only):**
```graphql
@Mutation(() => Payment)
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
async processPayment(@Args('input') input: ProcessPaymentInput) {
  // ...
}
```

**Manage Payment Methods (Admin only):**
```graphql
@Mutation(() => PaymentMethod)
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
async createPaymentMethod(@Args('input') input: CreatePaymentMethodInput) {
  // ...
}
```

## Security Features

1. **JWT Authentication**: All protected routes require valid JWT token
2. **Password Hashing**: Bcrypt with salt rounds for secure password storage
3. **Authorization Checks**: Multiple layers (guards, decorators, service-level)
4. **Country Isolation**: Users cannot access data from other countries
5. **Order Ownership**: Members can only view their own orders
6. **Payment Method Ownership**: Users can only manage their own payment methods

## Testing RBAC

### Test Scenarios

1. **Member tries to cancel order** → Should fail with 403 Forbidden
2. **Member tries to checkout** → Should fail with 403 Forbidden
3. **Manager tries to add payment method** → Should fail with 403 Forbidden
4. **India user tries to access America restaurant** → Should return empty/error
5. **Admin can perform all operations** → Should succeed

### Demo Users

| Email | Password | Role | Country |
|-------|----------|------|---------|
| admin@india.com | password123 | ADMIN | INDIA |
| manager@india.com | password123 | MANAGER | INDIA |
| member@india.com | password123 | MEMBER | INDIA |
| admin@america.com | password123 | ADMIN | AMERICA |
| manager@america.com | password123 | MANAGER | AMERICA |
| member@america.com | password123 | MEMBER | AMERICA |

## Extension: Relationship-Based Access Control (Re-BAC)

The country-based restriction is an implementation of Re-BAC where:
- **Relationship**: User belongs to a Country
- **Access Rule**: User can only access Restaurants in their Country
- **Enforcement**: Backend filters all queries by user's country

This can be extended to support:
- Organization-based access
- Team-based access
- Department-based access
- Multi-tenant architecture

## Best Practices Implemented

1. ✅ Defense in depth (multiple authorization layers)
2. ✅ Principle of least privilege (minimal permissions by default)
3. ✅ Fail securely (deny by default)
4. ✅ Centralized authorization logic
5. ✅ Clear separation of concerns
6. ✅ Type-safe role definitions
7. ✅ Consistent error handling
8. ✅ Audit trail (timestamps on all entities)
