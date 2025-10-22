import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("❌ Missing STRIPE_SECRET_KEY");
    return NextResponse.json({ error: "Missing Stripe credentials" }, { status: 500 });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-09-30.clover',
  });

  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('Missing Stripe signature or webhook secret');
    return NextResponse.json({ error: 'Webhook signature missing' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const buf = await req.text();
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Webhook signature verification failed';
    console.error('Webhook signature verification failed:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      const succeededInvoice = event.data.object as Stripe.Invoice;
      console.info('✅ Invoice paid:', {
        id: succeededInvoice.id,
        amount: succeededInvoice.amount_paid / 100,
        customer: succeededInvoice.customer_email,
        timestamp: new Date().toISOString()
      });
      
      // TODO: Update local database with payment status
      // await updateInvoiceStatus(succeededInvoice.id, 'paid');
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      console.info('❌ Payment failed:', {
        id: failedInvoice.id,
        amount: failedInvoice.amount_due / 100,
        customer: failedInvoice.customer_email,
        reason: failedInvoice.last_finalization_error?.message || 'Unknown',
        timestamp: new Date().toISOString()
      });
      
      // TODO: Update local database and notify customer
      // await updateInvoiceStatus(failedInvoice.id, 'failed');
      // await sendPaymentFailedNotification(failedInvoice.customer_email);
      break;

    case 'customer.subscription.created':
      const subscription = event.data.object as Stripe.Subscription;
      console.info('🎉 New subscription:', {
        id: subscription.id,
        customer: subscription.customer,
        status: subscription.status,
        timestamp: new Date().toISOString()
      });
      break;

    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object as Stripe.Subscription;
      console.info('🔄 Subscription updated:', {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        timestamp: new Date().toISOString()
      });
      break;

    case 'charge.succeeded':
      const charge = event.data.object as Stripe.Charge;
      console.info('💰 Charge succeeded:', {
        id: charge.id,
        amount: charge.amount / 100,
        customer: charge.customer,
        timestamp: new Date().toISOString()
      });
      break;

    case 'charge.failed':
      const failedCharge = event.data.object as Stripe.Charge;
      console.info('💸 Charge failed:', {
        id: failedCharge.id,
        amount: failedCharge.amount / 100,
        failure_message: failedCharge.failure_message,
        timestamp: new Date().toISOString()
      });
      break;

    default:
      console.info('Unhandled event type:', event.type);
  }

  return NextResponse.json({ received: true });
}