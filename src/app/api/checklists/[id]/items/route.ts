import { NextRequest, NextResponse } from 'next/server';

// POST /api/checklists/[id]/items
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const checklistId = id;
    const body = await request.json();
    
    const { title, description, is_critical, category, estimated_time } = body;

    // Validar dados obrigatórios
    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: 'Título obrigatório',
          message: 'Título do item é obrigatório',
        },
        { status: 400 }
      );
    }

    // Simular adição do item
    const mockItem = {
      id: `item-${Date.now()}`,
      checklistId,
      title,
      description: description || null,
      isCritical: is_critical || false,
      category: category || 'general',
      estimatedTime: estimated_time || 10, // minutos
      order: Math.floor(Math.random() * 20) + 1,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user',
      status: 'pending',
    };

    console.log('➕ Item adicionado ao checklist:', mockItem);

    return NextResponse.json({
      success: true,
      data: mockItem,
      message: `Item "${title}" adicionado ao checklist! ➕`,
    });

  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível adicionar o item',
      },
      { status: 500 }
    );
  }
}

// GET /api/checklists/[id]/items
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const checklistId = id;

    // Simular itens do checklist
    const mockItems = [
      {
        id: 'item-1',
        title: 'Aspirar todos os cômodos',
        description: 'Incluindo cantos e embaixo dos móveis',
        isCritical: true,
        category: 'cleaning',
        estimatedTime: 30,
        status: 'pending',
      },
      {
        id: 'item-2',
        title: 'Limpar banheiros',
        description: 'Desinfectar todas as superfícies',
        isCritical: true,
        category: 'sanitization',
        estimatedTime: 25,
        status: 'pending',
      },
      {
        id: 'item-3',
        title: 'Organizar objetos',
        description: 'Colocar objetos em seus lugares',
        isCritical: false,
        category: 'organization',
        estimatedTime: 15,
        status: 'pending',
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        items: mockItems,
        totalItems: mockItems.length,
        criticalItems: mockItems.filter(item => item.isCritical).length,
        estimatedTime: mockItems.reduce((acc, item) => acc + item.estimatedTime, 0),
      },
      message: 'Itens do checklist recuperados com sucesso',
    });

  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível recuperar os itens',
      },
      { status: 500 }
    );
  }
}