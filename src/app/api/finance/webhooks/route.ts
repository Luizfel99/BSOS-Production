import { NextRequest, NextResponse } from 'next/server';
import { stripe, verifyWebhookSignature } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { 
  withErrorHandling, 
  createSuccessResponse, 
  createErrorResponse 
} from '@/lib/api-utils';

// Disable body parsing for webhooks - Stripe needs raw body
export const dynamic = 'force-dynamic';

export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature header');
      return createErrorResponse('Missing Stripe signature', 400);
    }

    // Verify webhook signature
    let event;
    try {
      event = verifyWebhookSignature(body, signature);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return createErrorResponse(`Webhook signature verification failed: ${err.message}`, 400);
    }

    // Check for duplicate events using idempotency
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { stripeEventId: event.id }
    });

    if (existingEvent) {
      console.log(`Duplicate event ${event.id} - returning success`);
      return createSuccessResponse({ received: true, duplicate: true });
    }

    // Store the event to prevent duplicates
    await prisma.webhookEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
        processed: false
      }
    });

    // Handle the event
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event.data.object as any);
          break;

        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object as any);
          break;

        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object as any);
          break;

        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as any);
          break;

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as any);
          break;

        case 'payment_intent.succeeded':
          await handlePaymentIntentSucceeded(event.data.object as any);
          break;

        case 'payment_intent.payment_failed':
          await handlePaymentIntentFailed(event.data.object as any);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Mark event as processed
      await prisma.webhookEvent.update({
        where: { stripeEventId: event.id },
        data: { processed: true }
      });

      return createSuccessResponse({ 
        received: true, 
        eventType: event.type,
        eventId: event.id 
      });

    } catch (eventError: any) {
      console.error(`Error processing webhook event ${event.id}:`, eventError);
      
      // Don't mark as processed if there was an error
      return createErrorResponse(
        `Error processing webhook event: ${eventError.message}`,
        500
      );
    }

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return createErrorResponse(
      `Webhook processing failed: ${error.message}`,
      500
    );
  }
});

async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  // Update payment record in database
  await prisma.payment.upsert({
    where: {
      stripeInvoiceId: invoice.id
    },
    update: {
      status: 'PAID',
      paidAt: new Date(invoice.status_transitions.paid_at * 1000),
      updatedAt: new Date()
    },
    create: {
      stripeInvoiceId: invoice.id,
      stripeCustomerId: invoice.customer,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'PAID',
      paidAt: new Date(invoice.status_transitions.paid_at * 1000)
    }
  });
}

async function handleInvoicePaymentFailed(invoice: any) {
  console.log('Invoice payment failed:', invoice.id);
  
  await prisma.payment.upsert({
    where: {
      stripeInvoiceId: invoice.id
    },
    update: {
      status: 'FAILED',
      updatedAt: new Date()
    },
    create: {
      stripeInvoiceId: invoice.id,
      stripeCustomerId: invoice.customer,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'FAILED'
    }
  });
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('Subscription created:', subscription.id);
  
  // Find or create customer
  const customer = await stripe.customers.retrieve(subscription.customer);
  
  if (customer.deleted) return;
  
  // Create or update subscription in database
  await prisma.subscription.upsert({
    where: {
      stripeSubscriptionId: subscription.id
    },
    update: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      updatedAt: new Date()
    },
    create: {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    }
  });
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('Subscription updated:', subscription.id);
  
  await prisma.subscription.update({
    where: {
      stripeSubscriptionId: subscription.id
    },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      updatedAt: new Date()
    }
  });
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log('Subscription deleted:', subscription.id);
  
  await prisma.subscription.update({
    where: {
      stripeSubscriptionId: subscription.id
    },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
      updatedAt: new Date()
    }
  });
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  
  await prisma.payment.upsert({
    where: {
      stripePaymentIntentId: paymentIntent.id
    },
    update: {
      status: 'PAID',
      paidAt: new Date(),
      updatedAt: new Date()
    },
    create: {
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: paymentIntent.customer,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'PAID',
      paidAt: new Date()
    }
  });
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log('Payment intent failed:', paymentIntent.id);
  
  await prisma.payment.upsert({
    where: {
      stripePaymentIntentId: paymentIntent.id
    },
    update: {
      status: 'FAILED',
      updatedAt: new Date()
    },
    create: {
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: paymentIntent.customer,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'FAILED'
    }
  });
}