# Stripe Local Testing Guide

This guide provides step-by-step instructions for testing Stripe integration locally using the Stripe CLI.

## Prerequisites

1. **Stripe CLI installed**: https://stripe.com/docs/stripe-cli
2. **Development server running**: `npm run dev`
3. **Stripe account access**: Test or live account access
4. **Environment variables configured**: See `STRIPE_SETUP_GUIDE.md`

## Installation and Setup

### 1. Install Stripe CLI

#### Windows (PowerShell)
```powershell
# Using Chocolatey
choco install stripe-cli

# Or download from: https://github.com/stripe/stripe-cli/releases
```

#### macOS
```bash
# Using Homebrew
brew install stripe/stripe-cli/stripe
```

#### Linux
```bash
# Using package managers or download binary
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_x86_64.tar.gz
```

### 2. Login to Stripe CLI
```bash
stripe login
```

This will open your browser to authenticate with your Stripe account.

## Local Webhook Testing

### 1. Start Webhook Forwarding

Open a new terminal and run:

```bash
stripe listen --forward-to localhost:3000/api/finance/webhooks
```

**Expected Output**:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef...
> You can now listen for webhooks at the local endpoint: localhost:3000/api/finance/webhooks
```

### 2. Update Environment Variables

Copy the webhook signing secret from the CLI output and update your `.env.local`:

```bash
# Replace with the secret from stripe listen command
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
```

### 3. Restart Development Server

After updating the webhook secret:

```bash
# Stop current dev server (Ctrl+C)
# Then restart:
npm run dev
```

## Testing Payment Events

### 1. Test Payment Intent Success

In a new terminal:

```bash
stripe trigger payment_intent.succeeded
```

**Expected Webhook Output**:
```
2024-01-20 10:30:15   --> payment_intent.succeeded [evt_test_webhook]
2024-01-20 10:30:15  <--  [200] POST http://localhost:3000/api/finance/webhooks [evt_test_webhook]
```

**Expected Application Logs**:
```
Payment intent succeeded: pi_test_1234567890
Webhook event evt_test_webhook processed successfully
```

### 2. Test Payment Intent Failure

```bash
stripe trigger payment_intent.payment_failed
```

### 3. Test Invoice Payment Success

```bash
stripe trigger invoice.payment_succeeded
```

### 4. Test Subscription Events

```bash
# Subscription created
stripe trigger customer.subscription.created

# Subscription updated
stripe trigger customer.subscription.updated

# Subscription canceled
stripe trigger customer.subscription.deleted
```

## Custom Event Testing

### 1. Create Test Payment Intent

```bash
stripe payment_intents create \
  --amount=2000 \
  --currency=usd \
  --automatic-payment-methods[enabled]=true \
  --metadata[test]="local_testing"
```

### 2. Create Test Customer and Subscription

```bash
# Create customer
stripe customers create \
  --email="test@example.com" \
  --name="Test Customer"

# Create subscription (replace customer and price IDs)
stripe subscriptions create \
  --customer=cus_test_customer_id \
  --items[0][price]=price_test_price_id
```

### 3. Simulate Real Payment Flow

```bash
# Create payment intent
PAYMENT_INTENT=$(stripe payment_intents create \
  --amount=2000 \
  --currency=usd \
  --automatic-payment-methods[enabled]=true \
  --confirm=true \
  --payment-method=pm_card_visa \
  --return-url="http://localhost:3000" \
  --format=json)

echo $PAYMENT_INTENT
```

## Database Verification

### 1. Check Webhook Events Table

```sql
-- Check if events are being recorded
SELECT * FROM webhook_events 
ORDER BY created_at DESC 
LIMIT 10;
```

### 2. Check Payment Records

```sql
-- Verify payments are being created/updated
SELECT 
  id,
  stripe_payment_intent_id,
  amount,
  status,
  paid_at,
  created_at
FROM payments 
ORDER BY created_at DESC 
LIMIT 10;
```

### 3. Check Subscription Records

```sql
-- Verify subscription tracking
SELECT 
  id,
  stripe_subscription_id,
  status,
  current_period_start,
  current_period_end
