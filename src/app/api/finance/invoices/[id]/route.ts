import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const invoice = await stripe.invoices.retrieve(id, {
      expand: ['customer', 'subscription'],
    });

    return NextResponse.json({
      invoice: {
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
        description: invoice.description,
        invoice_pdf: invoice.invoice_pdf,
        hosted_invoice_url: invoice.hosted_invoice_url,
        items: invoice.lines.data.map(line => ({
          id: line.id,
          description: line.description || '',
          quantity: line.quantity || 1,
          unit_amount: (line as any).price?.unit_amount || (line as any).unit_amount || 0,
          amount: line.amount,
        })),
      },
    });

  } catch (error) {
    console.error('Invoice fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    const invoice = await stripe.invoices.retrieve(id);

    switch (action) {
      case 'send':
        await stripe.invoices.sendInvoice(id);
        return NextResponse.json({ 
          message: 'Invoice sent successfully',
          invoice: { id: invoice.id, status: 'open' }
        });

      case 'void':
        if (invoice.status !== 'draft' && invoice.status !== 'open') {
          return NextResponse.json(
            { error: 'Can only void draft or open invoices' },
            { status: 400 }
          );
        }
        const voidedInvoice = await stripe.invoices.voidInvoice(id);
        return NextResponse.json({ 
          message: 'Invoice voided successfully',
          invoice: { id: voidedInvoice.id, status: voidedInvoice.status }
        });

      case 'mark_paid':
        if (invoice.status !== 'open') {
          return NextResponse.json(
            { error: 'Can only mark open invoices as paid' },
            { status: 400 }
          );
        }
        const paidInvoice = await stripe.invoices.pay(id, {
          paid_out_of_band: true,
        });
        return NextResponse.json({ 
          message: 'Invoice marked as paid',
          invoice: { id: paidInvoice.id, status: paidInvoice.status }
        });

      case 'finalize':
        if (invoice.status !== 'draft') {
          return NextResponse.json(
            { error: 'Can only finalize draft invoices' },
            { status: 400 }
          );
        }
        const finalizedInvoice = await stripe.invoices.finalizeInvoice(id);
        return NextResponse.json({ 
          message: 'Invoice finalized successfully',
          invoice: { id: finalizedInvoice.id, status: finalizedInvoice.status }
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Invoice action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform invoice action' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const invoice = await stripe.invoices.retrieve(id);
    
    if (invoice.status !== 'draft') {
      return NextResponse.json(
        { error: 'Can only delete draft invoices' },
        { status: 400 }
      );
    }

    await stripe.invoices.del(id);
    
    return NextResponse.json({ 
      message: 'Invoice deleted successfully',
      invoice: { id: id }
    });

  } catch (error) {
    console.error('Invoice deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}