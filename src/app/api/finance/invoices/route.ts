import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const dateRange = searchParams.get('date_range');
    const sortBy = searchParams.get('sort_by') || 'created';
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
      expand: ['data.customer', 'data.subscription'],
    };

    if (created) {
      queryParams.created = created;
    }

    if (status && status !== 'all') {
      queryParams.status = status;
    }

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list(queryParams);

    // Transform invoices to match frontend interface
    let transformedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      number: invoice.number,
      customer: invoice.customer && typeof invoice.customer === 'object' && !invoice.customer.deleted ? {
        id: invoice.customer.id,
        name: (invoice.customer as Stripe.Customer).name || 'Unknown Customer',
        email: (invoice.customer as Stripe.Customer).email || '',
      } : {
        id: '',
        name: 'Unknown Customer',
        email: '',
      },
      status: invoice.status,
      amount: invoice.total,
      currency: invoice.currency,
      created: invoice.created,
      due_date: invoice.due_date,
      paid_at: invoice.status_transitions?.paid_at,
      description: invoice.description || `Invoice ${invoice.number}`,
      invoice_pdf: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url,
      payment_intent: (invoice as any).payment_intent || null,
      subscription_id: (invoice as any).subscription || null,
      items: invoice.lines.data.map(line => ({
        id: line.id,
        description: line.description || '',
        quantity: line.quantity || 1,
        unit_amount: (line as any).price?.unit_amount || (line as any).unit_amount || 0,
        amount: line.amount,
      })),
    }));

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      transformedInvoices = transformedInvoices.filter(invoice => 
        invoice.number?.toLowerCase().includes(searchLower) ||
        invoice.customer.name.toLowerCase().includes(searchLower) ||
        invoice.customer.email.toLowerCase().includes(searchLower) ||
        invoice.description.toLowerCase().includes(searchLower) ||
        invoice.id.toLowerCase().includes(searchLower)
      );
    }

    // Sort invoices
    transformedInvoices.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'customer':
          aValue = a.customer.name.toLowerCase();
          bValue = b.customer.name.toLowerCase();
          break;
        case 'due_date':
          aValue = a.due_date || 0;
          bValue = b.due_date || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.created;
          bValue = b.created;
      }

      if (sortOrder === 'desc') {
        if (aValue === null || bValue === null) return 0;
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        if (aValue === null || bValue === null) return 0;
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    return NextResponse.json({
      invoices: transformedInvoices,
      total: transformedInvoices.length,
    });

  } catch (error) {
    console.error('Invoice fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_email, customer_name, amount, currency, description, due_date } = body;

    // Create or get customer
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: customer_email,
        limit: 1,
      });
      
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customer_email,
          name: customer_name,
        });
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to create or find customer' },
        { status: 400 }
      );
    }

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      description: description,
      currency: currency.toLowerCase(),
      due_date: due_date ? Math.floor(new Date(due_date).getTime() / 1000) : undefined,
      auto_advance: true,
    });

    // Add invoice item
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      description: description,
    });

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    return NextResponse.json({
      invoice: {
        id: finalizedInvoice.id,
        number: finalizedInvoice.number,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
        },
        status: finalizedInvoice.status,
        amount: finalizedInvoice.total,
        currency: finalizedInvoice.currency,
        created: finalizedInvoice.created,
        due_date: finalizedInvoice.due_date,
        description: finalizedInvoice.description,
        invoice_pdf: finalizedInvoice.invoice_pdf,
        hosted_invoice_url: finalizedInvoice.hosted_invoice_url,
      },
    });

  } catch (error) {
    console.error('Invoice creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}