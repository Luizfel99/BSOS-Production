import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock quiz data
    const mockQuizzes = [
      {
        id: 1,
        moduleId: 1,
        title: 'Quiz: Conhecimentos Básicos de Limpeza',
        description: 'Teste seus conhecimentos sobre técnicas básicas',
        duration: 15,
        questions: [
          {
            id: 1,
            type: 'multipla_escolha',
            question: 'Qual é o primeiro passo em uma limpeza residencial?',
            options: [
              'Aspirar o chão',
              'Organizar os objetos',
              'Limpar as janelas',
              'Desinfetar superfícies'
            ],
            correctAnswer: 1,
            explanation: 'Organizar os objetos facilita o acesso a todas as superfícies.'
          },
          {
            id: 2,
            type: 'multipla_escolha',
            question: 'Qual produto é mais adequado para limpeza de vidros?',
            options: [
              'Detergente neutro',
              'Álcool 70%',
              'Limpa vidros específico',
              'Água sanitária'
            ],
            correctAnswer: 2,
            explanation: 'Limpa vidros específico remove gordura sem deixar marcas.'
          }
        ],
        passingScore: 70,
        attempts: 3,
        timeLimit: 900 // 15 minutes in seconds
      },
      {
        id: 2,
        moduleId: 2,
        title: 'Avaliação: Atendimento ao Cliente',
        description: 'Teste de situações práticas de atendimento',
        duration: 20,
        questions: [
          {
            id: 1,
            type: 'situacional',
            question: 'Um cliente reclama da qualidade da limpeza. Como você responderia?',
            options: [
              'Explicar que a limpeza está dentro dos padrões',
              'Ouvir atentamente e propor uma solução',
              'Culpar outros fatores externos',
              'Encaminhar para o supervisor'
            ],
            correctAnswer: 1,
            explanation: 'Escuta ativa e proposição de soluções demonstram profissionalismo.'
          }
        ],
        passingScore: 80,
        attempts: 2,
        timeLimit: 1200 // 20 minutes
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockQuizzes,
      total: mockQuizzes.length
    });

  } catch (error) {
    console.error('Training Quizzes API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, answers, timeSpent } = body;
    
    // Mock quiz submission and grading
    const quiz = { id: quizId }; // Would fetch from database
    const correctAnswers = 2; // Mock calculation
    const totalQuestions = 2;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    const submission = {
      id: Date.now(),
      quizId,
      score,
      correctAnswers,
      totalQuestions,
      timeSpent,
      passed: score >= 70, // Mock passing score
      submittedAt: new Date().toISOString(),
      feedback: score >= 70 ? 'Parabéns! Você passou no quiz.' : 'Continue estudando e tente novamente.'
    };

    return NextResponse.json({
      success: true,
      data: submission,
      message: 'Quiz submetido com sucesso'
    });

  } catch (error) {
    console.error('Quiz Submission Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao submeter quiz' },
      { status: 500 }
    );
  }
}