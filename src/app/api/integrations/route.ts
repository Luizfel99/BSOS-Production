import { NextRequest, NextResponse } from 'next/server';
import { integrationOrchestrator } from '../../../services/apiIntegrations';
import { db } from '../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const { action, platform, credentials, name } = await request.json();

    switch (action) {
      case 'configure':
        // Criar nova integração no banco de dados
        const integration = db.createIntegration({
          platform,
          name: name || `${platform} Integration`,
          status: 'connected',
          credentials: credentials || {},
          webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks?platform=${platform}`,
          syncInterval: 15,
          autoSync: true,
          settings: {
            importReservations: true,
            createTasks: true,
            sendNotifications: true
          }
        });

        // Configurar no orquestrador
        switch (platform) {
          case 'airbnb':
            integrationOrchestrator.configureAirbnb(credentials);
            break;
          case 'hostaway':
            integrationOrchestrator.configureHostaway(credentials);
            break;
          case 'taskbird':
            integrationOrchestrator.configureTaskbird(credentials);
            break;
          case 'turno':
            integrationOrchestrator.configureTurno(credentials);
            break;
          default:
            return NextResponse.json({ error: 'Plataforma não suportada' }, { status: 400 });
        }

        return NextResponse.json({ 
          success: true, 
          message: `${platform} configurado com sucesso`,
          integration 
        });

      case 'sync':
        const syncResult = await integrationOrchestrator.syncAllData();
        
        // Criar tarefas automaticamente para novas reservas
        if (syncResult.reservations.length > 0) {
          await integrationOrchestrator.createCleaningTasksFromReservations(syncResult.reservations);
        }

        return NextResponse.json(syncResult);

      case 'test_connection':
        // Simular teste de conexão
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return NextResponse.json({ 
          success: true, 
          platform,
          status: 'connected',
          timestamp: new Date().toISOString(),
          message: 'Conexão testada com sucesso'
        });

      default:
        return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro na API de integrações:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const platform = url.searchParams.get('platform');

    switch (action) {
      case 'status':
        const integrations = db.getIntegrations();
        const integrationsStatus = integrations.reduce((acc, integration) => {
          acc[integration.platform] = {
            status: integration.status,
            lastSync: integration.lastSync || 'Nunca',
            name: integration.name
          };
          return acc;
        }, {} as Record<string, any>);

        const stats = db.getDashboardStats();

        return NextResponse.json({
          integrations: integrationsStatus,
          totalSynced: {
            properties: stats.activeProperties,
            reservations: stats.confirmedReservations,
            tasks: stats.tasksToday
          }
        });

      case 'properties':
        const properties = db.getProperties().map(property => ({
          id: property.id,
          name: property.name,
          platform: property.platform,
          status: property.active ? 'active' : 'inactive',
          address: property.address,
          type: property.type
        }));
        
        return NextResponse.json({ properties });

      case 'reservations':
        const reservations = db.getReservations().map(reservation => {
          const property = db.getPropertyById(reservation.propertyId);
          return {
            id: reservation.id,
            propertyName: property?.name || 'Propriedade Desconhecida',
            guestName: reservation.guestName,
            checkIn: reservation.checkIn,
            checkOut: reservation.checkOut,
            platform: reservation.platform,
            status: reservation.status
          };
        });
        
        return NextResponse.json({ reservations });

      case 'sync_history':
        // Retornar histórico de sincronizações (simulado)
        return NextResponse.json({
          history: [
            {
              id: 1,
              platform: 'Airbnb',
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              status: 'success',
              itemsSynced: 5,
              details: '5 reservas importadas'
            },
            {
              id: 2,
              platform: 'Hostaway',
              timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
              status: 'success',
              itemsSynced: 3,
              details: '3 propriedades atualizadas'
            },
            {
              id: 3,
              platform: 'Taskbird',
              timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
              status: 'error',
              itemsSynced: 0,
              details: 'Erro de autenticação'
            }
          ]
        });

      default:
        return NextResponse.json({
          message: 'API de Integrações ativa',
          endpoints: [
            'GET /api/integrations?action=status',
            'GET /api/integrations?action=properties',
            'GET /api/integrations?action=reservations',
            'GET /api/integrations?action=sync_history',
            'POST /api/integrations (configure, sync, test_connection)'
          ],
          database_stats: db.getDashboardStats()
        });
    }
  } catch (error) {
    console.error('Erro na API de integrações:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
