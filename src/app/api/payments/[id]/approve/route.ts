import { NextRequest, NextResponse } from 'next/server';

// POST /api/payments/[id]/approve
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paymentId = id;
    const body = await request.json();
    
    const { approver_notes, payment_method, partial_amount } = body;

    // Buscar dados do pagamento
    // TODO: Verificar no banco de dados se o pagamento existe
    const mockPayment = {
      id: paymentId,
      amount: 150.00,
      status: 'pending',
      employeeId: 'emp-123',
      taskId: 'task-456',
      description: 'Limpeza Apartamento - Premium',
      dueDate: new Date().toISOString(),
    };

    if (!mockPayment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Pagamento não encontrado',
          message: 'ID do pagamento inválido ou não existe',
        },
        { status: 404 }
      );
    }

    if (mockPayment.status === 'approved') {
      return NextResponse.json(
        {
          success: false,
          error: 'Pagamento já aprovado',
          message: 'Este pagamento já foi aprovado anteriormente',
        },
        { status: 400 }
      );
    }

    // Simular aprovação no banco de dados
    const mockApproval = {
      id: `approval-${Date.now()}`,
      paymentId,
      originalAmount: mockPayment.amount,
      approvedAmount: partial_amount || mockPayment.amount,
      approverNotes: approver_notes || null,
      paymentMethod: payment_method || 'bank_transfer',
      approvedAt: new Date().toISOString(),
      approvedBy: 'current-manager', // TODO: Pegar do JWT/session
      estimatedTransferDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias
      transactionId: `TXN-${Date.now()}`,
    };

    console.log('✅ Pagamento aprovado:', mockApproval);

    // Simular ações automáticas após aprovação
    const automaticActions = [
      '📧 Funcionário notificado sobre aprovação',
      '💳 Transferência bancária agendada',
      '📊 Relatório financeiro atualizado',
    ];

    if (partial_amount && partial_amount < mockPayment.amount) {
      automaticActions.push('⚠️ Diferença registrada para análise futura');
    }

    // Simular cálculo de métricas financeiras
    const financialMetrics = {
      totalApprovedToday: 1250.00,
      pendingPayments: 15,
      employeeEarnings: {
        thisMonth: 2400 + mockApproval.approvedAmount,
        lastMonth: 2650,
        growth: '+5.2%',
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        approval: mockApproval,
        automaticActions,
        financialMetrics,
        nextSteps: [
          'Verificar saldo da conta empresa',
          'Confirmar dados bancários do funcionário',
          'Acompanhar transferência em 2 dias úteis',
        ],
      },
      message: `Pagamento de R$ ${mockApproval.approvedAmount.toFixed(2)} aprovado com sucesso! 💰`,
    });

  } catch (error) {
    console.error('Erro ao aprovar pagamento:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível aprovar o pagamento',
      },
      { status: 500 }
    );
  }
}