/**
 * Stripe Webhook Handler
 * Processes Stripe webhook events for payments, subscriptions, and more
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { verifyWebhookSignature } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = await verifyWebhookSignature(body, signature);

    if (!event) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);

  try {
    const metadata = paymentIntent.metadata;
    
    // Update payment record in database
    if (metadata.paymentId) {
      // await prisma.payment.update({
      //   where: { id: metadata.paymentId },
      //   data: {
      //     status: 'succeeded',
      //     stripePaymentIntentId: paymentIntent.id,
      //     paidAt: new Date(paymentIntent.created * 1000)
      //   }
      // });
    }

    // Send payment receipt notification
    if (metadata.userId && metadata.email) {
      const { sendNotification } = await import('@/services/notification');
      await sendNotification({
        userId: metadata.userId,
        type: 'payment_receipt',
        priority: 'medium',
        email: metadata.email,
        variables: {
          customerName: metadata.customerName || 'Customer',
          amount: `$${(paymentIntent.amount / 100).toFixed(2)}`,
          paymentMethod: paymentIntent.payment_method_types[0] || 'card',
          date: new Date().toLocaleDateString(),
          transactionId: paymentIntent.id,
          description: metadata.description || 'Payment'
        }
      });
    }

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);

  try {
    const metadata = paymentIntent.metadata;

    // Update payment record
    if (metadata.paymentId) {
      // await prisma.payment.update({
      //   where: { id: metadata.paymentId },
      //   data: {
      //     status: 'failed',
      //     stripePaymentIntentId: paymentIntent.id
      //   }
      // });
    }

    // Notify user of failure
    if (metadata.userId && metadata.email) {
      const { sendNotification } = await import('@/services/notification');
      await sendNotification({
        userId: metadata.userId,
        type: 'custom',
        priority: 'high',
        email: metadata.email,
        subject: 'Payment Failed',
        variables: {
          message: `Your payment of $${(paymentIntent.amount / 100).toFixed(2)} failed. Please try again or use a different payment method.`
        }
      });
    }

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);

  try {
    const customerId = subscription.customer as string;
    const metadata = subscription.metadata;

    // Create subscription record
    // await prisma.subscription.create({
    //   data: {
    //     userId: metadata.userId,
    //     stripeSubscriptionId: subscription.id,
    //     stripeCustomerId: customerId,
    //     status: subscription.status,
    //     priceId: subscription.items.data[0].price.id,
    //     currentPeriodStart: new Date(subscription.current_period_start * 1000),
    //     currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    //   }
    // });

  } catch (error) {
    console.error('Error handling subscription creation:', error);
  }
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);

  try {
    // Update subscription record
    // await prisma.subscription.update({
    //   where: { stripeSubscriptionId: subscription.id },
    //   data: {
    //     status: subscription.status,
    //     currentPeriodStart: new Date(subscription.current_period_start * 1000),
    //     currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    //   }
    // });

  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

/**
 * Handle subscription deleted/cancelled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  try {
    // Update subscription status
    // await prisma.subscription.update({
    //   where: { stripeSubscriptionId: subscription.id },
    //   data: {
    //     status: 'cancelled',
    //     cancelledAt: new Date()
    //   }
    // });

    // Notify user
    const metadata = subscription.metadata;
    if (metadata.userId && metadata.email) {
      const { sendNotification } = await import('@/services/notification');
      await sendNotification({
        userId: metadata.userId,
        type: 'custom',
        priority: 'medium',
        email: metadata.email,
        subject: 'Subscription Cancelled',
        variables: {
          message: 'Your subscription has been cancelled. You will retain access until the end of your billing period.'
        }
      });
    }

  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

/**
 * Handle invoice paid
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id);

  try {
    // Record invoice payment
    // Can be used for recurring subscription payments

  } catch (error) {
    console.error('Error handling invoice payment:', error);
  }
}

/**
 * Handle invoice payment failed
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);

  try {
    const customerId = invoice.customer as string;
    
    // Notify user of payment failure
    // This is critical for subscription renewals

  } catch (error) {
    console.error('Error handling invoice payment failure:', error);
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);

  try {
    const metadata = session.metadata || {};

    // Process based on mode
    if (session.mode === 'payment') {
      // One-time payment completed
      console.log('One-time payment completed');
    } else if (session.mode === 'subscription') {
      // Subscription created via checkout
      console.log('Subscription created via checkout');
    }

  } catch (error) {
    console.error('Error handling checkout session:', error);
  }
}
