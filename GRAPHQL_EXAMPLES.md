# GraphQL API Examples

Access the GraphQL Playground at: **http://localhost:3000/graphql**

## Authentication

### Login

```graphql
mutation Login {
  login(email: "admin@india.com", password: "password123") {
    token
    user {
      id
      email
      name
      role
      country
      createdAt
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "uuid-here",
        "email": "admin@india.com",
        "name": "Admin India",
        "role": "ADMIN",
        "country": "INDIA",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }
}
```

### Get Current User

```graphql
query Me {
  me {
    id
    email
    name
    role
    country
  }
}
```

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

## Restaurants

### Get All Restaurants (Country-Filtered)

```graphql
query GetRestaurants {
  restaurants {
    id
    name
    description
    country
    address
    imageUrl
    menuItems {
      id
      name
      price
      category
    }
  }
}
```

**Response (India User):**
```json
{
  "data": {
    "restaurants": [
      {
        "id": "restaurant-1",
        "name": "Spice Garden",
        "description": "Authentic Indian cuisine",
        "country": "INDIA",
        "address": "MG Road, Bangalore, India",
        "imageUrl": "https://...",
        "menuItems": [...]
      },
      {
        "id": "restaurant-2",
        "name": "Curry House",
        "description": "Traditional North Indian food",
        "country": "INDIA",
        "address": "Connaught Place, New Delhi, India",
        "imageUrl": "https://...",
        "menuItems": [...]
      }
    ]
  }
}
```

### Get Single Restaurant

```graphql
query GetRestaurant {
  restaurant(id: "restaurant-id-here") {
    id
    name
    description
    address
    country
    menuItems {
      id
      name
      description
      price
      category
      imageUrl
      isAvailable
    }
  }
}
```

### Get Menu Items

```graphql
query GetMenuItems {
  menuItems(restaurantId: "restaurant-id-here") {
    id
    name
    description
    price
    category
    imageUrl
    isAvailable
  }
}
```

## Orders

### Create Order

```graphql
mutation CreateOrder {
  createOrder(
    input: {
      restaurantId: "restaurant-id-here"
      items: [
        { menuItemId: "menu-item-1", quantity: 2 }
        { menuItemId: "menu-item-2", quantity: 1 }
      ]
    }
  ) {
    id
    totalAmount
    status
    restaurant {
      name
    }
    orderItems {
      quantity
      price
      menuItem {
        name
      }
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "createOrder": {
      "id": "order-id",
      "totalAmount": 750.50,
      "status": "PENDING",
      "restaurant": {
        "name": "Spice Garden"
      },
      "orderItems": [
        {
          "quantity": 2,
          "price": 350,
          "menuItem": {
            "name": "Butter Chicken"
          }
        },
        {
          "quantity": 1,
          "price": 50.50,
          "menuItem": {
            "name": "Naan"
          }
        }
      ]
    }
  }
}
```

### Get All Orders

```graphql
query GetOrders {
  orders {
    id
    totalAmount
    status
    createdAt
    restaurant {
      name
      address
    }
    user {
      name
      email
    }
    orderItems {
      quantity
      price
      menuItem {
        name
        description
      }
    }
    payment {
      id
      amount
    }
  }
}
```

**Note:** 
- Members see only their own orders
- Admins and Managers see all orders

### Get Single Order

```graphql
query GetOrder {
  order(id: "order-id-here") {
    id
    totalAmount
    status
    createdAt
    updatedAt
    restaurant {
      name
      address
    }
    user {
      name
      email
    }
    orderItems {
      quantity
      price
      menuItem {
        name
        price
      }
    }
    payment {
      id
      amount
      paymentMethod {
        cardHolder
        cardNumber
      }
    }
  }
}
```

### Cancel Order (Admin/Manager Only)

```graphql
mutation CancelOrder {
  cancelOrder(id: "order-id-here") {
    id
    status
    totalAmount
  }
}
```

