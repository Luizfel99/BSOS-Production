import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const checklistId = id;
  const body = await request.json();
  
  // Mock response para finalizar checklist
  const submitResult = {
    success: true,
    checklistId: checklistId,
    completedAt: new Date().toISOString(),
    totalTime: body.totalTime || 90,
    completedTasks: body.completedTasks || 12,
    totalTasks: body.totalTasks || 15,
    score: body.score || 4.5,
    photos: body.photos || [],
    notes: body.notes || '',
    message: 'Checklist finalizado e enviado para revisão'
  };

  return NextResponse.json(submitResult);
}