import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || 'client-001';
    const status = searchParams.get('status') || 'all';

    // Mock invoices data
    const invoices = [
      {
        id: 'inv-001',
        clientId: 'client-001',
        cleaningId: 'clean-002',
        invoiceNumber: 'BS-2025-001',
        date: '2025-10-08',
        dueDate: '2025-10-15',
        amount: 450,
        status: 'paid',
        currency: 'BRL',
        items: [
          {
            id: 'item-001',
            description: 'Limpeza Profunda - Apartamento 2 quartos',
            quantity: 1,
            rate: 450,
            amount: 450,
            category: 'cleaning'
          }
        ],
        taxes: {
          subtotal: 450,
          taxRate: 0,
          taxAmount: 0,
          total: 450
        },
        payment: {
          method: 'credit_card',
          methodLabel: 'Cartão de Crédito',
          transactionId: 'TXN123456789',
          paidAt: '2025-10-08T18:30:00Z',
          reference: '**** **** **** 1234'
        },
        client: {
          name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '+55 21 99999-9999',
          address: 'Av. Atlântica, 1200 - Copacabana, Rio de Janeiro'
        },
        company: {
          name: 'Bright & Shine Cleaning Services',
          cnpj: '12.345.678/0001-90',
          address: 'Rua das Empresas, 123 - Centro, Rio de Janeiro',
          phone: '+55 21 3333-3333',
          email: 'contato@brightshine.com.br'
        },
        notes: 'Pagamento processado com sucesso. Obrigado pela preferência!',
        createdAt: '2025-10-08T17:45:00Z',
        updatedAt: '2025-10-08T18:30:00Z'
      },
      {
        id: 'inv-002',
        clientId: 'client-001',
        cleaningId: 'clean-003',
        invoiceNumber: 'BS-2025-002',
        date: '2025-10-05',
        dueDate: '2025-10-12',
        amount: 200,
        status: 'paid',
        currency: 'BRL',
        items: [
          {
            id: 'item-002',
            description: 'Limpeza de Manutenção Semanal',
            quantity: 1,
            rate: 200,
            amount: 200,
            category: 'maintenance'
          }
        ],
        taxes: {
          subtotal: 200,
          taxRate: 0,
          taxAmount: 0,
          total: 200
        },
        payment: {
          method: 'pix',
          methodLabel: 'PIX',
          transactionId: 'PIX987654321',
          paidAt: '2025-10-05T12:15:00Z',
          reference: 'joao.silva@email.com'
        },
        client: {
          name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '+55 21 99999-9999',
          address: 'Rua Visconde de Pirajá, 500 - Ipanema, Rio de Janeiro'
        },
        company: {
          name: 'Bright & Shine Cleaning Services',
          cnpj: '12.345.678/0001-90',
          address: 'Rua das Empresas, 123 - Centro, Rio de Janeiro',
          phone: '+55 21 3333-3333',
          email: 'contato@brightshine.com.br'
        },
        notes: 'Limpeza de manutenção regular conforme contrato.',
        createdAt: '2025-10-05T12:00:00Z',
        updatedAt: '2025-10-05T12:15:00Z'
      },
      {
        id: 'inv-003',
        clientId: 'client-001',
        cleaningId: 'clean-001',
        invoiceNumber: 'BS-2025-003',
        date: '2025-10-09',
        dueDate: '2025-10-16',
        amount: 350,
        status: 'pending',
        currency: 'BRL',
        items: [
          {
            id: 'item-003',
            description: 'Limpeza Padrão - Casa 3 quartos',
            quantity: 1,
            rate: 350,
            amount: 350,
            category: 'standard'
          }
        ],
        taxes: {
          subtotal: 350,
          taxRate: 0,
          taxAmount: 0,
          total: 350
        },
        payment: null,
        client: {
          name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '+55 21 99999-9999',
          address: 'Rua Visconde de Pirajá, 500 - Ipanema, Rio de Janeiro'
        },
        company: {
          name: 'Bright & Shine Cleaning Services',
          cnpj: '12.345.678/0001-90',
          address: 'Rua das Empresas, 123 - Centro, Rio de Janeiro',
          phone: '+55 21 3333-3333',
          email: 'contato@brightshine.com.br'
        },
        notes: 'Fatura aguardando pagamento.',
        createdAt: '2025-10-09T09:00:00Z',
        updatedAt: '2025-10-09T09:00:00Z'
      }
    ];

    // Filter by status if specified
    let filteredInvoices = invoices.filter(inv => inv.clientId === clientId);
    if (status !== 'all') {
      filteredInvoices = filteredInvoices.filter(inv => inv.status === status);
    }

    // Sort by date (newest first)
    filteredInvoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      invoices: filteredInvoices,
      summary: {
        total: filteredInvoices.length,
        totalAmount: filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0),
        paid: filteredInvoices.filter(inv => inv.status === 'paid').length,
        pending: filteredInvoices.filter(inv => inv.status === 'pending').length,
        overdue: filteredInvoices.filter(inv => 
          inv.status === 'pending' && new Date(inv.dueDate) < new Date()
        ).length,
        paidAmount: filteredInvoices
          .filter(inv => inv.status === 'paid')
          .reduce((sum, inv) => sum + inv.amount, 0),
        pendingAmount: filteredInvoices
          .filter(inv => inv.status === 'pending')
          .reduce((sum, inv) => sum + inv.amount, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, paymentMethod, paymentDetails } = body;

    // Simulate payment processing
    const payment = {
      id: `pay-${Date.now()}`,
      invoiceId,
      method: paymentMethod,
      amount: paymentDetails.amount,
      currency: 'BRL',
      status: 'completed',
      transactionId: `TXN${Date.now()}`,
      processedAt: new Date().toISOString(),
      reference: paymentDetails.reference || `${paymentMethod}-payment`,
      fees: {
        processing: paymentMethod === 'credit_card' ? paymentDetails.amount * 0.0399 : 0,
        total: paymentMethod === 'credit_card' ? paymentDetails.amount * 0.0399 : 0
      }
    };

    return NextResponse.json({
      success: true,
      payment,
      message: 'Pagamento processado com sucesso',
      receiptUrl: `/receipts/${payment.id}.pdf`
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
