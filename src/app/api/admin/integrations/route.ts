/**
 * API: Admin Integrations - Gestão de integrações
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data - em produção viria do banco de dados
    const integrations = [
      {
        id: 'int-001',
        name: 'Airbnb',
        type: 'booking',
        status: 'connected',
        lastSync: '2024-10-08 09:30',
        syncFrequency: 'A cada 30 minutos',
        recordsProcessed: 1247,
        errorCount: 0
      },
      {
        id: 'int-002',
        name: 'Hostaway',
        type: 'booking',
        status: 'connected',
        lastSync: '2024-10-08 09:15',
        syncFrequency: 'A cada hora',
        recordsProcessed: 892,
        errorCount: 2
      },
      {
        id: 'int-003',
        name: 'Stripe',
        type: 'payment',
        status: 'connected',
        lastSync: '2024-10-08 10:00',
        syncFrequency: 'Tempo real',
        recordsProcessed: 3456,
        errorCount: 0
      },
      {
        id: 'int-004',
        name: 'QuickBooks',
        type: 'accounting',
        status: 'error',
        lastSync: '2024-10-07 14:22',
        syncFrequency: 'Diário',
        recordsProcessed: 234,
        errorCount: 15
      },
      {
        id: 'int-005',
        name: 'Google',
        type: 'calendar',
        status: 'connected',
        lastSync: '2024-10-08 09:45',
        syncFrequency: 'A cada 15 minutos',
        recordsProcessed: 2134,
        errorCount: 1
      },
      {
        id: 'int-006',
        name: 'Twilio',
        type: 'communication',
        status: 'connected',
        lastSync: '2024-10-08 10:05',
        syncFrequency: 'Tempo real',
        recordsProcessed: 567,
        errorCount: 0
      },
      {
        id: 'int-007',
        name: 'iCall',
        type: 'communication',
        status: 'disconnected',
        lastSync: '2024-10-05 16:30',
        syncFrequency: 'Manual',
        recordsProcessed: 89,
        errorCount: 8
      }
    ];

    return NextResponse.json({
      success: true,
      integrations,
      total: integrations.length,
      summary: {
        connected: integrations.filter(i => i.status === 'connected').length,
        errors: integrations.filter(i => i.status === 'error').length,
        disconnected: integrations.filter(i => i.status === 'disconnected').length,
        totalRecords: integrations.reduce((acc, i) => acc + i.recordsProcessed, 0),
        totalErrors: integrations.reduce((acc, i) => acc + i.errorCount, 0)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao buscar integrações:', error);
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
    const { name, type, apiKey, webhookUrl } = body;
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Nome e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    // Em produção, salvaria no banco de dados e configuraria a integração
    const newIntegration = {
      id: `int-${Date.now()}`,
      name,
      type,
      status: 'disconnected',
      lastSync: null,
      syncFrequency: 'Manual',
      recordsProcessed: 0,
      errorCount: 0,
      config: {
        apiKey: apiKey ? '***masked***' : null,
        webhookUrl
      },
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      integration: newIntegration,
      message: 'Integração criada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar integração:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
