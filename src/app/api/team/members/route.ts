import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Mock data para membros da equipe
  const teamMembers = [
    {
      id: 'emp001',
      name: 'Maria Silva',
      phone: '(21) 99999-1111',
      skills: ['limpeza-residencial', 'airbnb'],
      zones: ['zona-sul', 'copacabana', 'ipanema'],
      maxDailyTasks: 4,
      currentTasks: 2,
      rating: 4.8,
      isAvailable: true,
      location: {
        lat: -22.9068,
        lng: -43.1729
      }
    },
    {
      id: 'emp002',
      name: 'João Santos',
      phone: '(21) 99999-2222',
      skills: ['airbnb', 'limpeza-pesada'],
      zones: ['copacabana', 'leblon'],
      maxDailyTasks: 3,
      currentTasks: 3,
      rating: 4.6,
      isAvailable: false,
      location: {
        lat: -22.9711,
        lng: -43.1822
      }
    },
    {
      id: 'emp003',
      name: 'Ana Costa',
      phone: '(21) 99999-3333',
      skills: ['limpeza-comercial', 'supervisao'],
      zones: ['ipanema', 'leblon', 'lagoa'],
      maxDailyTasks: 5,
      currentTasks: 1,
      rating: 4.9,
      isAvailable: true,
      location: {
        lat: -22.9844,
        lng: -43.1964
      }
    },
    {
      id: 'emp004',
      name: 'Carlos Lima',
      phone: '(21) 99999-4444',
      skills: ['supervisao', 'manutencao'],
      zones: ['barra', 'recreio'],
      maxDailyTasks: 3,
      currentTasks: 1,
      rating: 4.7,
      isAvailable: true,
      location: {
        lat: -23.0045,
        lng: -43.3137
      }
    },
    {
      id: 'emp005',
      name: 'Fernanda Oliveira',
      phone: '(21) 99999-5555',
      skills: ['limpeza-pesada', 'pos-obra'],
      zones: ['tijuca', 'vila-isabel'],
      maxDailyTasks: 2,
      currentTasks: 0,
      rating: 4.5,
      isAvailable: true,
      location: {
        lat: -22.9249,
        lng: -43.2309
      }
    }
  ];

  return NextResponse.json(teamMembers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Simular diferentes ações para membros da equipe
  switch (body.action) {
    case 'update_status':
      return NextResponse.json({
        success: true,
        memberId: body.memberId,
        newStatus: body.status,
        message: 'Status atualizado com sucesso'
      });
      
    case 'assign_task':
      return NextResponse.json({
        success: true,
        memberId: body.memberId,
        taskId: body.taskId,
        message: 'Tarefa atribuída com sucesso'
      });
      
    default:
      return NextResponse.json({
        success: false,
        message: 'Ação não reconhecida'
      }, { status: 400 });
  }
}
