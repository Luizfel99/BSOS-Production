/**
 * API do Sistema de Comunicação Interna
 */

import { NextRequest, NextResponse } from 'next/server';

const mockChannels = [
  {
    id: 'general',
    name: 'Geral',
    description: 'Comunicação geral da equipe',
    type: 'general',
    icon: '💬',
    members: [
      { id: 'user-1', name: 'Ana Silva', role: 'supervisor', photo: '/avatars/ana.jpg', status: 'online', lastSeen: '1 min atrás' },
      { id: 'user-2', name: 'Maria Santos', role: 'leader', photo: '/avatars/maria.jpg', status: 'online', lastSeen: '5 min atrás' },
      { id: 'user-3', name: 'João Oliveira', role: 'cleaner', photo: '/avatars/joao.jpg', status: 'away', lastSeen: '30 min atrás' }
    ],
    permissions: {
      canPost: ['supervisor', 'leader', 'cleaner'],
      canPin: ['supervisor', 'leader'],
      canDelete: ['supervisor'],
      canModerate: ['supervisor']
    },
    unreadCount: 3,
    lastMessage: {
      id: 'msg-001',
      senderId: 'user-2',
      senderName: 'Maria Santos',
      content: 'Pessoal, lembrem-se da reunião às 14h!',
      timestamp: '10:30',
      type: 'text'
    },
    isPrivate: false,
    isArchived: false
  },
  {
    id: 'announcements',
    name: 'Anúncios',
    description: 'Comunicados oficiais da empresa',
    type: 'announcements',
    icon: '📢',
    members: [
      { id: 'user-1', name: 'Ana Silva', role: 'supervisor', photo: '/avatars/ana.jpg', status: 'online', lastSeen: '1 min atrás' },
      { id: 'user-2', name: 'Maria Santos', role: 'leader', photo: '/avatars/maria.jpg', status: 'online', lastSeen: '5 min atrás' }
    ],
    permissions: {
      canPost: ['supervisor'],
      canPin: ['supervisor'],
      canDelete: ['supervisor'],
      canModerate: ['supervisor']
    },
    unreadCount: 1,
    lastMessage: {
      id: 'msg-002',
      senderId: 'user-1',
      senderName: 'Ana Silva',
      content: 'Nova política de bonificação em vigor a partir de segunda-feira.',
      timestamp: '09:15',
      type: 'announcement'
    },
    isPrivate: false,
    isArchived: false
  },
  {
    id: 'training',
    name: 'Treinamentos',
    description: 'Canal dedicado a treinamentos e dúvidas',
    type: 'training',
    icon: '🎓',
    members: [
      { id: 'user-1', name: 'Ana Silva', role: 'supervisor', photo: '/avatars/ana.jpg', status: 'online', lastSeen: '1 min atrás' },
      { id: 'user-3', name: 'João Oliveira', role: 'cleaner', photo: '/avatars/joao.jpg', status: 'away', lastSeen: '30 min atrás' }
    ],
    permissions: {
      canPost: ['supervisor', 'leader', 'cleaner'],
      canPin: ['supervisor', 'leader'],
      canDelete: ['supervisor'],
      canModerate: ['supervisor', 'leader']
    },
    unreadCount: 0,
    isPrivate: false,
    isArchived: false
  }
];

