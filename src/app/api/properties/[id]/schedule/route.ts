import { NextRequest, NextResponse } from 'next/server';

// POST /api/properties/[id]/schedule
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = id;
    const body = await request.json();
    
    // Validar dados de agendamento
    const { date, time, type, estimatedDuration, specialRequests, employeePreference } = body;

    if (!date || !time || !type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados obrigatórios ausentes',
          message: 'Data, horário e tipo de limpeza são obrigatórios',
        },
        { status: 400 }
      );
    }

    // Simular agendamento no banco de dados
    // TODO: Substituir por inserção real no banco de dados
    const mockScheduling = {
      id: `schedule-${Date.now()}`,
      propertyId,
      date,
      time,
      type,
      estimatedDuration: estimatedDuration || 120,
      specialRequests: specialRequests || [],
      employeePreference: employeePreference || null,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      estimatedCost: type === 'premium' ? 150.00 : type === 'standard' ? 100.00 : 80.00,
      assignedEmployee: null, // Será atribuído automaticamente
    };

    // Simular notificação para funcionários disponíveis
    console.log('📅 Novo agendamento criado:', mockScheduling);
    console.log('🔔 Notificando funcionários disponíveis...');

    return NextResponse.json({
      success: true,
      data: mockScheduling,
      message: 'Limpeza agendada com sucesso! Funcionário será atribuído em breve.',
    });

  } catch (error) {
    console.error('Erro ao agendar limpeza:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível agendar a limpeza',
      },
      { status: 500 }
    );
  }
}

// GET /api/properties/[id]/schedule - Buscar agendamentos da propriedade
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = id;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Simular busca de agendamentos
    const mockSchedules = Array.from({ length: 3 }, (_, i) => ({
      id: `schedule-${propertyId}-${i}`,
      propertyId,
      date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: ['09:00', '14:00', '16:00'][i],
      type: ['standard', 'premium', 'basic'][i],
      status: ['scheduled', 'confirmed', 'in-progress'][i],
      assignedEmployee: {
        id: `emp-${i}`,
        name: `Funcionário ${i + 1}`,
        rating: 4.5 + (i * 0.2),
      },
      estimatedDuration: [120, 180, 90][i],
      estimatedCost: [100.00, 150.00, 80.00][i],
    }));

    return NextResponse.json({
      success: true,
      data: mockSchedules,
      message: 'Agendamentos recuperados com sucesso',
    });

  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível recuperar os agendamentos',
      },
      { status: 500 }
    );
  }
}