/**
 * API das Notificações do Sistema de Comunicação
 */

import { NextRequest, NextResponse } from 'next/server';

const mockNotifications = [
  {
    id: 'notif-001',
    type: 'mention',
    title: 'Você foi mencionado',
    message: 'João Oliveira mencionou você em #geral sobre o novo produto de limpeza',
    timestamp: '2024-10-08 10:45',
    isRead: false,
    actionUrl: '/comunicacao?channel=general&message=msg-003',
    priority: 'medium'
  },
  {
    id: 'notif-002',
    type: 'announcement',
    title: 'Novo anúncio importante',
    message: 'Ana Silva publicou: "Nova política de bonificação em vigor"',
    timestamp: '2024-10-08 09:15',
    isRead: false,
    actionUrl: '/comunicacao?channel=announcements&message=msg-002',
    priority: 'high'
  },
  {
    id: 'notif-003',
    type: 'reply',
    title: 'Nova resposta',
    message: 'Maria Santos respondeu sua mensagem sobre os protocolos de limpeza',
    timestamp: '2024-10-08 08:30',
    isRead: true,
    actionUrl: '/comunicacao?channel=general&message=msg-001',
    priority: 'low'
  },
  {
    id: 'notif-004',
    type: 'system',
    title: 'Lembrete de reunião',
    message: 'Reunião de equipe em 30 minutos na sala de treinamento',
    timestamp: '2024-10-08 13:30',
    isRead: false,
    actionUrl: '/agenda?event=reunion-001',
    priority: 'urgent'
  },
  {
    id: 'notif-005',
    type: 'mention',
    title: 'Menção em #treinamentos',
    message: 'Ana Silva mencionou você em uma discussão sobre novos procedimentos',
    timestamp: '2024-10-08 07:20',
    isRead: true,
    actionUrl: '/comunicacao?channel=training&message=msg-010',
    priority: 'medium'
  },
  {
    id: 'notif-006',
    type: 'reminder',
    title: 'Lembrete: Avaliação pendente',
    message: 'Você tem 2 avaliações de limpeza pendentes para revisar',
    timestamp: '2024-10-08 06:00',
    isRead: false,
    actionUrl: '/avaliacoes?filter=pending',
    priority: 'medium'
  },
  {
    id: 'notif-007',
    type: 'system',
    title: 'Backup automático concluído',
    message: 'Backup dos dados do sistema realizado com sucesso',
    timestamp: '2024-10-08 03:00',
    isRead: true,
    actionUrl: null,
    priority: 'low'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'current-user';
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let filteredNotifications = mockNotifications;
    
    // Filtrar apenas não lidas se solicitado
    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter(notif => !notif.isRead);
    }
    
    // Filtrar por tipo
    if (type && type !== 'all') {
      filteredNotifications = filteredNotifications.filter(notif => notif.type === type);
    }
    
    // Filtrar por prioridade
    if (priority && priority !== 'all') {
      filteredNotifications = filteredNotifications.filter(notif => notif.priority === priority);
    }
    
    // Ordenar por timestamp (mais recentes primeiro)
    filteredNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Aplicar paginação
    const paginatedNotifications = filteredNotifications.slice(offset, offset + limit);
    
    // Estatísticas
    const stats = {
      total: filteredNotifications.length,
      unread: mockNotifications.filter(n => !n.isRead).length,
      byType: {
        mention: mockNotifications.filter(n => n.type === 'mention').length,
        announcement: mockNotifications.filter(n => n.type === 'announcement').length,
        reply: mockNotifications.filter(n => n.type === 'reply').length,
        system: mockNotifications.filter(n => n.type === 'system').length,
        reminder: mockNotifications.filter(n => n.type === 'reminder').length
      },
      byPriority: {
        urgent: mockNotifications.filter(n => n.priority === 'urgent').length,
        high: mockNotifications.filter(n => n.priority === 'high').length,
        medium: mockNotifications.filter(n => n.priority === 'medium').length,
        low: mockNotifications.filter(n => n.priority === 'low').length
      }
    };
    
    return NextResponse.json({
      success: true,
      notifications: paginatedNotifications,
      statistics: stats,
      hasMore: offset + limit < filteredNotifications.length
    });
    
  } catch (error) {
    console.error('Erro na API de notificações:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, notificationIds, data } = body;
    
    switch (action) {
      case 'mark_read':
        // Marcar notificações como lidas
        return NextResponse.json({
          success: true,
          message: `${notificationIds?.length || 1} notificação(ões) marcada(s) como lida(s)`
        });
        
      case 'mark_all_read':
        // Marcar todas as notificações como lidas
        return NextResponse.json({
          success: true,
          message: 'Todas as notificações foram marcadas como lidas',
          count: mockNotifications.filter(n => !n.isRead).length
        });
        
      case 'create_notification':
        // Criar nova notificação (para uso interno do sistema)
        const newNotification = {
          id: `notif-${Date.now()}`,
          ...data,
          timestamp: new Date().toISOString(),
          isRead: false
        };
        
        return NextResponse.json({
          success: true,
          notification: newNotification,
          message: 'Notificação criada com sucesso'
        });
        
      case 'delete':
        // Excluir notificações
        return NextResponse.json({
          success: true,
          message: `${notificationIds?.length || 1} notificação(ões) excluída(s)`
        });
        
      case 'delete_all_read':
        // Excluir todas as notificações lidas
        const readCount = mockNotifications.filter(n => n.isRead).length;
        return NextResponse.json({
          success: true,
          message: `${readCount} notificações lidas foram excluídas`
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Ação não reconhecida' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Erro na API de notificações (POST):', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, isRead, priority } = body;
    
    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'ID da notificação é obrigatório' },
        { status: 400 }
      );
    }
    
    // Simular atualização da notificação
    return NextResponse.json({
      success: true,
      message: 'Notificação atualizada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro na API de notificações (PUT):', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
