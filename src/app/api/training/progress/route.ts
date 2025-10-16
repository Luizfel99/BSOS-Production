import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock training progress data
    const mockProgress = [
      {
        id: 1,
        userId: 1,
        moduleId: 1,
        moduleName: 'Fundamentos de Limpeza',
        progress: 75,
        completedLessons: 2,
        totalLessons: 3,
        timeSpent: 50,
        estimatedTimeRemaining: 17,
        lastAccessed: '2024-01-14T14:30:00Z',
        status: 'em_progresso',
        grade: null,
        certificateIssued: false
      },
      {
        id: 2,
        userId: 1,
        moduleId: 2,
        moduleName: 'Atendimento ao Cliente',
        progress: 100,
        completedLessons: 3,
        totalLessons: 3,
        timeSpent: 90,
        estimatedTimeRemaining: 0,
        lastAccessed: '2024-01-12T16:45:00Z',
        status: 'concluido',
        grade: 9.2,
        certificateIssued: true
      },
      {
        id: 3,
        userId: 1,
        moduleId: 3,
        moduleName: 'Segurança no Trabalho',
        progress: 0,
        completedLessons: 0,
        totalLessons: 3,
        timeSpent: 0,
        estimatedTimeRemaining: 150,
        lastAccessed: null,
        status: 'nao_iniciado',
        grade: null,
        certificateIssued: false
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockProgress,
      summary: {
        totalModules: mockProgress.length,
        completedModules: mockProgress.filter(p => p.status === 'concluido').length,
        inProgressModules: mockProgress.filter(p => p.status === 'em_progresso').length,
        totalTimeSpent: mockProgress.reduce((sum, p) => sum + p.timeSpent, 0),
        averageGrade: mockProgress
          .filter(p => p.grade !== null)
          .reduce((sum, p, _, arr) => sum + (p.grade || 0) / arr.length, 0)
      }
    });

  } catch (error) {
    console.error('Training Progress API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleId, lessonId, timeSpent, completed } = body;
    
    // Mock progress update
    const progressUpdate = {
      id: Date.now(),
      moduleId,
      lessonId,
      timeSpent,
      completed,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: progressUpdate,
      message: 'Progresso atualizado com sucesso'
    });

  } catch (error) {
    console.error('Progress Update Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar progresso' },
      { status: 500 }
    );
  }
}