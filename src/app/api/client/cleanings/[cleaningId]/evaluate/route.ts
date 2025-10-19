import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cleaningId: string }> }
) {
  try {
    const { cleaningId } = await params;
    const body = await request.json();
    const { rating, feedback, photos } = body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const evaluation = {
      id: `eval-${Date.now()}`,
      cleaningId,
      clientId: body.clientId || 'client-001',
      rating,
      feedback: feedback || '',
      photos: photos || [],
      categories: {
        overall: rating,
        punctuality: body.categories?.punctuality || rating,
        quality: body.categories?.quality || rating,
        professionalism: body.categories?.professionalism || rating,
        communication: body.categories?.communication || rating
      },
      wouldRecommend: rating >= 4,
      submittedAt: new Date().toISOString(),
      reviewerName: 'João Silva', // In real app, get from auth
      verified: true
    };

    // In a real app, this would update the cleaning record and trigger bonus calculations
    const bonusImpact = {
      teamMembers: ['emp-001', 'emp-002'], // Example team members
      bonusAmount: rating >= 4 ? (rating - 3) * 50 : 0, // R$ 50 per star above 3
      totalBonus: rating >= 4 ? (rating - 3) * 50 * 2 : 0 // For 2 team members
    };

    return NextResponse.json({
      success: true,
      evaluation,
      bonusImpact,
      message: 'Avaliação enviada com sucesso! Obrigado pelo seu feedback.'
    });
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit evaluation' },
      { status: 500 }
    );
  }
}