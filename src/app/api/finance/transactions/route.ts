import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const dateRange = searchParams.get('date_range');
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // Calculate date filter
    let created: any = undefined;
    if (dateRange && dateRange !== 'all') {
      const days = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      created = { gte: Math.floor(startDate.getTime() / 1000) };
    }

    // Build Stripe query parameters
    const queryParams: any = {
      limit: 100,
      expand: ['data.customer', 'data.payment_method', 'data.invoice'],
    };

    if (created) {
      queryParams.created = created;
    }

    // Fetch different types of transactions based on filter
    let allTransactions: any[] = [];

    if (!type || type === 'all' || type === 'payment') {
      const charges = await stripe.charges.list(queryParams);
      const payments = charges.data.map(charge => ({
        id: charge.id,
        type: 'payment',
        amount: charge.amount,
        currency: charge.currency,
        status: charge.status,
        created: charge.created,
        description: charge.description || `Payment from ${charge.billing_details?.name || 'customer'}`,
        customer: charge.customer && typeof charge.customer === 'object' && !charge.customer.deleted ? {
          name: (charge.customer as Stripe.Customer).name,
          email: (charge.customer as Stripe.Customer).email,
        } : null,
        payment_method: charge.payment_method_details ? {
          type: charge.payment_method_details.type,
          last4: charge.payment_method_details.card?.last4,
          brand: charge.payment_method_details.card?.brand,
        } : null,
        invoice_id: (charge as any).invoice || null,
        receipt_url: charge.receipt_url,
        fee: charge.balance_transaction ? (
          typeof charge.balance_transaction === 'object' ? charge.balance_transaction.fee : null
        ) : null,
        net: charge.balance_transaction ? (
          typeof charge.balance_transaction === 'object' ? charge.balance_transaction.net : null
        ) : null,
      }));
      allTransactions.push(...payments);
    }

    if (!type || type === 'all' || type === 'refund') {
      const refunds = await stripe.refunds.list(queryParams);
      const refundTransactions = refunds.data.map(refund => ({
        id: refund.id,
        type: 'refund',
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        created: refund.created,
        description: refund.reason ? `Refund: ${refund.reason}` : 'Refund',
        customer: null, // Refunds don't directly have customer info
        payment_method: null,
        invoice_id: null,
        receipt_url: (refund as any).receipt_url || null,
        fee: refund.balance_transaction ? (
          typeof refund.balance_transaction === 'object' ? refund.balance_transaction.fee : null
        ) : null,
        net: refund.balance_transaction ? (
          typeof refund.balance_transaction === 'object' ? refund.balance_transaction.net : null
        ) : null,
      }));
      allTransactions.push(...refundTransactions);
    }

    if (!type || type === 'all' || type === 'payout') {
      const payouts = await stripe.payouts.list(queryParams);
      const payoutTransactions = payouts.data.map(payout => ({
        id: payout.id,
        type: 'payout',
        amount: payout.amount,
        currency: payout.currency,
        status: payout.status,
        created: payout.created,
        description: `Payout to ${payout.destination}`,
        customer: null,
        payment_method: null,
        invoice_id: null,
        receipt_url: null,
        fee: 0,
        net: payout.amount,
      }));
      allTransactions.push(...payoutTransactions);
    }

    // Apply filters
    let filteredTransactions = allTransactions;

    if (status && status !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(t => 
        t.description.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower) ||
        (t.customer?.name?.toLowerCase().includes(searchLower)) ||
        (t.customer?.email?.toLowerCase().includes(searchLower))
      );
    }

    // Sort transactions
    filteredTransactions.sort((a, b) => {
      return sortOrder === 'desc' ? b.created - a.created : a.created - b.created;
    });

    return NextResponse.json({
      transactions: filteredTransactions,
      total: filteredTransactions.length,
    });

  } catch (error) {
    console.error('Transaction fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}