import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const checklistId = id;
  const body = await request.json();
  
  // Mock response para iniciar checklist
  const startResult = {
    success: true,
    checklistId: checklistId,
    startedAt: new Date().toISOString(),
    employee: body.employee || 'Maria Silva',
    message: 'Checklist iniciado com sucesso'
  };

  return NextResponse.json(startResult);
}