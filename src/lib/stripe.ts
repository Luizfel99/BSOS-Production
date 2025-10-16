import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

// Client-side Stripe promise
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Stripe webhook signature verification with proper error handling
export const verifyWebhookSignature = (payload: string, signature: string): Stripe.Event => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err.message);
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }
};

// Generate idempotency key for Stripe operations
export const generateIdempotencyKey = (prefix: string = 'clean'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}_${timestamp}_${random}`;
};

// Create payment intent with idempotency
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> => {
  const idempotencyKey = generateIdempotencyKey('pi');
  
  return stripe.paymentIntents.create(
    {
      amount,
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    },
    { idempotencyKey }
  );
};

// Create subscription with idempotency
export const createSubscription = async (
  customerId: string,
  priceId: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.Subscription> => {
  const idempotencyKey = generateIdempotencyKey('sub');
  
  return stripe.subscriptions.create(
    {
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
    },
    { idempotencyKey }
  );
};

// Format currency for display
export const formatCurrency = (amount: number, currency: string = 'usd'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

// Format date for display
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Stripe payment status colors
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'succeeded':
    case 'paid':
      return 'text-green-600 bg-green-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'failed':
    case 'canceled':
      return 'text-red-600 bg-red-100';
    case 'requires_action':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Payment method display names
export const getPaymentMethodDisplay = (type: string): string => {
  switch (type) {
    case 'card':
      return 'Credit Card';
    case 'bank_transfer':
      return 'Bank Transfer';
    case 'customer_balance':
      return 'Customer Balance';
    case 'us_bank_account':
      return 'US Bank Account';
    case 'sepa_debit':
      return 'SEPA Direct Debit';
    default:
      return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};