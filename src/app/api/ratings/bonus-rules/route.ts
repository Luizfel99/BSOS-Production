/**
 * API das Regras de Bônus
 */

import { NextRequest, NextResponse } from 'next/server';

const mockBonusRules = [
  {
    id: 'rule-001',
    name: 'Excelência Total',
    description: 'Bônus para avaliações excepcionais (≥4.8)',
    ratingThreshold: 4.8,
    bonusAmount: 50,
    bonusType: 'fixed',
    active: true,
    conditions: ['Nota mínima 4.8', 'Sem reclamações', 'Pontualidade'],
    timesApplied: 156,
    totalAmountGiven: 7800
  },
  {
    id: 'rule-002',
    name: 'Alta Performance',
    description: 'Bônus para alta performance (4.5-4.7)',
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
    description: 'Bônus básico para performance adequada (4.0-4.4)',
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
    name: 'Bônus Pontualidade',
    description: '15% extra para funcionários pontuais',
    ratingThreshold: 0,
    bonusAmount: 15,
    bonusType: 'percentage',
    active: true,
    conditions: ['Zero atrasos no mês', 'Todas as limpezas no horário'],
    timesApplied: 89,
    totalAmountGiven: 2340
  },
  {
    id: 'rule-005',
    name: 'Cliente VIP',
    description: 'Bônus extra para limpezas em propriedades VIP',
    ratingThreshold: 4.0,
    bonusAmount: 25,
    bonusType: 'fixed',
    active: true,
    conditions: ['Propriedade marcada como VIP', 'Nota mínima 4.0'],
    timesApplied: 67,
    totalAmountGiven: 1675
  },
  {
    id: 'rule-006',
    name: 'Limpeza Profunda Premium',
    description: '20% extra para limpezas profundas',
    ratingThreshold: 4.2,
    bonusAmount: 20,
    bonusType: 'percentage',
    active: true,
    conditions: ['Tipo: Limpeza Profunda', 'Nota mínima 4.2', 'Sem retrabalho'],
    timesApplied: 134,
    totalAmountGiven: 4820
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const type = searchParams.get('type');
    
    let filteredRules = mockBonusRules;
    
    if (active === 'true') {
      filteredRules = filteredRules.filter(rule => rule.active);
    } else if (active === 'false') {
      filteredRules = filteredRules.filter(rule => !rule.active);
    }
    
    if (type && type !== 'all') {
      filteredRules = filteredRules.filter(rule => rule.bonusType === type);
    }
    
    // Estatísticas das regras
    const stats = {
      totalRules: filteredRules.length,
      activeRules: filteredRules.filter(r => r.active).length,
      totalBonusesGiven: filteredRules.reduce((acc, r) => acc + r.totalAmountGiven, 0),
      totalApplications: filteredRules.reduce((acc, r) => acc + r.timesApplied, 0),
      averageBonusPerApplication: filteredRules.reduce((acc, r) => acc + r.totalAmountGiven, 0) / 
                                  filteredRules.reduce((acc, r) => acc + r.timesApplied, 0) || 0
    };
    
    return NextResponse.json({
      success: true,
      rules: filteredRules,
      statistics: stats
    });
    
  } catch (error) {
    console.error('Erro na API de regras de bônus:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ruleId, data } = body;
    
    switch (action) {
      case 'create_rule':
        const newRule = {
          id: `rule-${Date.now()}`,
          ...data,
          timesApplied: 0,
          totalAmountGiven: 0
        };
        
        return NextResponse.json({
          success: true,
          rule: newRule,
          message: 'Regra de bônus criada com sucesso'
        });
        
      case 'update_rule':
        return NextResponse.json({
          success: true,
          message: 'Regra de bônus atualizada com sucesso'
        });
        
      case 'toggle_rule':
        return NextResponse.json({
          success: true,
          message: 'Status da regra alterado com sucesso'
        });
        
      case 'delete_rule':
        return NextResponse.json({
          success: true,
          message: 'Regra de bônus excluída com sucesso'
        });
        
      case 'calculate_bonus':
        const { rating, cleaningType, employeeType, propertyType } = data;
        
        // Aplicar regras em ordem de prioridade
        let totalBonus = 0;
        const appliedRules = [];
        
        for (const rule of mockBonusRules.filter(r => r.active)) {
          let applies = false;
          
          // Verificar se a regra se aplica
          if (rule.ratingThreshold > 0 && rating >= rule.ratingThreshold) {
            applies = true;
          }
          
          // Verificar condições específicas
          if (rule.id === 'rule-005' && propertyType !== 'vip') {
            applies = false;
          }
          
          if (rule.id === 'rule-006' && cleaningType !== 'deep') {
            applies = false;
          }
          
          if (applies) {
            let bonusAmount = 0;
            
            if (rule.bonusType === 'fixed') {
              bonusAmount = rule.bonusAmount;
            } else if (rule.bonusType === 'percentage') {
              const baseAmount = cleaningType === 'premium' ? 200 : 100;
              bonusAmount = (baseAmount * rule.bonusAmount) / 100;
            }
            
            totalBonus += bonusAmount;
            appliedRules.push({
              ruleId: rule.id,
              ruleName: rule.name,
              bonusAmount,
              reason: rule.description
            });
          }
        }
        
        return NextResponse.json({
          success: true,
          totalBonus,
          appliedRules,
          breakdown: appliedRules
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Ação não reconhecida' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Erro na API de regras de bônus (POST):', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
