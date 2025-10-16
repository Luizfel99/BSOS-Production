import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appointmentId = id;
  const body = await request.json();
  
  // Mock data para atualização de agendamento
  const updateResult = {
    success: true,
    appointmentId: appointmentId,
    updatedFields: body,
    updatedAt: new Date().toISOString(),
    message: 'Agendamento atualizado com sucesso'
  };

  return NextResponse.json(updateResult);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appointmentId = id;
  
  // Mock data para buscar agendamento específico
  const appointment = {
    id: appointmentId,
    property: 'Apartamento 204 - Copacabana',
    address: 'Rua Barata Ribeiro, 540',
    type: 'check-out',
    date: '2025-10-09',
    time: '09:00',
    duration: 120,
    status: 'confirmado',
    employee: {
      id: 'emp001',
      name: 'Maria Silva',
      phone: '(21) 99999-1111'
    },
    client: {
      name: 'Roberto Santos',
      phone: '(21) 88888-1111',
      email: 'roberto@email.com'
    },
    notes: 'Apartamento com 2 quartos, atenção especial na cozinha',
    checklist: ['Aspirar', 'Limpar banheiros', 'Trocar roupas de cama'],
    price: 150.00
  };

  return NextResponse.json(appointment);
}