import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || new Date().toISOString().slice(0, 7);

    // Mock employee payment data
    const employees = [
      {
        id: 'emp-001',
        name: 'Ana Silva',
        email: 'ana.silva@email.com',
        role: 'Faxineiro',
        period: period,
        paymentInfo: {
          baseSalary: 2500,
          totalEarnings: 3225,
          cleaningsCompleted: 18,
          averageRating: 4.8,
          bonuses: {
            performance: 200,
            punctuality: 100,
            volume: 150
          },
          deductions: {
            taxes: 25,
            advances: 25
          },
          tips: 125,
          status: 'paid',
          lastPayment: '2025-10-05'
        }
      },
      {
        id: 'emp-002',
        name: 'Carlos Santos',
        email: 'carlos.santos@email.com',
        role: 'Faxineiro',
        period: period,
        paymentInfo: {
          baseSalary: 2300,
          totalEarnings: 2895,
          cleaningsCompleted: 15,
          averageRating: 4.5,
          bonuses: {
            performance: 150,
            punctuality: 50,
            volume: 0
          },
          deductions: {
            taxes: 25,
            advances: 0
          },
          tips: 90,
          status: 'pending',
          lastPayment: null
        }
      },
      {
        id: 'emp-003',
        name: 'Maria Costa',
        email: 'maria.costa@email.com',
        role: 'Supervisor',
        period: period,
        paymentInfo: {
          baseSalary: 2800,
          totalEarnings: 3725,
          cleaningsCompleted: 22,
          averageRating: 4.9,
          bonuses: {
            performance: 300,
            punctuality: 150,
            volume: 150
          },
          deductions: {
            taxes: 50,
            advances: 25
          },
          tips: 180,
          status: 'paid',
          lastPayment: '2025-10-05'
        }
      }
    ];

    return NextResponse.json({
      success: true,
      employees,
      summary: {
        totalEmployees: employees.length,
        paidEmployees: employees.filter(e => e.paymentInfo.status === 'paid').length,
        pendingEmployees: employees.filter(e => e.paymentInfo.status === 'pending').length,
        totalPayroll: employees.reduce((sum, e) => sum + e.paymentInfo.totalEarnings, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching employee payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employee payments' },
      { status: 500 }
    );
  }
}
