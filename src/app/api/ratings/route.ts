/**
 * API do Sistema de Pontuação e Avaliações
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock data das avaliações
const mockRatings = [
  {
    id: 'rating-001',
    cleaningId: 'clean-001',
    employeeId: 'emp-001',
    employeeName: 'Maria Santos',
    propertyName: 'Apartamento Vila Madalena',
    date: '2024-10-07',
    
    clientRating: 5.0,
    supervisorRating: 4.8,
    finalRating: 4.9,
    
    clientFeedback: 'Excelente trabalho! Muito detalhista e caprichosa.',
    supervisorFeedback: 'Ótima execução, seguiu todos os protocolos.',
    
    criteria: {
      quality: 5,
      punctuality: 5,
      professionalism: 5,
      communication: 4,
      efficiency: 5
    },
    
    bonusApplied: 50,
    bonusReason: 'Avaliação excepcional (>4.8)',
    penalties: 0,
    penaltyReason: '',
    
    status: 'completed',
    autoCalculated: true
  },
  {
    id: 'rating-002',
    cleaningId: 'clean-002',
    employeeId: 'emp-002',
    employeeName: 'Ana Paula Silva',
    propertyName: 'Casa Jardins',
    date: '2024-10-07',
    
    clientRating: 4.0,
    supervisorRating: 4.5,
    finalRating: 4.2,
    
    clientFeedback: 'Bom trabalho, mas pode melhorar na organização.',
    supervisorFeedback: 'Técnica boa, precisa ser mais atenta aos detalhes.',
    
    criteria: {
      quality: 4,
      punctuality: 5,
      professionalism: 4,
      communication: 4,
      efficiency: 4
    },
    
    bonusApplied: 25,
    bonusReason: 'Avaliação boa (>4.0)',
    penalties: 0,
    penaltyReason: '',
    
    status: 'completed',
    autoCalculated: true
  },
  {
    id: 'rating-003',
    cleaningId: 'clean-003',
    employeeId: 'emp-001',
    employeeName: 'Maria Santos',
    propertyName: 'Studio Moema',
    date: '2024-10-06',
    
    clientRating: 4.8,
    supervisorRating: 4.9,
    finalRating: 4.85,
    
    clientFeedback: 'Sempre impecável! Recomendo muito.',
    supervisorFeedback: 'Padrão de excelência mantido.',
    
    criteria: {
      quality: 5,
      punctuality: 5,
      professionalism: 5,
      communication: 5,
      efficiency: 4
    },
    
    bonusApplied: 45,
    bonusReason: 'Avaliação excepcional (>4.8)',
    penalties: 0,
    penaltyReason: '',
    
    status: 'pending',
    autoCalculated: true
  }
];

const mockMonthlyPerformances = [
  {
    employeeId: 'emp-001',
    employeeName: 'Maria Santos',
    month: '2024-10',
    
    totalRatings: 12,
    averageRating: 4.8,
    clientAverage: 4.7,
    supervisorAverage: 4.9,
    
    totalCleanings: 12,
    qualityScore: 96,
    consistencyScore: 94,
    
    bonusEarned: 340,
    penaltiesApplied: 0,
    netBonus: 340,
    
    trend: 'up',
    previousMonthRating: 4.6,
    improvement: 0.2
  },
  {
    employeeId: 'emp-002',
    employeeName: 'Ana Paula Silva',
    month: '2024-10',
    
    totalRatings: 8,
    averageRating: 4.3,
    clientAverage: 4.2,
    supervisorAverage: 4.4,
    
    totalCleanings: 8,
    qualityScore: 85,
    consistencyScore: 78,
    
    bonusEarned: 120,
    penaltiesApplied: 25,
    netBonus: 95,
    
    trend: 'stable',
    previousMonthRating: 4.3,
    improvement: 0.0
  }
];

const mockBonusRules = [
  {
    id: 'rule-001',
    name: 'Excelência Total',
    description: 'Avaliação média igual ou superior a 4.8',
    ratingThreshold: 4.8,
    bonusAmount: 50,
    bonusType: 'fixed',
    active: true,
    conditions: ['Nota mínima 4.8', 'Sem reclamações'],
    timesApplied: 156,
    totalAmountGiven: 7800
  },
  {
    id: 'rule-002',
    name: 'Alta Performance',
    description: 'Avaliação média entre 4.5 e 4.7',
    ratingThreshold: 4.5,
    bonusAmount: 30,
    bonusType: 'fixed',
    active: true,
    conditions: ['Nota entre 4.5-4.7', 'Pontualidade'],
    timesApplied: 298,
    totalAmountGiven: 8940
  },
  {
    id: 'rule-003',
    name: 'Performance Satisfatória',
    description: 'Avaliação média entre 4.0 e 4.4',
    ratingThreshold: 4.0,
    bonusAmount: 15,
    bonusType: 'fixed',
    active: true,
    conditions: ['Nota entre 4.0-4.4'],
    timesApplied: 187,
    totalAmountGiven: 2805
  },
  {
    id: 'rule-004',
    name: 'Bônus por Pontualidade',
    description: '15% extra para funcionários pontuais',
    ratingThreshold: 0,
    bonusAmount: 15,
    bonusType: 'percentage',
    active: true,
    conditions: ['Zero atrasos no mês'],
    timesApplied: 89,
    totalAmountGiven: 2340
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || '2024-10';
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');
    
    let filteredRatings = mockRatings;
    let filteredPerformances = mockMonthlyPerformances;
    
    // Filtrar por funcionário
    if (employeeId && employeeId !== 'all') {
      filteredRatings = filteredRatings.filter(r => r.employeeId === employeeId);
      filteredPerformances = filteredPerformances.filter(p => p.employeeId === employeeId);
    }
    
    // Filtrar por status
    if (status && status !== 'all') {
      filteredRatings = filteredRatings.filter(r => r.status === status);
    }
    
    // Estatísticas do período
    const stats = {
      totalRatings: filteredRatings.length,
      averageRating: filteredRatings.length > 0 
        ? filteredRatings.reduce((acc, r) => acc + r.finalRating, 0) / filteredRatings.length 
        : 0,
      totalBonuses: filteredRatings.reduce((acc, r) => acc + r.bonusApplied, 0),
      highPerformanceCount: filteredRatings.filter(r => r.finalRating >= 4.5).length,
      pendingApprovals: filteredRatings.filter(r => r.status === 'pending').length,
      disputedRatings: filteredRatings.filter(r => r.status === 'disputed').length
    };
    
    return NextResponse.json({
      success: true,
      ratings: filteredRatings,
      monthlyPerformances: filteredPerformances,
      statistics: stats,
      period: month
    });
    
  } catch (error) {
    console.error('Erro na API de avaliações:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ratingId, employeeId, data } = body;
    
    switch (action) {
      case 'create_rating':
        // Lógica para criar nova avaliação
        const newRating = {
          id: `rating-${Date.now()}`,
          ...data,
          status: 'pending',
          autoCalculated: true
        };
        
        return NextResponse.json({
          success: true,
          rating: newRating,
          message: 'Avaliação criada com sucesso'
        });
        
      case 'auto_calculate_bonus':
        // Lógica para calcular bônus automaticamente
        const { rating, cleaningType } = data;
        let bonusAmount = 0;
        let bonusReason = '';
        
        if (rating >= 4.8) {
          bonusAmount = 50;
          bonusReason = 'Avaliação excepcional (≥4.8)';
        } else if (rating >= 4.5) {
          bonusAmount = 30;
          bonusReason = 'Alta performance (≥4.5)';
        } else if (rating >= 4.0) {
          bonusAmount = 15;
          bonusReason = 'Performance satisfatória (≥4.0)';
        }
        
        return NextResponse.json({
          success: true,
          bonusAmount,
          bonusReason,
          appliedRules: mockBonusRules.filter(rule => 
            rule.active && rating >= rule.ratingThreshold
          )
        });
        
      case 'process_monthly_bonuses':
        // Lógica para processar bônus mensais
        const monthlyBonuses = mockMonthlyPerformances.map(performance => ({
          employeeId: performance.employeeId,
          employeeName: performance.employeeName,
          totalBonus: performance.netBonus,
          breakdown: {
            performance: performance.bonusEarned,
            penalties: performance.penaltiesApplied,
            net: performance.netBonus
          }
        }));
        
        return NextResponse.json({
          success: true,
          monthlyBonuses,
          totalAmount: monthlyBonuses.reduce((acc, b) => acc + b.totalBonus, 0),
          message: 'Bônus mensais processados com sucesso'
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Ação não reconhecida' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Erro na API de avaliações (POST):', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
