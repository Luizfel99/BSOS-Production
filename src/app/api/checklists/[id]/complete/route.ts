import { NextRequest, NextResponse } from 'next/server';

// POST /api/checklists/[id]/complete
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const checklistId = id;
    const body = await request.json();
    
    const { completed_items, notes, photos, quality_score } = body;

    // Validar dados
    if (!completed_items || !Array.isArray(completed_items)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Itens completados obrigatórios',
          message: 'Lista de itens completados é obrigatória',
        },
        { status: 400 }
      );
    }

    // Buscar checklist
    const mockChecklist = {
      id: checklistId,
      taskId: 'task-123',
      propertyId: 'property-456',
      totalItems: 15,
      requiredItems: 12,
    };

    // Simular conclusão do checklist
    const mockCompletion = {
      id: `completion-${Date.now()}`,
      checklistId,
      completedItems: completed_items,
      completionRate: completed_items.length / mockChecklist.totalItems,
      qualityScore: quality_score || Math.floor(Math.random() * 20) + 80, // 80-100
      notes: notes || null,
      photos: photos || [],
      completedAt: new Date().toISOString(),
      completedBy: 'current-employee',
      estimatedDuration: Math.floor(Math.random() * 60) + 90, // minutos
    };

    // Validar se itens obrigatórios foram completados
    const criticalItemsCompleted = completed_items.filter(item => 
      item.isCritical && item.completed
    ).length;

    const hasAllCriticalItems = criticalItemsCompleted >= mockChecklist.requiredItems;

    console.log('✅ Checklist completado:', mockCompletion);

    // Simular ações automáticas
    const automaticActions = [
      '📋 Checklist marcado como concluído',
      '📊 Score de qualidade calculado',
    ];

    if (hasAllCriticalItems) {
      automaticActions.push('✅ Todos os itens obrigatórios completados');
      automaticActions.push('🏠 Status da propriedade atualizado');
    } else {
      automaticActions.push('⚠️ Alguns itens obrigatórios pendentes');
    }

    if (photos && photos.length > 0) {
      automaticActions.push(`📸 ${photos.length} foto(s) anexada(s)`);
    }

    return NextResponse.json({
      success: true,
      data: {
        completion: mockCompletion,
        validation: {
          hasAllCriticalItems,
          completionRate: mockCompletion.completionRate,
          qualityGrade: mockCompletion.qualityScore >= 90 ? 'A' : 
                        mockCompletion.qualityScore >= 80 ? 'B' : 'C',
        },
        automaticActions,
      },
      message: hasAllCriticalItems 
        ? `Checklist concluído com sucesso! Score: ${mockCompletion.qualityScore}/100 ⭐`
        : 'Checklist salvo, mas alguns itens obrigatórios estão pendentes ⚠️',
    });

  } catch (error) {
    console.error('Erro ao completar checklist:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível completar o checklist',
      },
      { status: 500 }
    );
  }
}