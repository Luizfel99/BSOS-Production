import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || new Date().toISOString().slice(0, 7);

    // Mock payment data
    const payments = [
      {
        id: 'pay-001',
        employeeId: 'emp-001',
        employeeName: 'Ana Silva',
        period: period,
        baseSalary: 2500,
        cleaningBonus: 450,
        performanceBonus: 200,
        tips: 125,
        deductions: 50,
        totalAmount: 3225,
        status: 'paid',
        paymentDate: '2025-10-05',
        paymentMethod: 'bank_transfer',
        details: {
          cleaningsCompleted: 18,
          averageRating: 4.8,
          punctualityBonus: 100,
          overtimeHours: 2,
          overtimePay: 100
        }
      },
      {
        id: 'pay-002',
        employeeId: 'emp-002',
        employeeName: 'Carlos Santos',
        period: period,
        baseSalary: 2300,
        cleaningBonus: 380,
        performanceBonus: 150,
        tips: 90,
        deductions: 25,
        totalAmount: 2895,
        status: 'pending',
        paymentDate: null,
        paymentMethod: 'pix',
        details: {
          cleaningsCompleted: 15,
          averageRating: 4.5,
          punctualityBonus: 50,
          overtimeHours: 0,
          overtimePay: 0
        }
      },
      {
        id: 'pay-003',
        employeeId: 'emp-003',
        employeeName: 'Maria Costa',
        period: period,
        baseSalary: 2800,
        cleaningBonus: 520,
        performanceBonus: 300,
        tips: 180,
        deductions: 75,
        totalAmount: 3725,
        status: 'paid',
        paymentDate: '2025-10-05',
        paymentMethod: 'bank_transfer',
        details: {
          cleaningsCompleted: 22,
          averageRating: 4.9,
          punctualityBonus: 150,
          overtimeHours: 4,
          overtimePay: 200
        }
      }
    ];

    return NextResponse.json({
      success: true,
      payments,
      summary: {
        totalPayments: payments.length,
        totalAmount: payments.reduce((sum, p) => sum + p.totalAmount, 0),
        paidAmount: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.totalAmount, 0),
        pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.totalAmount, 0),
        averagePayment: payments.reduce((sum, p) => sum + p.totalAmount, 0) / payments.length
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newPayment = {
      id: `pay-${Date.now()}`,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      payment: newPayment,
      message: 'Payment created successfully'
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