**Error Response (Member):**
```json
{
  "errors": [
    {
      "message": "Insufficient permissions",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

## Payment Methods

### Get Payment Methods (Admin Only)

```graphql
query GetPaymentMethods {
  paymentMethods {
    id
    cardNumber
    cardHolder
    expiryMonth
    expiryYear
    isDefault
    createdAt
  }
}
```

### Create Payment Method (Admin Only)

```graphql
mutation CreatePaymentMethod {
  createPaymentMethod(
    input: {
      cardNumber: "4111111111111111"
      cardHolder: "John Doe"
      expiryMonth: 12
      expiryYear: 2026
      isDefault: true
    }
  ) {
    id
    cardNumber
    cardHolder
    isDefault
  }
}
```

### Update Payment Method (Admin Only)

```graphql
mutation UpdatePaymentMethod {
  updatePaymentMethod(
    id: "payment-method-id"
    input: {
      cardHolder: "Jane Doe"
      isDefault: true
    }
  ) {
    id
    cardHolder
    isDefault
  }
}
```

### Delete Payment Method (Admin Only)

```graphql
mutation DeletePaymentMethod {
  deletePaymentMethod(id: "payment-method-id")
}
```

## Payment Processing

### Process Payment (Admin/Manager Only)

```graphql
mutation ProcessPayment {
  processPayment(
    input: {
      orderId: "order-id-here"
      paymentMethodId: "payment-method-id-here"
    }
  ) {
    id
    amount
    createdAt
    order {
      id
      status
      totalAmount
    }
    paymentMethod {
      cardHolder
      cardNumber
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "processPayment": {
      "id": "payment-id",
      "amount": 750.50,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "order": {
        "id": "order-id",
        "status": "CONFIRMED",
        "totalAmount": 750.50
      },
      "paymentMethod": {
        "cardHolder": "Admin India",
        "cardNumber": "4111111111111111"
      }
    }
  }
}
```

## Complete User Journey Example

### 1. Login as Admin

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

### 2. Browse Restaurants

```graphql
query {
  restaurants {
    id
    name
    menuItems {
      id
      name
      price
    }
  }
}
```

### 3. Create Order

```graphql
mutation {
  createOrder(
    input: {
      restaurantId: "restaurant-id"
      items: [
        { menuItemId: "item-1", quantity: 2 }
      ]
    }
  ) {
    id
    totalAmount
  }
}
```

### 4. Get Payment Methods

```graphql
query {
  paymentMethods {
    id
    cardHolder
    isDefault
  }
}
```

### 5. Process Payment

```graphql
mutation {
  processPayment(
    input: {
      orderId: "order-id"
      paymentMethodId: "payment-method-id"
    }
  ) {
    id
    amount
  }
}
```

### 6. View Orders

```graphql
query {
  orders {
    id
    status
    totalAmount
    payment {
      id
    }
  }
}
```

## Error Handling Examples

### Unauthorized (No Token)

```json
{
  "errors": [
    {
      "message": "No authorization header",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

### Forbidden (Insufficient Permissions)

```json
{
  "errors": [
    {
      "message": "Insufficient permissions",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

### Invalid Input

```json
{
  "errors": [
    {
      "message": "Menu item menu-item-id not found",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```

### Country Restriction

```json
{
  "errors": [
    {
      "message": "Access denied: Restaurant not in your country",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

## Testing Different Roles

### Test as Member (Limited Access)

```graphql
# Login as member
mutation {
  login(email: "member@india.com", password: "password123") {
    token
  }
}

# Can view restaurants ✅
query {
  restaurants { id name }
}

# Can create orders ✅
mutation {
  createOrder(input: { restaurantId: "...", items: [...] }) {
    id
  }
}

# Cannot process payment ❌
mutation {
  processPayment(input: { orderId: "...", paymentMethodId: "..." }) {
    id
  }
}
# Error: Insufficient permissions

# Cannot cancel order ❌
mutation {
  cancelOrder(id: "order-id") {
    id
  }
}
# Error: Insufficient permissions
```

### Test as Manager (Medium Access)

```graphql
# Login as manager
mutation {
  login(email: "manager@india.com", password: "password123") {
    token
  }
}

# Can process payment ✅
mutation {
  processPayment(input: { orderId: "...", paymentMethodId: "..." }) {
    id
  }
}

# Can cancel order ✅
mutation {
  cancelOrder(id: "order-id") {
    id
  }
}

# Cannot manage payment methods ❌
mutation {
  createPaymentMethod(input: { ... }) {
    id
  }
}
# Error: Insufficient permissions
```

### Test as Admin (Full Access)

```graphql
# Login as admin
mutation {
  login(email: "admin@india.com", password: "password123") {
    token
  }
}

# Can do everything ✅
# All mutations and queries work
```

## Introspection Query

Get the full schema:

```graphql
query IntrospectionQuery {
  __schema {
    types {
      name
      kind
      description
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
}
```

## Tips for Testing

1. **Always include Authorization header** for protected queries
2. **Use variables** for dynamic values instead of hardcoding
3. **Test error cases** to verify authorization works
4. **Check country restrictions** by logging in as users from different countries
5. **Verify role permissions** by attempting restricted operations
6. **Use GraphQL Playground** for interactive testing with auto-completion

## Variables Example

Instead of:
```graphql
mutation {
  createOrder(input: { restaurantId: "abc123", items: [...] }) {
    id
  }
}
```

Use variables:
```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
  }
}
```

Variables:
```json
{
  "input": {
    "restaurantId": "abc123",
    "items": [
      { "menuItemId": "item1", "quantity": 2 }
    ]
  }
}
```

This makes queries reusable and easier to test!
