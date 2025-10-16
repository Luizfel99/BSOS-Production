/**
 * API: Admin Employees - Gestão de funcionários
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || new Date().toISOString().slice(0, 7);

    // Mock data - em produção viria do banco de dados
    const employees = [
      {
        id: 'emp-001',
        name: 'Ana Costa',
        photo: '/avatars/ana-costa.jpg',
        role: 'cleaner',
        cleaningsCompleted: 45,
        avgTimePerCleaning: 72,
        avgRating: 4.9,
        efficiency: 95,
        revenue: 12500,
        complaints: 0,
        absences: 1,
        status: 'active'
      },
      {
        id: 'emp-002',
        name: 'João Santos',
        photo: '/avatars/joao-santos.jpg',
        role: 'cleaner',
        cleaningsCompleted: 42,
        avgTimePerCleaning: 78,
        avgRating: 4.7,
        efficiency: 88,
        revenue: 11800,
        complaints: 1,
        absences: 0,
        status: 'active'
      },
      {
        id: 'emp-003',
        name: 'Lucia Fernandes',
        photo: '/avatars/lucia-fernandes.jpg',
        role: 'supervisor',
        cleaningsCompleted: 38,
        avgTimePerCleaning: 65,
        avgRating: 4.8,
        efficiency: 92,
        revenue: 15200,
        complaints: 0,
        absences: 2,
        status: 'active'
      },
      {
        id: 'emp-004',
        name: 'Pedro Lima',
        photo: '/avatars/pedro-lima.jpg',
        role: 'cleaner',
        cleaningsCompleted: 40,
        avgTimePerCleaning: 75,
        avgRating: 4.6,
        efficiency: 85,
        revenue: 11200,
        complaints: 2,
        absences: 1,
        status: 'vacation'
      },
      {
        id: 'emp-005',
        name: 'Carla Rodrigues',
        photo: '/avatars/carla-rodrigues.jpg',
        role: 'cleaner',
        cleaningsCompleted: 35,
        avgTimePerCleaning: 80,
        avgRating: 4.5,
        efficiency: 82,
        revenue: 9800,
        complaints: 1,
        absences: 3,
        status: 'active'
      },
      {
        id: 'emp-006',
        name: 'Marcos Silva',
        photo: '/avatars/marcos-silva.jpg',
        role: 'manager',
        cleaningsCompleted: 28,
        avgTimePerCleaning: 60,
        avgRating: 4.9,
        efficiency: 98,
        revenue: 18500,
        complaints: 0,
        absences: 0,
        status: 'active'
      }
    ];

    return NextResponse.json({
      success: true,
      employees,
      total: employees.length,
      period,
      summary: {
        totalActive: employees.filter(e => e.status === 'active').length,
        totalOnVacation: employees.filter(e => e.status === 'vacation').length,
        avgPerformance: employees.reduce((acc, e) => acc + e.efficiency, 0) / employees.length,
        totalComplaints: employees.reduce((acc, e) => acc + e.complaints, 0)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica
    const { name, role, email, phone } = body;
    if (!name || !role || !email) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Em produção, salvaria no banco de dados
    const newEmployee = {
      id: `emp-${Date.now()}`,
      name,
      role,
      email,
      phone,
      photo: '/avatars/default.png',
      cleaningsCompleted: 0,
      avgTimePerCleaning: 0,
      avgRating: 0,
      efficiency: 0,
      revenue: 0,
      complaints: 0,
      absences: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      employee: newEmployee,
      message: 'Funcionário criado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
