import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const checklistId = id;
  
  // Mock data para checklist específico
  const checklist = {
    id: checklistId,
    appointmentId: checklistId,
    property: 'Apartamento 204 - Copacabana',
    address: 'Rua Barata Ribeiro, 540',
    type: 'check-out',
    status: 'pending',
    employee: {
      id: 'emp001',
      name: 'Maria Silva'
    },
    template: {
      id: 'template001',
      name: 'Checklist Apartamento Check-out'
    },
    items: [
      {
        id: 'item001',
        area: 'Sala de Estar',
        tasks: [
          { id: 'task001', description: 'Aspirar/varrer o piso', completed: false, photos: [] },
          { id: 'task002', description: 'Limpar superfícies', completed: false, photos: [] },
          { id: 'task003', description: 'Organizar almofadas', completed: false, photos: [] }
        ],
        completed: false
      },
      {
        id: 'item002',
        area: 'Cozinha',
        tasks: [
          { id: 'task004', description: 'Lavar louça', completed: false, photos: [] },
          { id: 'task005', description: 'Limpar bancada', completed: false, photos: [] },
          { id: 'task006', description: 'Limpar fogão', completed: false, photos: [] }
        ],
        completed: false
      }
    ],
    startedAt: null,
    completedAt: null,
    estimatedTime: 120,
    actualTime: null
  };

  return NextResponse.json(checklist);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const checklistId = id;
  const body = await request.json();
  
  if (body.action === 'start') {
    return NextResponse.json({
      success: true,
      checklistId: checklistId,
      startedAt: new Date().toISOString(),
      message: 'Checklist iniciado com sucesso'
    });
  }
  
  if (body.action === 'submit') {
    return NextResponse.json({
      success: true,
      checklistId: checklistId,
      completedAt: new Date().toISOString(),
      totalTime: body.totalTime || 90,
      score: body.score || 4.5,
      message: 'Checklist finalizado com sucesso'
    });
  }

  return NextResponse.json({
    success: false,
    message: 'Ação não reconhecida'
  }, { status: 400 });
}