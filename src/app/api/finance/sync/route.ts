import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Sync Stripe Data API Route
export async function POST() {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey || stripeKey === 'your_stripe_secret_key_here') {
      return NextResponse.json({ 
        success: false, 
        message: "Stripe keys not configured" 
      }, { status: 400 });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-09-30.clover',
    });

    try {
      // Test Stripe connection and sync basic data
      const [balance, invoices, customers] = await Promise.all([
        stripe.balance.retrieve(),
        stripe.invoices.list({ limit: 10 }),
        stripe.customers.list({ limit: 10 })
      ]);

      return NextResponse.json({
        success: true,
        message: 'Sync started',
        data: {
          balance: {
            available: balance.available.reduce((sum, item) => sum + item.amount, 0) / 100,
            pending: balance.pending.reduce((sum, item) => sum + item.amount, 0) / 100
          },
          invoicesCount: invoices.data.length,
          customersCount: customers.data.length,
          lastSync: new Date().toISOString()
        }
      });

    } catch (stripeError) {
      console.error('Stripe sync error:', stripeError);
      return NextResponse.json({ 
        success: false, 
        message: 'Em desenvolvimento - Stripe connection failed' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Sync API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Em desenvolvimento' 
    }, { status: 500 });
  }
}