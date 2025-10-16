import { NextRequest, NextResponse } from 'next/server';

// POST /api/employees/[id]/checkin
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: employeeId } = await params;
    const body = await request.json();
    
    const { location, propertyId, notes } = body;

    // Validar se o funcionário não está já em check-in
    // TODO: Verificar no banco de dados se já existe check-in ativo
    const existingCheckin = false; // Simular verificação

    if (existingCheckin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Check-in já realizado',
          message: 'Funcionário já possui check-in ativo',
        },
        { status: 400 }
      );
    }

    // Simular registro no banco de dados
    const mockCheckin = {
      id: `checkin-${Date.now()}`,
      employeeId,
      timestamp: new Date().toISOString(),
      location: location || null,
      propertyId: propertyId || null,
      notes: notes || null,
      status: 'active',
      method: location ? 'gps' : 'manual',
      accuracy: location ? Math.floor(Math.random() * 10) + 1 : null, // metros
    };

    console.log('✅ Check-in registrado:', mockCheckin);

    // Simular ações automáticas após check-in
    const automaticActions = [
      '📱 Notificação enviada ao supervisor',
      '⏰ Timer de trabalho iniciado',
      '📍 Localização registrada',
    ];

    if (propertyId) {
      automaticActions.push('🏠 Status da propriedade atualizado para "em limpeza"');
    }

    return NextResponse.json({
      success: true,
      data: {
        checkin: mockCheckin,
        automaticActions,
        nextActions: [
          'Verificar lista de tarefas do dia',
          'Confirmar materiais necessários',
          'Iniciar checklist de limpeza',
        ],
      },
      message: 'Check-in realizado com sucesso!',
    });

  } catch (error) {
    console.error('Erro ao realizar check-in:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível realizar o check-in',
      },
      { status: 500 }
    );
  }
}

// GET /api/employees/[id]/checkin - Buscar check-ins do funcionário
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: employeeId } = await params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Simular histórico de check-ins
    const mockCheckins = Array.from({ length: 7 }, (_, i) => ({
      id: `checkin-${employeeId}-${i}`,
      employeeId,
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      location: i % 2 === 0 ? {
        lat: -23.5505 + (Math.random() - 0.5) * 0.1,
        lng: -46.6333 + (Math.random() - 0.5) * 0.1,
        accuracy: Math.floor(Math.random() * 10) + 1,
      } : null,
      propertyId: `property-${i % 3}`,
      status: i === 0 ? 'active' : 'completed',
      workDuration: i > 0 ? Math.floor(Math.random() * 480) + 240 : null, // minutos
      checkoutTime: i > 0 ? new Date(Date.now() - i * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString() : null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        checkins: mockCheckins,
        activeCheckin: mockCheckins.find(c => c.status === 'active') || null,
        totalWorkTime: mockCheckins.reduce((acc, c) => acc + (c.workDuration || 0), 0),
      },
      message: 'Histórico de check-ins recuperado com sucesso',
    });

  } catch (error) {
    console.error('Erro ao buscar check-ins:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível recuperar o histórico de check-ins',
      },
      { status: 500 }
    );
  }
}