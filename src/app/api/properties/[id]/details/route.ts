import { NextRequest, NextResponse } from 'next/server';

// GET /api/properties/[id]/details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = id;

    // Simular busca no banco de dados
    // TODO: Substituir por consulta real ao banco de dados
    const mockPropertyDetails = {
      id: propertyId,
      name: `Propriedade ${propertyId}`,
      address: `Rua Exemplo, ${Math.floor(Math.random() * 1000)}, São Paulo, SP`,
      type: 'Apartamento',
      size: Math.floor(Math.random() * 200) + 50, // m²
      rooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      owner: {
        id: `owner-${propertyId}`,
        name: `Proprietário ${propertyId}`,
        email: `owner${propertyId}@email.com`,
        phone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
      },
      lastCleaning: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      nextScheduled: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: ['available', 'occupied', 'maintenance'][Math.floor(Math.random() * 3)],
      cleaningHistory: Array.from({ length: 5 }, (_, i) => ({
        id: `cleaning-${i}`,
        date: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        employee: `Funcionário ${i + 1}`,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 estrelas
        duration: Math.floor(Math.random() * 120) + 60, // 60-180 minutos
        observations: `Limpeza ${i + 1} realizada com sucesso`,
      })),
      specialRequirements: [
        'Cuidado especial com móveis de madeira',
        'Plantas no ambiente',
        'Animal de estimação (gato)',
      ],
      cleaningPackage: {
        type: 'premium',
        includes: ['Limpeza completa', 'Organização', 'Produtos ecológicos'],
        price: 120.00,
      },
    };

    return NextResponse.json({
      success: true,
      data: mockPropertyDetails,
      message: 'Detalhes da propriedade recuperados com sucesso',
    });

  } catch (error) {
    console.error('Erro ao buscar detalhes da propriedade:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível recuperar os detalhes da propriedade',
      },
      { status: 500 }
    );
  }
}