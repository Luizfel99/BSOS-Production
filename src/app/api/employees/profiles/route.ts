/**
 * API dos Perfis Individuais dos Funcionários
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock data dos funcionários
const mockEmployees = [
  {
    id: 'emp-001',
    name: 'Maria Santos',
    email: 'maria@brightshine.com',
    phone: '(11) 99999-1234',
    photo: '/avatars/maria.jpg',
    role: 'leader',
    joinDate: '2023-01-15',
    status: 'active',
    skills: ['Limpeza Profunda', 'Organização', 'Liderança', 'Produtos Químicos'],
    zones: ['Zona Sul', 'Centro'],
    
    totalCleanings: 156,
    averageRating: 4.8,
    monthlyRating: 4.9,
    clientRatings: 4.7,
    supervisorRatings: 4.9,
    
    monthlyBonus: 250,
    totalEarnings: 12450,
    lastPayment: '2024-10-01',
    pendingPayments: 0,
    
    completedTrainings: 8,
    certifications: ['Segurança', 'Produtos Eco-friendly', 'Liderança'],
    trainingProgress: 95,
    
    monthlyGoal: 50,
    currentProgress: 42,
    
    recentCleanings: [
      {
        id: 'clean-001',
        propertyName: 'Apartamento Vila Madalena',
        date: '2024-10-07',
        type: 'Limpeza Profunda',
        rating: 5.0,
        clientFeedback: 'Excelente trabalho! Muito detalhista.',
        bonus: 50
      },
      {
        id: 'clean-002',
        propertyName: 'Casa Jardins',
        date: '2024-10-06',
        type: 'Limpeza Standard',
        rating: 4.8,
        clientFeedback: 'Ótimo serviço, pontual e eficiente.',
        bonus: 30
      }
    ],
    
    achievements: [
      {
        id: 'ach-001',
        title: 'Funcionária do Mês',
        description: 'Melhor performance em setembro',
        earnedDate: '2024-09-30',
        icon: '👑'
      },
      {
        id: 'ach-002',
        title: 'Excelência em Qualidade',
        description: '10 avaliações 5 estrelas consecutivas',
        earnedDate: '2024-09-25',
        icon: '⭐'
      }
    ],
    
    unreadMessages: 2,
    lastActivity: '2 horas atrás'
  },
  {
    id: 'emp-002',
    name: 'Ana Paula Silva',
    email: 'ana@brightshine.com',
    phone: '(11) 99999-5678',
    photo: '/avatars/ana.jpg',
    role: 'cleaner',
    joinDate: '2023-03-10',
    status: 'active',
    skills: ['Limpeza Residencial', 'Organização', 'Pontualidade'],
    zones: ['Zona Norte', 'Zona Leste'],
    
    totalCleanings: 98,
    averageRating: 4.6,
    monthlyRating: 4.7,
    clientRatings: 4.5,
    supervisorRatings: 4.7,
    
    monthlyBonus: 150,
    totalEarnings: 8750,
    lastPayment: '2024-10-01',
    pendingPayments: 350,
    
    completedTrainings: 5,
    certifications: ['Segurança', 'Limpeza Básica'],
    trainingProgress: 70,
    
    monthlyGoal: 40,
    currentProgress: 28,
    
    recentCleanings: [
      {
        id: 'clean-003',
        propertyName: 'Studio Moema',
        date: '2024-10-07',
        type: 'Limpeza Standard',
        rating: 4.5,
        clientFeedback: 'Bom trabalho, mas pode melhorar na organização.',
        bonus: 0
      }
    ],
    
    achievements: [
      {
        id: 'ach-003',
        title: 'Pontualidade Perfeita',
        description: '30 dias sem atraso',
        earnedDate: '2024-09-20',
        icon: '⏰'
      }
    ],
    
    unreadMessages: 0,
    lastActivity: '5 horas atrás'
  },
  {
    id: 'emp-003',
    name: 'Carlos Oliveira',
    email: 'carlos@brightshine.com',
    phone: '(11) 99999-9999',
    photo: '/avatars/carlos.jpg',
    role: 'supervisor',
    joinDate: '2022-11-01',
    status: 'active',
    skills: ['Supervisão', 'Treinamento', 'Qualidade', 'Gestão de Equipe'],
    zones: ['Todas'],
    
    totalCleanings: 0, // Supervisor não faz limpezas diretas
    averageRating: 4.9,
    monthlyRating: 4.9,
    clientRatings: 0,
    supervisorRatings: 4.9,
    
    monthlyBonus: 400,
    totalEarnings: 18500,
    lastPayment: '2024-10-01',
    pendingPayments: 0,
    
    completedTrainings: 12,
    certifications: ['Liderança', 'Gestão', 'Treinamento', 'Qualidade'],
    trainingProgress: 100,
    
    monthlyGoal: 0, // Meta baseada em supervisão
    currentProgress: 100,
    
    recentCleanings: [], // Supervisor não tem limpezas
    
    achievements: [
      {
        id: 'ach-004',
        title: 'Mentor Excepcional',
        description: 'Treinou 5 novos funcionários com sucesso',
        earnedDate: '2024-09-15',
        icon: '🎓'
      }
    ],
    
    unreadMessages: 5,
    lastActivity: '30 minutos atrás'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    
    let filteredEmployees = mockEmployees;
    
    if (role && role !== 'all') {
      filteredEmployees = filteredEmployees.filter(emp => emp.role === role);
    }
    
    if (status && status !== 'all') {
      filteredEmployees = filteredEmployees.filter(emp => emp.status === status);
    }
    
    return NextResponse.json({
      success: true,
      employees: filteredEmployees,
      total: filteredEmployees.length,
      summary: {
        totalEmployees: mockEmployees.length,
        activeEmployees: mockEmployees.filter(e => e.status === 'active').length,
        highPerformers: mockEmployees.filter(e => e.averageRating >= 4.5).length,
        totalMonthlyBonus: mockEmployees.reduce((acc, e) => acc + e.monthlyBonus, 0)
      }
    });
    
  } catch (error) {
    console.error('Erro na API de perfis:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, employeeId, data } = body;
    
    switch (action) {
      case 'update_profile':
        // Lógica para atualizar perfil
        return NextResponse.json({
          success: true,
          message: 'Perfil atualizado com sucesso'
        });
        
      case 'add_achievement':
        // Lógica para adicionar conquista
        return NextResponse.json({
          success: true,
          message: 'Conquista adicionada com sucesso'
        });
        
      case 'update_status':
        // Lógica para atualizar status
        return NextResponse.json({
          success: true,
          message: 'Status atualizado com sucesso'
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Ação não reconhecida' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Erro na API de perfis (POST):', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
