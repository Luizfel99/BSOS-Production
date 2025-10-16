import { NextRequest, NextResponse } from 'next/server';

// PUT /api/properties/[id]/status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = id;
    const body = await request.json();
    
    const { status, reason, estimatedAvailability } = body;

    // Validar status
    const validStatuses = ['available', 'occupied', 'maintenance', 'cleaning', 'blocked'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Status inválido',
          message: `Status deve ser um dos seguintes: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Simular atualização no banco de dados
    // TODO: Substituir por atualização real no banco de dados
    const mockStatusUpdate = {
      propertyId,
      previousStatus: 'available', // Simular status anterior
      newStatus: status,
      reason: reason || null,
      estimatedAvailability: estimatedAvailability || null,
      updatedAt: new Date().toISOString(),
      updatedBy: 'current-user', // TODO: Pegar do JWT/session
    };

    console.log('🏠 Status da propriedade atualizado:', mockStatusUpdate);

    // Simular ações baseadas no novo status
    let additionalActions = [];
    
    switch (status) {
      case 'maintenance':
        additionalActions.push('🔧 Equipe de manutenção notificada');
        additionalActions.push('📅 Agendamentos futuros suspensos');
        break;
      case 'cleaning':
        additionalActions.push('🧹 Funcionários de limpeza notificados');
        additionalActions.push('⏰ Timer de limpeza iniciado');
        break;
      case 'available':
        additionalActions.push('✅ Propriedade disponível para novos agendamentos');
        additionalActions.push('📋 Checklist de qualidade verificado');
        break;
      case 'blocked':
        additionalActions.push('🚫 Propriedade bloqueada temporariamente');
        additionalActions.push('📧 Proprietário notificado');
        break;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...mockStatusUpdate,
        additionalActions,
      },
      message: `Status da propriedade atualizado para "${status}" com sucesso`,
    });

  } catch (error) {
    console.error('Erro ao atualizar status da propriedade:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível atualizar o status da propriedade',
      },
      { status: 500 }
    );
  }
}

// GET /api/properties/[id]/status - Buscar histórico de status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = id;

    // Simular histórico de status
    const mockStatusHistory = Array.from({ length: 5 }, (_, i) => ({
      id: `status-${i}`,
      propertyId,
      status: ['available', 'cleaning', 'available', 'maintenance', 'available'][i],
      reason: ['Limpeza concluída', 'Agendamento iniciado', 'Manutenção concluída', 'Reparo hidráulico', 'Inicial'][i],
      timestamp: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: `Usuário ${i + 1}`,
      duration: Math.floor(Math.random() * 240) + 60, // minutos
    }));

    return NextResponse.json({
      success: true,
      data: {
        currentStatus: 'available',
        history: mockStatusHistory,
      },
      message: 'Histórico de status recuperado com sucesso',
    });

  } catch (error) {
    console.error('Erro ao buscar histórico de status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível recuperar o histórico de status',
      },
      { status: 500 }
    );
  }
}