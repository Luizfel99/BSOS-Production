/**
 * API: Admin Stats - Estatísticas gerais administrativas
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || new Date().toISOString().slice(0, 7);

    // Mock data - em produção viria do banco de dados
    const stats = {
      overview: {
        totalProperties: 247,
        totalClients: 189,
        totalEmployees: 45,
        totalCleanings: 1856,
        activeBookings: 124,
        pendingApprovals: 8
      },
      financial: {
        totalRevenue: 485000,
        netProfit: 125000,
        totalExpenses: 360000,
        avgRevenuePerProperty: 1965,
        monthlyGrowth: 12.5,
        unpaidInvoices: 25000
      },
      performance: {
        avgCleaningTime: 75,
        clientSatisfaction: 4.7,
        employeePerformance: 92,
        completionRate: 98.5,
        complaintRate: 2.1,
        revisitRate: 3.8
      }
    };

    return NextResponse.json({
      success: true,
      stats,
      period,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas admin:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
