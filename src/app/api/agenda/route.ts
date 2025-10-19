/**
 * 📅 API AGENDA INTELIGENTE
 * Endpoints para gestão de agendamentos com sincronização
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock data para demonstração
const mockAppointments = [
  {
    id: 'apt-001',
    propertyId: 'prop-001',
    propertyName: 'Apartamento Centro - Copacabana',
    address: 'Rua Barata Ribeiro, 123 - Copacabana',
    type: 'checkout',
    status: 'agendada',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '10:00',
    estimatedDuration: 90,
    assignedTeam: {
      leaderId: 'user-001',
      leaderName: 'Maria Silva',
      members: [{ id: 'user-002', name: 'João Santos' }]
    },
    platform: 'airbnb',
    guestInfo: {
      name: 'Carlos Mendes',
      checkOut: '2024-01-15T11:00:00Z',
      guests: 2
    },
    specialInstructions: 'Apartamento com pet - atenção para pelos',
    priority: 'high',
    location: { lat: -22.9068, lng: -43.1729, zone: 'copacabana' },
    materials: [
      { item: 'Detergente neutro', quantity: 1, confirmed: true },
      { item: 'Aspirador', quantity: 1, confirmed: false }
    ],
    checklist: {
      id: 'check-001',
      completed: false,
      totalItems: 15,
      completedItems: 8,
      photos: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apt-002',
    propertyId: 'prop-002',
    propertyName: 'Casa Inteira - Ipanema',
    address: 'Rua Visconde de Pirajá, 456 - Ipanema',
    type: 'checkin',
    status: 'em_andamento',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '14:00',
    estimatedDuration: 60,
    assignedTeam: {
      leaderId: 'user-003',
      leaderName: 'Ana Costa',
      members: []
    },
    platform: 'booking',
    guestInfo: {
      name: 'Família Rodriguez',
      checkIn: '2024-01-15T15:00:00Z',
      guests: 4
    },
    specialInstructions: 'Check-in especial - hóspedes VIP',
    priority: 'medium',
    location: { lat: -22.9838, lng: -43.2048, zone: 'ipanema' },
    materials: [
      { item: 'Kit boas-vindas', quantity: 1, confirmed: true },
      { item: 'Toalhas extras', quantity: 4, confirmed: true }
    ],
    checklist: {
      id: 'check-002',
      completed: true,
      totalItems: 10,
      completedItems: 10,
      photos: ['photo1.jpg', 'photo2.jpg']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/agenda - Buscar agendamentos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const view = searchParams.get('view') || 'day';
    const property = searchParams.get('property') || 'all';

    let filteredAppointments = mockAppointments;

    // Filtrar por data se modo dia
    if (view === 'day') {
      filteredAppointments = mockAppointments.filter(apt => apt.scheduledDate === date);
    }

    // Filtrar por propriedade se especificada
    if (property !== 'all') {
      filteredAppointments = filteredAppointments.filter(apt => apt.propertyId === property);
    }

    // Se modo semana, buscar toda a semana
    if (view === 'week') {
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        return day.toISOString().split('T')[0];
      });

      filteredAppointments = mockAppointments.filter(apt => 
        weekDates.includes(apt.scheduledDate)
      );
    }

    const summary = {
      total: filteredAppointments.length,
      byStatus: {
        agendada: filteredAppointments.filter(a => a.status === 'agendada').length,
        em_andamento: filteredAppointments.filter(a => a.status === 'em_andamento').length,
        concluida: filteredAppointments.filter(a => a.status === 'concluida').length,
        auditada: filteredAppointments.filter(a => a.status === 'auditada').length,
        paga: filteredAppointments.filter(a => a.status === 'paga').length
      },
      totalDuration: filteredAppointments.reduce((acc, apt) => acc + apt.estimatedDuration, 0)
    };

    return NextResponse.json({
      appointments: filteredAppointments,
      summary
    });

  } catch (error) {
    console.error('Erro na API agenda:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/agenda - Criar novo agendamento
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar dados obrigatórios
    const required = ['propertyId', 'type', 'scheduledDate', 'scheduledTime'];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Campo obrigatório: ${field}` },
          { status: 400 }
        );
      }
    }

    // Gerar novo agendamento
    const newAppointment = {
      id: `apt-${Date.now()}`,
      propertyId: data.propertyId,
      propertyName: data.propertyName || 'Nova Propriedade',
      address: data.address || 'Endereço não informado',
      type: data.type,
      status: 'agendada' as const,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      estimatedDuration: data.estimatedDuration || 90,
      assignedTeam: data.assignedTeam || {
        leaderId: '',
        leaderName: '',
        members: []
      },
      platform: data.platform || 'manual',
      guestInfo: data.guestInfo || null,
      specialInstructions: data.specialInstructions || '',
      priority: data.priority || 'medium',
      location: data.location || { lat: 0, lng: 0, zone: 'centro' },
      materials: data.materials || [],
      checklist: {
        id: `check-${Date.now()}`,
        completed: false,
        totalItems: 0,
        completedItems: 0,
        photos: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Em implementação real, salvar no banco
    // mockAppointments.push(newAppointment);

    return NextResponse.json({
      appointment: newAppointment,
      message: 'Agendamento criado com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