const mockMessages = [
  {
    id: 'msg-001',
    senderId: 'user-2',
    senderName: 'Maria Santos',
    senderPhoto: '/avatars/maria.jpg',
    senderRole: 'leader',
    content: 'Pessoal, lembrem-se da reunião às 14h hoje! Vamos discutir os novos protocolos de limpeza.',
    type: 'text',
    channelId: 'general',
    channelName: 'Geral',
    timestamp: '10:30',
    edited: false,
    reactions: [
      { emoji: '👍', count: 3, users: ['user-1', 'user-3', 'user-4'] },
      { emoji: '✅', count: 2, users: ['user-1', 'user-5'] }
    ],
    replies: 2,
    isPinned: false,
    isImportant: false,
    isRead: true,
    mentions: [],
    mentionsEveryone: false
  },
  {
    id: 'msg-002',
    senderId: 'user-1',
    senderName: 'Ana Silva',
    senderPhoto: '/avatars/ana.jpg',
    senderRole: 'supervisor',
    content: 'Nova política de bonificação em vigor a partir de segunda-feira. Quem atingir nota média acima de 4.8 receberá 20% de bônus extra!',
    type: 'announcement',
    channelId: 'announcements',
    channelName: 'Anúncios',
    timestamp: '09:15',
    edited: false,
    reactions: [
      { emoji: '🎉', count: 5, users: ['user-2', 'user-3', 'user-4', 'user-5', 'user-6'] },
      { emoji: '💪', count: 3, users: ['user-2', 'user-4', 'user-6'] }
    ],
    replies: 0,
    isPinned: true,
    isImportant: true,
    isRead: false,
    mentions: [],
    mentionsEveryone: true,
    readBy: [
      { userId: 'user-2', userName: 'Maria Santos', readAt: '09:20' },
      { userId: 'user-3', userName: 'João Oliveira', readAt: '09:45' }
    ]
  },
  {
    id: 'msg-003',
    senderId: 'user-3',
    senderName: 'João Oliveira',
    senderPhoto: '/avatars/joao.jpg',
    senderRole: 'cleaner',
    content: 'Obrigado pela informação! Tenho uma dúvida sobre o novo produto de limpeza que chegou.',
    type: 'text',
    channelId: 'general',
    channelName: 'Geral',
    timestamp: '10:45',
    edited: false,
    reactions: [],
    replies: 0,
    parentId: 'msg-001',
    isPinned: false,
    isImportant: false,
    isRead: true,
    mentions: ['user-1'],
    mentionsEveryone: false
  }
];

const mockNotifications = [
  {
    id: 'notif-001',
    type: 'mention',
    title: 'Você foi mencionado',
    message: 'João Oliveira mencionou você em #geral',
    timestamp: '10:45',
    isRead: false,
    actionUrl: '/comunicacao?channel=general&message=msg-003',
    priority: 'medium'
  },
  {
    id: 'notif-002',
    type: 'announcement',
    title: 'Novo anúncio',
    message: 'Ana Silva publicou um anúncio importante',
    timestamp: '09:15',
    isRead: false,
    actionUrl: '/comunicacao?channel=announcements&message=msg-002',
    priority: 'high'
  },
  {
    id: 'notif-003',
    type: 'reply',
    title: 'Nova resposta',
    message: 'Maria Santos respondeu sua mensagem',
    timestamp: '08:30',
    isRead: true,
    actionUrl: '/comunicacao?channel=general&message=msg-001',
    priority: 'low'
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      channels: mockChannels,
      onlineMembers: mockChannels.flatMap(c => c.members.filter(m => m.status === 'online')).length,
      totalMessages: mockMessages.length,
      unreadNotifications: mockNotifications.filter(n => !n.isRead).length
    });
    
  } catch (error) {
    console.error('Erro na API de canais:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, channelId, data } = body;
    
    switch (action) {
      case 'create_channel':
        const newChannel = {
          id: `channel-${Date.now()}`,
          ...data,
          members: [],
          unreadCount: 0,
          isPrivate: false,
          isArchived: false
        };
        
        return NextResponse.json({
          success: true,
          channel: newChannel,
          message: 'Canal criado com sucesso'
        });
        
      case 'update_channel':
        return NextResponse.json({
          success: true,
          message: 'Canal atualizado com sucesso'
        });
        
      case 'archive_channel':
        return NextResponse.json({
          success: true,
          message: 'Canal arquivado com sucesso'
        });
        
      case 'add_member':
        return NextResponse.json({
          success: true,
          message: 'Membro adicionado ao canal'
        });
        
      case 'remove_member':
        return NextResponse.json({
          success: true,
          message: 'Membro removido do canal'
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Ação não reconhecida' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Erro na API de canais (POST):', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
