# Real Estate Platform - API Architecture

## Overview

This document outlines the complete API structure, validation strategies, and scalable query patterns for the Real Estate Platform.

---

## 📁 Project Structure

```
src/
├── api/
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Auth, validation, rate limiting
│   ├── routes/              # Route definitions
│   ├── validators/          # Zod validation schemas
│   └── utils/               # Error handling, helpers
├── services/                # Business logic
├── config/                  # Configuration
├── utils/                   # Shared utilities
└── prisma/
    └── schema.prisma        # Database schema
```

---

## 🔐 Authentication & Authorization

### JWT Token Flow
```
1. User logs in → Receives access + refresh tokens
2. Access token expires (7 days) → Use refresh token
3. Refresh token expires (30 days) → Re-authenticate
```

### Role-Based Access Control (RBAC)

| Role      | Capabilities                                           |
|-----------|--------------------------------------------------------|
| ADMIN     | Full system access, approvals, user management         |
| AGENT     | List properties, manage clients, view analytics        |
| LANDLORD  | List own properties, respond to inquiries              |
| TENANT    | Search, save, inquire on properties                    |
| BUYER     | Search, save, inquire on properties                    |

### Middleware Chain
```typescript
// Example protected route
router.patch(
  '/:id',
  authenticate,                    // 1. Verify JWT
  authorize([AGENT, LANDLORD]),    // 2. Check role
  requireOwnership('property'),    // 3. Verify ownership
  validateRequest(updateSchema),   // 4. Validate input
  rateLimiter({ max: 100 }),       // 5. Rate limit
  controller.update                // 6. Handle request
);
```

---

## ✅ Validation Strategy

### Request Validation with Zod

```typescript
// All inputs are validated at the edge
const createPropertySchema = z.object({
  title: z.string().min(10).max(200),
  price: z.number().positive().max(999999999999),
  propertyType: z.nativeEnum(PropertyType),
  // ... more fields with strict validation
});
```

### Validation Layers

1. **Schema Validation** - Zod schemas for type safety
2. **Business Validation** - Service layer checks
3. **Database Constraints** - Prisma enforced rules

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "statusCode": 400,
    "details": [
      { "field": "price", "message": "Must be positive" }
    ]
  }
}
```

---

## 📊 Scalable Query Patterns

### 1. Cursor-Based Pagination

For large datasets, use cursor-based pagination:

```typescript
// Instead of OFFSET which degrades at scale
const properties = await prisma.property.findMany({
  take: limit,
  skip: 1,
  cursor: { id: lastId },
  orderBy: { createdAt: 'desc' },
});
```

### 2. Selective Field Loading

```typescript
// Only load needed fields
select: {
  id: true,
  title: true,
  price: true,
  images: {
    where: { isPrimary: true },
    take: 1,
  },
}
```

### 3. Parallel Query Execution

```typescript
// Run independent queries in parallel
const [total, properties] = await Promise.all([
  prisma.property.count({ where }),
  prisma.property.findMany({ where, take: limit }),
]);
```

### 4. Indexed Queries

```sql
-- Composite indexes for common filters
@@index([status, propertyType, city])
@@index([status, listingType, city, price])
```

### 5. Caching Strategy

```typescript
// Cache frequently accessed data
const cacheKey = `property:${id}`;
const cached = await cache.get(cacheKey);
if (cached) return cached;

const property = await prisma.property.findUnique({ where: { id } });
await cache.set(cacheKey, property, 300); // 5 min TTL
```

### 6. Denormalized Counters

```sql
-- Avoid COUNT queries by maintaining counters
viewCount   Int @default(0)
saveCount   Int @default(0)
inquiryCount Int @default(0)
```

---

## 🚀 API Endpoints Reference

### Authentication
| Method | Endpoint                    | Description           | Auth |
|--------|-----------------------------|-----------------------|------|
| POST   | /auth/register              | Register user         | No   |
| POST   | /auth/login                 | Login                 | No   |
| POST   | /auth/refresh               | Refresh token         | No   |
| POST   | /auth/forgot-password       | Request reset         | No   |

### Properties
| Method | Endpoint                    | Description           | Auth |
|--------|-----------------------------|-----------------------|------|
| GET    | /properties                 | List properties       | Opt  |
| GET    | /properties/:id             | Get property          | Opt  |
| POST   | /properties                 | Create property       | Yes  |
| PATCH  | /properties/:id             | Update property       | Yes  |
| DELETE | /properties/:id             | Delete property       | Yes  |
| POST   | /properties/:id/images      | Upload images         | Yes  |
| POST   | /properties/:id/inquire     | Create inquiry        | Yes  |

### Users
| Method | Endpoint                    | Description           | Auth |
|--------|-----------------------------|-----------------------|------|
| GET    | /users/me                   | Get profile           | Yes  |
| PATCH  | /users/me                   | Update profile        | Yes  |
| GET    | /users/me/saved             | Saved properties      | Yes  |
| GET    | /users/me/notifications     | Notifications         | Yes  |

### Admin
| Method | Endpoint                    | Description           | Auth |
|--------|-----------------------------|-----------------------|------|
| GET    | /admin/dashboard            | Stats                 | Admin|
| GET    | /admin/properties/pending   | Pending approvals     | Admin|
| PATCH  | /admin/properties/:id/approve| Approve property     | Admin|
| PATCH  | /admin/properties/:id/reject | Reject property      | Admin|

---

## 🔒 Security Measures

### 1. Input Sanitization
```typescript
// All inputs sanitized to prevent XSS
const sanitize = (str) => str
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
```

### 2. Rate Limiting
```typescript
// Different limits per endpoint type
auth: { windowMs: 15 * 60 * 1000, max: 10 },
standard: { windowMs: 60 * 1000, max: 100 },
strict: { windowMs: 60 * 60 * 1000, max: 5 },
```

### 3. Soft Deletes
```sql
isDeleted Boolean @default(false)
deletedAt DateTime?
```

### 4. Audit Logging
```typescript
// All significant actions logged
await auditService.log({
  userId,
  action: 'UPDATE',
  entityType: 'Property',
  entityId: id,
  oldValues,
  newValues,
});
```

---

## 📈 Future Scalability

### Database Scaling
- Read replicas for search queries
- Partitioning by date/region
- Consider TimescaleDB for time-series analytics

### Search Enhancement
- Elasticsearch for full-text search
- PostGIS for geospatial queries
- Algolia for instant search

### Caching Layers
- Redis for session/cache
- CDN for images
- Edge caching for API responses

### Microservices Path
- Notification service
- Image processing service
- Analytics service
- Search service

---

## 🛠 Development Setup

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev

# Seed data
npx prisma db seed

# Run development server
npm run dev
```

---

## Environment Variables

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="min-32-char-secret"
REDIS_URL="redis://..."
STRIPE_SECRET_KEY="sk_..."
```
