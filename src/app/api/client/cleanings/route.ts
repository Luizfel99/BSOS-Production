import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || 'client-001';
    const status = searchParams.get('status') || 'all';

    // Mock client cleanings data
    const cleanings = [
      {
        id: 'clean-001',
        clientId: 'client-001',
        date: '2025-10-10',
        time: '09:00',
        status: 'scheduled',
        property: 'Casa da Praia - Ipanema',
        address: 'Rua Visconde de Pirajá, 500',
        team: [
          { id: 'emp-001', name: 'Ana Silva', photo: '/avatars/ana.jpg' },
          { id: 'emp-002', name: 'Carlos Santos', photo: '/avatars/carlos.jpg' }
        ],
        type: 'standard',
        estimatedDuration: 180,
        photos: { before: [], after: [] },
        amount: 350,
        paymentStatus: 'pending',
        notes: '',
        specialInstructions: 'Cuidado especial com objetos de arte'
      },
      {
        id: 'clean-002',
        clientId: 'client-001',
        date: '2025-10-08',
        time: '14:00',
        status: 'completed',
        property: 'Apartamento Copacabana',
        address: 'Av. Atlântica, 1200',
        team: [
          { id: 'emp-003', name: 'Maria Costa', photo: '/avatars/maria.jpg' }
        ],
        type: 'deep',
        estimatedDuration: 240,
        actualDuration: 220,
        photos: {
          before: [
            { url: '/photos/before1.jpg', timestamp: '2025-10-08T14:00:00Z' },
            { url: '/photos/before2.jpg', timestamp: '2025-10-08T14:05:00Z' }
          ],
          after: [
            { url: '/photos/after1.jpg', timestamp: '2025-10-08T17:30:00Z' },
            { url: '/photos/after2.jpg', timestamp: '2025-10-08T17:35:00Z' }
          ]
        },
        notes: 'Limpeza profunda realizada. Todos os cômodos higienizados.',
        rating: 5,
        feedback: 'Excelente trabalho! Apartamento ficou impecável.',
        amount: 450,
        paymentStatus: 'paid',
        completedAt: '2025-10-08T17:40:00Z'
      },
      {
        id: 'clean-003',
        clientId: 'client-001',
        date: '2025-10-05',
        time: '10:00',
        status: 'completed',
        property: 'Casa da Praia - Ipanema',
        address: 'Rua Visconde de Pirajá, 500',
        team: [
          { id: 'emp-001', name: 'Ana Silva', photo: '/avatars/ana.jpg' }
        ],
        type: 'maintenance',
        estimatedDuration: 120,
        actualDuration: 115,
        photos: {
          before: [
            { url: '/photos/before3.jpg', timestamp: '2025-10-05T10:00:00Z' }
          ],
          after: [
            { url: '/photos/after3.jpg', timestamp: '2025-10-05T11:55:00Z' }
          ]
        },
        notes: 'Limpeza de manutenção semanal.',
        rating: 4,
        feedback: 'Bom trabalho, como sempre.',
        amount: 200,
        paymentStatus: 'paid',
        completedAt: '2025-10-05T11:55:00Z'
      }
    ];

    // Filter by status if specified
    let filteredCleanings = cleanings.filter(c => c.clientId === clientId);
    if (status !== 'all') {
      filteredCleanings = filteredCleanings.filter(c => c.status === status);
    }

    return NextResponse.json({
      success: true,
      cleanings: filteredCleanings,
      summary: {
        total: filteredCleanings.length,
        scheduled: filteredCleanings.filter(c => c.status === 'scheduled').length,
        completed: filteredCleanings.filter(c => c.status === 'completed').length,
        cancelled: filteredCleanings.filter(c => c.status === 'cancelled').length,
        totalAmount: filteredCleanings.reduce((sum, c) => sum + c.amount, 0),
        averageRating: filteredCleanings
          .filter(c => c.rating)
          .reduce((sum, c, _, arr) => sum + (c.rating || 0) / arr.length, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching client cleanings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cleanings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, date, time, property, address, type, specialInstructions } = body;

    const newCleaning = {
      id: `clean-${Date.now()}`,
      clientId,
      date,
      time,
      status: 'scheduled',
      property,
      address,
      team: [],
      type,
      estimatedDuration: type === 'deep' ? 240 : type === 'standard' ? 180 : 120,
      photos: { before: [], after: [] },
      amount: type === 'deep' ? 450 : type === 'standard' ? 350 : 200,
      paymentStatus: 'pending',
      notes: '',
      specialInstructions: specialInstructions || '',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      cleaning: newCleaning,
      message: 'Limpeza agendada com sucesso'
    });
  } catch (error) {
    console.error('Error creating cleaning:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create cleaning' },
      { status: 500 }
    );
  }
}
