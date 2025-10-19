import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const dateRange = searchParams.get('date_range');
    const format = searchParams.get('format') || 'csv';

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
      limit: 1000, // Increased limit for export
      expand: ['data.customer', 'data.payment_method'],
    };

    if (created) {
      queryParams.created = created;
    }

    // Fetch transactions
    let allTransactions: any[] = [];

    if (!type || type === 'all' || type === 'payment') {
      const charges = await stripe.charges.list(queryParams);
      const payments = charges.data.map(charge => ({
        id: charge.id,
        type: 'payment',
        amount: (charge.amount / 100).toFixed(2),
        currency: charge.currency.toUpperCase(),
        status: charge.status,
        created: new Date(charge.created * 1000).toISOString().split('T')[0],
        description: charge.description || `Payment from ${charge.billing_details?.name || 'customer'}`,
        customer_name: charge.customer && typeof charge.customer === 'object' && !charge.customer.deleted
          ? (charge.customer as Stripe.Customer).name || ''
          : '',
        customer_email: charge.customer && typeof charge.customer === 'object' && !charge.customer.deleted
          ? (charge.customer as Stripe.Customer).email || ''
          : '',
        payment_method: charge.payment_method_details?.type || '',
        card_last4: charge.payment_method_details?.card?.last4 || '',
        card_brand: charge.payment_method_details?.card?.brand || '',
        fee: charge.balance_transaction && typeof charge.balance_transaction === 'object'
          ? (charge.balance_transaction.fee / 100).toFixed(2)
          : '0.00',
        net: charge.balance_transaction && typeof charge.balance_transaction === 'object'
          ? (charge.balance_transaction.net / 100).toFixed(2)
          : '0.00',
      }));
      allTransactions.push(...payments);
    }

    if (!type || type === 'all' || type === 'refund') {
      const refunds = await stripe.refunds.list(queryParams);
      const refundTransactions = refunds.data.map(refund => ({
        id: refund.id,
        type: 'refund',
        amount: (refund.amount / 100).toFixed(2),
        currency: refund.currency.toUpperCase(),
        status: refund.status,
        created: new Date(refund.created * 1000).toISOString().split('T')[0],
        description: refund.reason ? `Refund: ${refund.reason}` : 'Refund',
        customer_name: '',
        customer_email: '',
        payment_method: '',
        card_last4: '',
        card_brand: '',
        fee: refund.balance_transaction && typeof refund.balance_transaction === 'object'
          ? (refund.balance_transaction.fee / 100).toFixed(2)
          : '0.00',
        net: refund.balance_transaction && typeof refund.balance_transaction === 'object'
          ? (refund.balance_transaction.net / 100).toFixed(2)
          : '0.00',
      }));
      allTransactions.push(...refundTransactions);
    }

    // Apply status filter
    if (status && status !== 'all') {
      allTransactions = allTransactions.filter(t => t.status === status);
    }

    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'ID',
        'Type',
        'Amount',
        'Currency',
        'Status',
        'Date',
        'Description',
        'Customer Name',
        'Customer Email',
        'Payment Method',
        'Card Last 4',
        'Card Brand',
        'Fee',
        'Net Amount'
      ];

      const csvRows = allTransactions.map(transaction => [
        transaction.id,
        transaction.type,
        transaction.amount,
        transaction.currency,
        transaction.status,
        transaction.created,
        `"${transaction.description.replace(/"/g, '""')}"`,
        `"${transaction.customer_name.replace(/"/g, '""')}"`,
        transaction.customer_email,
        transaction.payment_method,
        transaction.card_last4,
        transaction.card_brand,
        transaction.fee,
        transaction.net
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="transactions-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Default to JSON
    return NextResponse.json({
      transactions: allTransactions,
      total: allTransactions.length,
    });

  } catch (error) {
    console.error('Transaction export error:', error);
    return NextResponse.json(
      { error: 'Failed to export transactions' },
      { status: 500 }
    );
  }
}