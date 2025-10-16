# Stripe Integration Setup Guide

## Overview
This guide provides comprehensive instructions for setting up and testing Stripe payments in the Cleaning Management Platform.

## Environment Variables Setup

### Required Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration (Test Keys)
STRIPE_PUBLISHABLE_KEY=pk_test_51QCt5dKKVmhAHfA0SnPDrPsUqbQHfeLXKJPvWG6T3wdGOPj4x1JyqCKRwxM3AYp0LceBK2QDCj5y1M0ZFcPJHzKA00uN8DU3Rj
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51QCt5dKKVmhAHfA0SnPDrPsUqbQHfeLXKJPvWG6T3wdGOPj4x1JyqCKRwxM3AYp0LceBK2QDCj5y1M0ZFcPJHzKA00uN8DU3Rj
STRIPE_SECRET_KEY=sk_test_51QCt5dKKVmhAHfA0vCdOFo6LsS8a4jx1NfAZWqPGbMkCvHdR6JJcJ6LqZ5tUoBOT3ykKdJxXsNcBqJf8M1VJqJqJ00xCJcM1VJ
STRIPE_WEBHOOK_SECRET=whsec_test_local_development_webhook_secret
```

### Production Environment Variables

For production, replace test keys with live keys:

```bash
# Stripe Configuration (Live Keys - PRODUCTION ONLY)
STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

⚠️ **Warning**: Never commit live keys to version control. Use environment variable management services like Vercel Environment Variables or AWS Parameter Store.

## Webhook Setup

### 1. Webhook Endpoint
The webhook endpoint is configured at: `/api/finance/webhooks`

**Full URL**: `https://yourdomain.com/api/finance/webhooks`

### 2. Supported Events
The webhook handles the following Stripe events:

- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### 3. Webhook Features

#### Security Features
- ✅ **Signature Verification**: Validates webhook authenticity using Stripe signatures
- ✅ **Idempotency**: Prevents duplicate event processing using `WebhookEvent` table
- ✅ **Error Handling**: Comprehensive error logging and response handling
- ✅ **Raw Body Handling**: Properly handles raw request body for signature verification

#### Database Integration
- ✅ **Payment Tracking**: Automatically creates/updates payment records
- ✅ **Subscription Management**: Tracks subscription lifecycle events
- ✅ **Event Logging**: Stores all webhook events to prevent duplicates

## Database Schema

### Payment Model
```prisma
model Payment {
  id                     String   @id @default(cuid())
  stripePaymentIntentId  String?  @unique
  stripeInvoiceId        String?  @unique
  stripeCustomerId       String?
  amount                 Int      // in cents
  currency               String   @default("usd")
  status                 PaymentStatus @default(PENDING)
  paidAt                 DateTime?
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
}
```

### Subscription Model
```prisma
model Subscription {
  id                     String   @id @default(cuid())
  stripeSubscriptionId   String   @unique
  stripeCustomerId       String
  status                 SubscriptionStatus @default(ACTIVE)
  currentPeriodStart     DateTime
  currentPeriodEnd       DateTime
  canceledAt             DateTime?
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
}
```

### Webhook Event Model (Idempotency)
```prisma
model WebhookEvent {
  id            String   @id @default(cuid())
  stripeEventId String   @unique
  type          String
  processed     Boolean  @default(false)
  createdAt     DateTime @default(now())
}
```

## API Integration Examples

### Creating a Payment Intent
```typescript
import { createPaymentIntent } from '@/lib/stripe';

// Create payment intent with automatic idempotency
const paymentIntent = await createPaymentIntent(
  2000, // $20.00 in cents
  'usd',
  { 
    customerId: 'cus_123',
    propertyId: 'prop_456'
  }
);
```

### Creating a Subscription
```typescript
import { createSubscription } from '@/lib/stripe';

// Create subscription with automatic idempotency
const subscription = await createSubscription(
  'cus_123', // Customer ID
  'price_1234', // Price ID
  {
    propertyId: 'prop_456',
    planType: 'premium'
  }
);
```

## Error Handling

### Webhook Error Responses
The webhook endpoint returns structured error responses:

```json
{
  "success": false,
  "error": "Webhook signature verification failed",
  "code": 400,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

### Success Responses
```json
{
  "success": true,
  "data": {
    "received": true,
    "eventType": "payment_intent.succeeded",
    "eventId": "evt_1234567890"
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

## Monitoring and Debugging

### 1. Webhook Event Logs
Check the database for webhook event processing:

```sql
SELECT * FROM webhook_events 
WHERE processed = false 
ORDER BY created_at DESC;
```

### 2. Payment Status Tracking
Monitor payment processing:

```sql
SELECT * FROM payments 
WHERE status = 'PENDING' 
ORDER BY created_at DESC;
```

### 3. Application Logs
Check server logs for webhook processing:

```bash
# Development
npm run dev

# Production
pm2 logs your-app-name
```

## Testing Locally

See `STRIPE_LOCAL_TESTING.md` for comprehensive local testing procedures using Stripe CLI.

## Production Deployment Checklist

### 1. Environment Variables
- [ ] Replace test keys with live Stripe keys
- [ ] Configure `STRIPE_WEBHOOK_SECRET` with live webhook secret
- [ ] Verify all environment variables are set

### 2. Webhook Configuration
- [ ] Create webhook endpoint in Stripe Dashboard
- [ ] Configure webhook URL: `https://yourdomain.com/api/finance/webhooks`
- [ ] Select required events (see supported events above)
- [ ] Test webhook delivery

### 3. Database Migration
- [ ] Run Prisma migrations in production
- [ ] Verify Payment, Subscription, and WebhookEvent tables exist
- [ ] Test database connectivity

### 4. Security Verification
- [ ] Verify webhook signature verification is working
- [ ] Test idempotency with duplicate events
- [ ] Confirm error handling and logging

### 5. Monitoring Setup
- [ ] Set up webhook event monitoring
- [ ] Configure payment failure alerts
- [ ] Set up subscription status tracking

## Troubleshooting

### Common Issues

#### 1. Webhook Signature Verification Failed
**Symptoms**: 400 errors with "Webhook signature verification failed"

**Solutions**:
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Ensure raw body is being passed to verification function
- Check Stripe CLI forwarding if testing locally

#### 2. Duplicate Event Processing
**Symptoms**: Multiple database entries for same event

**Solutions**:
- Verify `WebhookEvent` table exists and is accessible
- Check idempotency logic in webhook handler
- Ensure database transactions are working properly

#### 3. Payment Status Not Updating
**Symptoms**: Payments stuck in PENDING status

**Solutions**:
- Check webhook event delivery in Stripe Dashboard
- Verify webhook endpoint is accessible from internet
- Review application logs for processing errors

#### 4. Environment Variable Issues
**Symptoms**: "STRIPE_WEBHOOK_SECRET is not configured" errors

**Solutions**:
- Verify all environment variables are set correctly
- Restart application after environment changes
- Check environment variable loading order

## Support and Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe CLI**: https://stripe.com/docs/stripe-cli
- **Webhook Testing**: https://stripe.com/docs/webhooks/test
- **API Reference**: https://stripe.com/docs/api

## Security Best Practices

1. **Never log sensitive data** (payment details, customer info)
2. **Always verify webhook signatures** before processing
3. **Use idempotency keys** for all Stripe operations
4. **Implement proper error handling** and monitoring
5. **Rotate webhook secrets** periodically
6. **Use HTTPS** for all webhook endpoints
7. **Validate all input data** before database operations

---

For local testing procedures, see: [STRIPE_LOCAL_TESTING.md](./STRIPE_LOCAL_TESTING.md)