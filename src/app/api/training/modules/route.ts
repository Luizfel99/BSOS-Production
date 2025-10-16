import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock training modules data
    const mockModules = [
      {
        id: 1,
        title: 'Fundamentos de Limpeza',
        description: 'Técnicas básicas de limpeza residencial e comercial',
        duration: 120,
        difficulty: 'iniciante',
        category: 'limpeza',
        instructor: 'Ana Santos',
        rating: 4.8,
        enrolledStudents: 45,
        completionRate: 87,
        thumbnail: '/training/module1-thumb.jpg',
        lessons: [
          { id: 1, title: 'Introdução à Limpeza Profissional', duration: 20, type: 'video' },
          { id: 2, title: 'Produtos e Equipamentos', duration: 30, type: 'video' },
          { id: 3, title: 'Quiz: Conhecimentos Básicos', duration: 10, type: 'quiz' }
        ],
        status: 'publicado'
      },
      {
        id: 2,
        title: 'Atendimento ao Cliente',
        description: 'Como proporcionar excelência no atendimento',
        duration: 90,
        difficulty: 'intermediario',
        category: 'atendimento',
        instructor: 'Carlos Mendes',
        rating: 4.9,
        enrolledStudents: 38,
        completionRate: 92,
        thumbnail: '/training/module2-thumb.jpg',
        lessons: [
          { id: 1, title: 'Comunicação Efetiva', duration: 25, type: 'video' },
          { id: 2, title: 'Resolução de Conflitos', duration: 30, type: 'video' },
          { id: 3, title: 'Simulação Prática', duration: 15, type: 'interactive' }
        ],
        status: 'publicado'
      },
      {
        id: 3,
        title: 'Segurança no Trabalho',
        description: 'Normas e práticas de segurança ocupacional',
        duration: 150,
        difficulty: 'intermediario',
        category: 'seguranca',
        instructor: 'Dr. Roberto Lima',
        rating: 4.7,
        enrolledStudents: 52,
        completionRate: 89,
        thumbnail: '/training/module3-thumb.jpg',
        lessons: [
          { id: 1, title: 'EPIs e Equipamentos', duration: 40, type: 'video' },
          { id: 2, title: 'Procedimentos de Emergência', duration: 35, type: 'video' },
          { id: 3, title: 'Avaliação Final', duration: 20, type: 'quiz' }
        ],
        status: 'publicado'
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockModules,
      total: mockModules.length
    });

  } catch (error) {
    console.error('Training Modules API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock module creation
    const newModule = {
      id: Date.now(),
      ...body,
      enrolledStudents: 0,
      completionRate: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      status: 'rascunho'
    };

    return NextResponse.json({
      success: true,
      data: newModule,
      message: 'Módulo de treinamento criado com sucesso'
    });

  } catch (error) {
    console.error('Training Module Creation Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar módulo' },
      { status: 500 }
    );
  }
}