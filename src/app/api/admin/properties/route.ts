/**
 * API: Admin Properties - Gestão de propriedades
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || new Date().toISOString().slice(0, 7);

    // Mock data - em produção viria do banco de dados
    const properties = [
      {
        id: 'prop-001',
        name: 'Casa Copacabana Premium',
        type: 'airbnb',
        address: 'Rua Santa Clara, 123 - Copacabana, RJ',
        client: 'Maria Silva',
        status: 'active',
        cleaningsThisMonth: 28,
        revenue: 15600,
        avgRating: 4.9,
        lastCleaning: '2024-10-07',
        nextCleaning: '2024-10-09',
        assignedTeam: ['Ana Costa', 'João Santos']
      },
      {
        id: 'prop-002',
        name: 'Apartamento Ipanema Vista Mar',
        type: 'airbnb',
        address: 'Av. Vieira Souto, 456 - Ipanema, RJ',
        client: 'Carlos Montenegro',
        status: 'active',
        cleaningsThisMonth: 25,
        revenue: 18900,
        avgRating: 4.8,
        lastCleaning: '2024-10-06',
        nextCleaning: '2024-10-08',
        assignedTeam: ['Lucia Fernandes', 'Pedro Lima']
      },
      {
        id: 'prop-003',
        name: 'Residência Barra da Tijuca',
        type: 'residential',
        address: 'Rua das Américas, 789 - Barra da Tijuca, RJ',
        client: 'Roberto Almeida',
        status: 'active',
        cleaningsThisMonth: 8,
        revenue: 4800,
        avgRating: 4.7,
        lastCleaning: '2024-10-05',
        nextCleaning: '2024-10-12',
        assignedTeam: ['Carla Rodrigues']
      },
      {
        id: 'prop-004',
        name: 'Escritório Centro',
        type: 'commercial',
        address: 'Rua da Carioca, 321 - Centro, RJ',
        client: 'Empresa ABC Ltda',
        status: 'maintenance',
        cleaningsThisMonth: 12,
        revenue: 7200,
        avgRating: 4.6,
        lastCleaning: '2024-10-04',
        nextCleaning: '2024-10-10',
        assignedTeam: ['Marcos Silva', 'Fernanda Costa']
      },
      {
        id: 'prop-005',
        name: 'Cobertura Leblon',
        type: 'airbnb',
        address: 'Rua Dias Ferreira, 987 - Leblon, RJ',
        client: 'Ana Paula Mendes',
        status: 'active',
        cleaningsThisMonth: 22,
        revenue: 22000,
        avgRating: 5.0,
        lastCleaning: '2024-10-07',
        nextCleaning: '2024-10-09',
        assignedTeam: ['Isabella Santos', 'Rafael Oliveira']
      }
    ];

    return NextResponse.json({
      success: true,
      properties,
      total: properties.length,
      period,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao buscar propriedades:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica
    const { name, type, address, client } = body;
    if (!name || !type || !address || !client) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Em produção, salvaria no banco de dados
    const newProperty = {
      id: `prop-${Date.now()}`,
      name,
      type,
      address,
      client,
      status: 'active',
      cleaningsThisMonth: 0,
      revenue: 0,
      avgRating: 0,
      lastCleaning: null,
      nextCleaning: null,
      assignedTeam: [],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      property: newProperty,
      message: 'Propriedade criada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar propriedade:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
