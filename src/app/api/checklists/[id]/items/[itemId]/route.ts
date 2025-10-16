import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id, itemId } = await params;
  const checklistId = id;
  const body = await request.json();
  
  // Mock response para atualizar item do checklist
  const updateResult = {
    success: true,
    checklistId: checklistId,
    itemId: itemId,
    updatedAt: new Date().toISOString(),
    completed: body.completed || false,
    notes: body.notes || '',
    photos: body.photos || [],
    message: 'Item atualizado com sucesso'
  };

  return NextResponse.json(updateResult);
}