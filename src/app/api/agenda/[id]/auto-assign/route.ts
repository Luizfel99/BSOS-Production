import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appointmentId = id;
  const body = await request.json();
  
  // Mock data para auto-atribuição
  const autoAssignResult = {
    success: true,
    appointmentId: appointmentId,
    assignedEmployee: {
      id: 'emp001',
      name: 'Maria Silva',
      rating: 4.8,
      location: 'Zona Sul - RJ',
      estimatedArrival: '09:30'
    },
    reason: 'Funcionária com melhor avaliação e disponibilidade na região',
    message: 'Funcionária atribuída automaticamente com sucesso'
  };

  // Simular tempo de processamento
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json(autoAssignResult);
}