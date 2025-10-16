import { NextRequest, NextResponse } from 'next/server';

// POST /api/invoices/generate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      customer_id, 
      services, 
      billing_period, 
      due_date, 
      discount, 
      notes 
    } = body;

    // Validar dados obrigatórios
    if (!customer_id || !services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados obrigatórios ausentes',
          message: 'ID do cliente e lista de serviços são obrigatórios',
        },
        { status: 400 }
      );
    }

    // Buscar dados do cliente
    // TODO: Verificar no banco de dados se o cliente existe
    const mockCustomer = {
      id: customer_id,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      document: '123.456.789-00',
      address: 'Rua das Flores, 123, São Paulo, SP',
      paymentTerms: 'net_15', // 15 dias
    };

    if (!mockCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cliente não encontrado',
          message: 'ID do cliente inválido',
        },
        { status: 404 }
      );
    }

    // Calcular valores dos serviços
    const serviceCalculations = services.map((service: any) => {
      const unitPrice = service.unit_price || 100.00;
      const quantity = service.quantity || 1;
      const subtotal = unitPrice * quantity;
      
      return {
        ...service,
        unit_price: unitPrice,
        quantity,
        subtotal,
      };
    });

    const subtotal = serviceCalculations.reduce((acc, service) => acc + service.subtotal, 0);
    const discountAmount = discount ? (subtotal * discount / 100) : 0;
    const taxes = (subtotal - discountAmount) * 0.1; // 10% de impostos
    const total = subtotal - discountAmount + taxes;

    // Gerar número da fatura
    const invoiceNumber = `INV-${Date.now()}-${customer_id.slice(-4).toUpperCase()}`;

    // Simular criação da fatura
    const mockInvoice = {
      id: `invoice-${Date.now()}`,
      number: invoiceNumber,
      customerId: customer_id,
      customer: mockCustomer,
      services: serviceCalculations,
      billing_period: billing_period || null,
      amounts: {
        subtotal,
        discount: discountAmount,
        taxes,
        total,
      },
      status: 'generated',
      generatedAt: new Date().toISOString(),
      dueDate: due_date || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      notes: notes || null,
      paymentLink: `https://payment.bsos.com/invoice/${invoiceNumber}`,
      pdfUrl: `https://invoices.bsos.com/${invoiceNumber}.pdf`,
    };

    console.log('📄 Fatura gerada:', mockInvoice);

    // Simular ações automáticas
    const automaticActions = [
      '📄 PDF da fatura gerado',
      '🔗 Link de pagamento criado',
      '📊 Relatório financeiro atualizado',
    ];

    // Enviar por email se solicitado
    if (body.send_email !== false) {
      automaticActions.push('📧 Fatura enviada por email para o cliente');
    }

    // Configurar lembretes automáticos
    automaticActions.push('⏰ Lembretes automáticos configurados (7, 3 e 1 dia antes do vencimento)');

    // Simular métricas de faturamento
    const invoiceMetrics = {
      totalInvoicesThisMonth: 42,
      totalAmountThisMonth: 12500.00 + total,
      averageInvoiceValue: (12500.00 + total) / 43,
      pendingPayments: 8,
      overdueAmount: 2300.00,
      collectionRate: '94.5%',
    };

    return NextResponse.json({
      success: true,
      data: {
        invoice: mockInvoice,
        automaticActions,
        invoiceMetrics,
        nextSteps: [
          'Cliente receberá email com fatura e link de pagamento',
          'Sistema enviará lembretes automáticos',
          'Acompanhar pagamento até a data de vencimento',
        ],
      },
      message: `Fatura ${invoiceNumber} gerada com sucesso! Total: R$ ${total.toFixed(2)} 📄`,
    });

  } catch (error) {
    console.error('Erro ao gerar fatura:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível gerar a fatura',
      },
      { status: 500 }
    );
  }
}

// GET /api/invoices/generate - Buscar template de fatura ou informações para geração
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');

    // Retornar dados para auxiliar na geração de faturas
    const templateData: any = {
      serviceTypes: [
        { id: 'basic', name: 'Limpeza Básica', defaultPrice: 80.00 },
        { id: 'standard', name: 'Limpeza Padrão', defaultPrice: 100.00 },
        { id: 'premium', name: 'Limpeza Premium', defaultPrice: 150.00 },
        { id: 'deep', name: 'Limpeza Pesada', defaultPrice: 200.00 },
        { id: 'maintenance', name: 'Manutenção', defaultPrice: 120.00 },
      ],
      taxRates: {
        default: 10.0, // 10%
        premium: 12.0, // 12%
      },
      paymentTerms: [
        { id: 'immediate', name: 'À vista', days: 0 },
        { id: 'net_7', name: '7 dias', days: 7 },
        { id: 'net_15', name: '15 dias', days: 15 },
        { id: 'net_30', name: '30 dias', days: 30 },
      ],
      discountOptions: [
        { id: 'first_time', name: 'Primeira vez', percentage: 15 },
        { id: 'loyalty', name: 'Cliente fiel', percentage: 10 },
        { id: 'bulk', name: 'Serviços em lote', percentage: 20 },
      ],
    };

    // Se customer_id foi fornecido, incluir dados do cliente
    if (customerId) {
      templateData.customer = {
        id: customerId,
        name: 'Cliente Exemplo',
        email: 'cliente@exemplo.com',
        preferredPaymentTerm: 'net_15',
        loyaltyDiscount: 10,
      };
    }

    return NextResponse.json({
      success: true,
      data: templateData,
      message: 'Dados do template de fatura recuperados com sucesso',
    });

  } catch (error) {
    console.error('Erro ao buscar template de fatura:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível recuperar os dados do template',
      },
      { status: 500 }
    );
  }
}
