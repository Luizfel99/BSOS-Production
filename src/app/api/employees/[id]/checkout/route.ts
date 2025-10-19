import { NextRequest, NextResponse } from 'next/server';

// POST /api/employees/[id]/checkout
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: employeeId } = await params;
    const body = await request.json();
    
    const { location, completed_tasks, notes, rating_request } = body;

    // Buscar check-in ativo
    // TODO: Verificar no banco de dados se existe check-in ativo
    const activeCheckin = {
      id: `checkin-${employeeId}-active`,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 horas atrás
      propertyId: 'property-123',
    };

    if (!activeCheckin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Check-in não encontrado',
          message: 'Não há check-in ativo para este funcionário',
        },
        { status: 400 }
      );
    }

    // Calcular duração do trabalho
    const workDuration = Math.floor((Date.now() - new Date(activeCheckin.timestamp).getTime()) / 1000 / 60); // minutos

    // Simular registro no banco de dados
    const mockCheckout = {
      id: `checkout-${Date.now()}`,
      employeeId,
      checkinId: activeCheckin.id,
      timestamp: new Date().toISOString(),
      location: location || null,
      workDuration,
      completedTasks: completed_tasks || [],
      notes: notes || null,
      ratingRequested: rating_request || false,
      productivity: {
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        tasksCompleted: completed_tasks?.length || Math.floor(Math.random() * 5) + 1,
        efficiency: workDuration > 240 ? 'normal' : 'fast',
      },
    };

    console.log('❌ Check-out registrado:', mockCheckout);

    // Simular ações automáticas após check-out
    const automaticActions = [
      '📱 Supervisor notificado do término',
      '⏰ Timer de trabalho finalizado',
      '📊 Dados de produtividade calculados',
    ];

    if (activeCheckin.propertyId) {
      automaticActions.push('🏠 Status da propriedade atualizado para "disponível"');
    }

    if (rating_request) {
      automaticActions.push('⭐ Solicitação de avaliação enviada ao cliente');
    }

    // Calcular métricas do dia
    const dailyMetrics = {
      totalWorkTime: workDuration,
      averageTaskTime: workDuration / (completed_tasks?.length || 1),
      productivityScore: mockCheckout.productivity.score,
      bonus: mockCheckout.productivity.score > 90 ? 25.00 : 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        checkout: mockCheckout,
        automaticActions,
        dailyMetrics,
        recommendations: [
          'Descansar pelo menos 1 hora antes do próximo agendamento',
          'Verificar agenda do dia seguinte',
          'Reabastecer kit de limpeza se necessário',
        ],
      },
      message: 'Check-out realizado com sucesso! Bom trabalho hoje! 🎉',
    });

  } catch (error) {
    console.error('Erro ao realizar check-out:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível realizar o check-out',
      },
      { status: 500 }
    );
  }
}