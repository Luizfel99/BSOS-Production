import { NextRequest, NextResponse } from 'next/server';

// PUT /api/employees/[id]/performance
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employeeId = id;
    const body = await request.json();
    
    const { 
      bonus, 
      reason, 
      month, 
      year, 
      rating, 
      goals, 
      feedback,
      training_recommendations 
    } = body;

    // Validar dados obrigatórios
    if (!month || !year) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados obrigatórios ausentes',
          message: 'Mês e ano são obrigatórios',
        },
        { status: 400 }
      );
    }

    // Buscar performance atual
    // TODO: Verificar no banco de dados a performance atual
    const currentPerformance = {
      rating: 4.2,
      totalTasks: 45,
      completionRate: 0.96,
      averageTime: 125, // minutos
      customerSatisfaction: 4.6,
    };

    // Simular atualização no banco de dados
    const mockPerformanceUpdate = {
      id: `performance-${employeeId}-${year}-${month}`,
      employeeId,
      month,
      year,
      previousData: currentPerformance,
      updates: {
        bonus: bonus || 0,
        bonusReason: reason || null,
        managerRating: rating || null,
        goals: goals || [],
        feedback: feedback || null,
        trainingRecommendations: training_recommendations || [],
      },
      calculatedMetrics: {
        totalEarnings: 2400 + (bonus || 0), // Salário base + bônus
        productivityIndex: Math.min((currentPerformance.completionRate * 100), 100),
        improvementAreas: rating && rating < 4 ? ['Pontualidade', 'Comunicação'] : [],
        strengths: ['Qualidade do trabalho', 'Relacionamento com clientes'],
      },
      updatedAt: new Date().toISOString(),
      updatedBy: 'current-manager', // TODO: Pegar do JWT/session
    };

    console.log('📊 Performance atualizada:', mockPerformanceUpdate);

    // Simular ações baseadas na atualização
    const automaticActions = [];
    
    if (bonus && bonus > 0) {
      automaticActions.push(`💰 Bônus de R$ ${bonus.toFixed(2)} aprovado`);
      automaticActions.push('📧 Funcionário notificado sobre o bônus');
    }

    if (rating && rating >= 4.5) {
      automaticActions.push('🌟 Funcionário elegível para promoção');
    }

    if (training_recommendations && training_recommendations.length > 0) {
      automaticActions.push('📚 Plano de treinamento personalizado criado');
    }

    return NextResponse.json({
      success: true,
      data: {
        performance: mockPerformanceUpdate,
        automaticActions,
        nextSteps: [
          'Agendar reunião 1:1 com o funcionário',
          'Revisar metas para o próximo mês',
          'Acompanhar progresso das recomendações',
        ],
      },
      message: 'Performance atualizada com sucesso!',
    });

  } catch (error) {
    console.error('Erro ao atualizar performance:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível atualizar a performance',
      },
      { status: 500 }
    );
  }
}

// GET /api/employees/[id]/performance - Buscar histórico de performance
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employeeId = id;
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    // Simular histórico de performance
    const mockPerformanceHistory = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const baseRating = 4.0 + Math.random() * 1.0;
      
      return {
        id: `performance-${employeeId}-${year}-${month}`,
        employeeId,
        month,
        year: parseInt(year),
        metrics: {
          rating: Math.round(baseRating * 10) / 10,
          tasksCompleted: Math.floor(Math.random() * 20) + 30,
          completionRate: 0.85 + Math.random() * 0.15,
          averageTime: Math.floor(Math.random() * 60) + 90,
          customerSatisfaction: Math.round((4.0 + Math.random() * 1.0) * 10) / 10,
          punctuality: 0.9 + Math.random() * 0.1,
        },
        earnings: {
          baseSalary: 2400,
          bonus: Math.random() > 0.6 ? Math.floor(Math.random() * 200) + 50 : 0,
          total: 2400 + (Math.random() > 0.6 ? Math.floor(Math.random() * 200) + 50 : 0),
        },
        feedback: month % 3 === 0 ? `Excelente performance em ${month}/${year}` : null,
        goals: month === 1 ? ['Melhorar pontualidade', 'Aumentar satisfação do cliente'] : [],
      };
    });

    // Calcular estatísticas anuais
    const yearlyStats = {
      averageRating: mockPerformanceHistory.reduce((acc, p) => acc + p.metrics.rating, 0) / 12,
      totalTasks: mockPerformanceHistory.reduce((acc, p) => acc + p.metrics.tasksCompleted, 0),
      totalEarnings: mockPerformanceHistory.reduce((acc, p) => acc + p.earnings.total, 0),
      totalBonus: mockPerformanceHistory.reduce((acc, p) => acc + p.earnings.bonus, 0),
      averageCompletionRate: mockPerformanceHistory.reduce((acc, p) => acc + p.metrics.completionRate, 0) / 12,
    };

    return NextResponse.json({
      success: true,
      data: {
        performance: mockPerformanceHistory.filter(p => p.month <= new Date().getMonth() + 1),
        yearlyStats,
        ranking: Math.floor(Math.random() * 20) + 1, // Posição no ranking geral
        totalEmployees: 45,
      },
      message: 'Histórico de performance recuperado com sucesso',
    });

  } catch (error) {
    console.error('Erro ao buscar performance:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível recuperar o histórico de performance',
      },
      { status: 500 }
    );
  }
}