FROM subscriptions 
ORDER BY created_at DESC 
LIMIT 10;
```

## Verification Checklist

### ✅ Webhook Endpoint Health

1. **Webhook forwarding active**: Stripe CLI showing forwarding messages
2. **Environment variables set**: `STRIPE_WEBHOOK_SECRET` updated
3. **Server responding**: 200 responses in Stripe CLI output
4. **Events being processed**: Database records created

### ✅ Payment Processing

1. **Payment intents**: Success and failure events processed
2. **Invoice payments**: Invoice payment events handled
3. **Database updates**: Payment records created with correct status
4. **Idempotency**: Duplicate events not creating multiple records

### ✅ Subscription Management

1. **Subscription creation**: New subscriptions recorded
2. **Subscription updates**: Status changes reflected
3. **Subscription cancellation**: Cancel events processed correctly
4. **Period tracking**: Current period dates updated

## Troubleshooting

### Issue: Webhook Not Receiving Events

**Symptoms**:
- Stripe CLI shows forwarding but no logs in application
- 404 or 500 errors in Stripe CLI output

**Solutions**:
1. Verify development server is running on `localhost:3000`
2. Check webhook endpoint path: `/api/finance/webhooks`
3. Ensure no firewall blocking local connections
4. Restart both Stripe CLI and development server

### Issue: Signature Verification Failed

**Symptoms**:
- 400 errors with "Webhook signature verification failed"
- Events not being processed

**Solutions**:
1. Copy the correct webhook secret from `stripe listen` output
2. Update `.env.local` with new `STRIPE_WEBHOOK_SECRET`
3. Restart development server after environment change
4. Verify no extra spaces or characters in environment variable

### Issue: Database Connection Errors

**Symptoms**:
- Webhook receives events but database not updated
- Prisma connection errors in logs

**Solutions**:
1. Verify database is running and accessible
2. Check `DATABASE_URL` in environment variables
3. Run `npx prisma db push` to ensure schema is synced
4. Test database connection: `npx prisma studio`

### Issue: Duplicate Event Processing

**Symptoms**:
- Multiple database records for same event
- Idempotency not working

**Solutions**:
1. Verify `WebhookEvent` table exists in database
2. Check for database transaction errors
3. Ensure webhook secret is consistent between restarts
4. Review application logs for processing errors

## Testing Scenarios

### Scenario 1: Complete Payment Flow

1. Start webhook forwarding
2. Trigger payment intent creation
3. Trigger payment success
4. Verify database records
5. Trigger payment failure
6. Verify status update

### Scenario 2: Subscription Lifecycle

1. Trigger subscription creation
2. Verify subscription record in database
3. Trigger subscription update
4. Verify status change
5. Trigger subscription cancellation
6. Verify cancellation timestamp

### Scenario 3: Error Handling

1. Stop development server
2. Trigger events (should show errors in Stripe CLI)
3. Restart server
4. Verify events are not duplicated
5. Check error logging

## Performance Testing

### Load Testing with Multiple Events

```bash
# Trigger multiple events rapidly
for i in {1..10}; do
  stripe trigger payment_intent.succeeded &
done
wait

# Check for race conditions or duplicate processing
```

### Memory and CPU Monitoring

```bash
# Monitor application performance
top -p $(pgrep -f "npm run dev")

# Check memory usage
ps aux | grep node
```

## Advanced Testing

### Custom Event Data

Create events with specific metadata:

```bash
stripe events create \
  --type=payment_intent.succeeded \
  --data-object='{
    "id": "pi_test_custom",
    "amount": 5000,
    "currency": "usd",
    "status": "succeeded",
    "metadata": {
      "property_id": "prop_123",
      "customer_type": "premium"
    }
  }'
```

### Webhook Retry Testing

```bash
# Stop webhook endpoint temporarily
# Let Stripe CLI accumulate events
# Restart endpoint and verify retry handling
```

## Clean Up

### Stop Testing

1. **Stop Stripe CLI**: `Ctrl+C` in the forwarding terminal
2. **Stop Development Server**: `Ctrl+C` in the dev server terminal
3. **Clean Test Data**: Remove test records from database if needed

### Reset Environment

```bash
# Reset to original webhook secret for production
STRIPE_WEBHOOK_SECRET=whsec_test_local_development_webhook_secret
```

## Next Steps

After successful local testing:

1. **Deploy to staging environment**
2. **Test with staging webhook endpoint**
3. **Configure production webhooks**
4. **Set up monitoring and alerting**
5. **Document production deployment process**

---

For production setup, see: [STRIPE_SETUP_GUIDE.md](./STRIPE_SETUP_GUIDE.md)