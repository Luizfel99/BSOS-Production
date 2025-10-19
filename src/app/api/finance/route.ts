import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Finance API Route - GET summary
export async function GET() {
  try {
    // Check if Stripe keys are configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey || stripeKey === 'your_stripe_secret_key_here') {
      // Return static placeholder data when Stripe not configured
      return NextResponse.json({
        success: true,
        data: {
          totalIncome: 12450.80,
          pendingAmount: 2300.50,
          paidAmount: 10150.30,
          invoiceCount: 24,
          transactionCount: 156,
          lastUpdated: new Date().toISOString(),
          source: 'placeholder'
        }
      });
    }

    // Initialize Stripe client
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-09-30.clover',
    });

    try {
      // Fetch real data from Stripe
      const [balance, invoices] = await Promise.all([
        stripe.balance.retrieve(),
        stripe.invoices.list({ limit: 100 })
      ]);

      // Calculate summary from Stripe data
      const totalIncome = balance.available.reduce((sum, item) => sum + item.amount, 0) / 100;
      const pendingAmount = balance.pending.reduce((sum, item) => sum + item.amount, 0) / 100;
      
      const paidInvoices = invoices.data.filter(inv => inv.status === 'paid');
      const paidAmount = paidInvoices.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0) / 100;
      
      return NextResponse.json({
        success: true,
        data: {
          totalIncome,
          pendingAmount,
          paidAmount,
          invoiceCount: invoices.data.length,
          transactionCount: invoices.data.length, // Simplified for now
          lastUpdated: new Date().toISOString(),
          source: 'stripe'
        }
      });

    } catch (stripeError) {
      console.error('Stripe API error:', stripeError);
      
      // Fallback to placeholder data on Stripe error
      return NextResponse.json({
        success: true,
        data: {
          totalIncome: 12450.80,
          pendingAmount: 2300.50,
          paidAmount: 10150.30,
          invoiceCount: 24,
          transactionCount: 156,
          lastUpdated: new Date().toISOString(),
          source: 'placeholder',
          error: 'Stripe temporarily unavailable'
        }
      });
    }

  } catch (error) {
    console.error('Finance API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Service unavailable';
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? errorMessage : 'Service unavailable'
      }, 
      { status: 500 }
    );
  }
}