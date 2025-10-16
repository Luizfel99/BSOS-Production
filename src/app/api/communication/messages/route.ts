/**
 * API das Mensagens do Sistema de Comunicação
 */

import { NextRequest, NextResponse } from 'next/server';

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
    timestamp: '2024-10-08 10:30',
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
    timestamp: '2024-10-08 09:15',
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
      { userId: 'user-2', userName: 'Maria Santos', readAt: '2024-10-08 09:20' },
      { userId: 'user-3', userName: 'João Oliveira', readAt: '2024-10-08 09:45' }
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
    timestamp: '2024-10-08 10:45',
    edited: false,
    reactions: [],
    replies: 0,
    parentId: 'msg-001',
    isPinned: false,
    isImportant: false,
    isRead: true,
    mentions: ['user-1'],
    mentionsEveryone: false
  },
  {
    id: 'msg-004',
    senderId: 'user-1',
    senderName: 'Ana Silva',
    senderPhoto: '/avatars/ana.jpg',
    senderRole: 'supervisor',
    content: 'Oi João! O novo produto é o EcoClean Pro. Vou enviar o manual por aqui.',
    type: 'text',
    channelId: 'general',
    channelName: 'Geral',
    timestamp: '2024-10-08 11:00',
    edited: false,
    reactions: [
      { emoji: '👍', count: 1, users: ['user-3'] }
    ],
    replies: 0,
    parentId: 'msg-003',
    isPinned: false,
    isImportant: false,
    isRead: true,
    mentions: ['user-3'],
    mentionsEveryone: false,
    attachments: [
      {
        type: 'file',
        url: '/files/ecoclean-pro-manual.pdf',
        name: 'Manual EcoClean Pro.pdf',
        size: 2048000
      }
    ]
  },
  {
    id: 'msg-005',
    senderId: 'user-2',
    senderName: 'Maria Santos',
    senderPhoto: '/avatars/maria.jpg',
    senderRole: 'leader',
    content: 'Pessoal, precisamos melhorar nossa pontuação no cliente VIP da Faria Lima. Quem pode assumir essa propriedade na próxima semana?',
    type: 'text',
    channelId: 'general',
    channelName: 'Geral',
    timestamp: '2024-10-08 11:30',
    edited: false,
    reactions: [
      { emoji: '🙋‍♀️', count: 2, users: ['user-4', 'user-5'] }
    ],
    replies: 1,
    isPinned: false,
    isImportant: true,
    isRead: false,
    mentions: [],
    mentionsEveryone: false
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let filteredMessages = mockMessages;
    
    if (channelId) {
      filteredMessages = filteredMessages.filter(msg => msg.channelId === channelId);
    }
    
    // Ordenar por timestamp (mais recentes primeiro)
    filteredMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Aplicar paginação
    const paginatedMessages = filteredMessages.slice(offset, offset + limit);
    
    return NextResponse.json({
      success: true,
      messages: paginatedMessages.reverse(), // Reverter para mostrar mais antigas primeiro
      total: filteredMessages.length,
      hasMore: offset + limit < filteredMessages.length,
      channelId
    });
    
  } catch (error) {
    console.error('Erro na API de mensagens:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, channelId, type, parentId, mentions, attachments } = body;
    
    // Simular criação de nova mensagem
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'Usuário Atual',
      senderPhoto: '/avatars/current-user.jpg',
      senderRole: 'supervisor',
      content,
      type: type || 'text',
      channelId,
      channelName: 'Canal',
      timestamp: new Date().toISOString(),
      edited: false,
      reactions: [],
      replies: 0,
      parentId,
      isPinned: false,
      isImportant: false,
      isRead: true,
      mentions: mentions || [],
      mentionsEveryone: content.includes('@everyone'),
      attachments
    };
    
    return NextResponse.json({
      success: true,
      message: newMessage,
      messageText: 'Mensagem enviada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro na API de mensagens (POST):', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, action, data } = body;
    
    switch (action) {
      case 'edit':
        return NextResponse.json({
          success: true,
          message: 'Mensagem editada com sucesso'
        });
        
      case 'react':
        return NextResponse.json({
          success: true,
          message: 'Reação adicionada com sucesso'
        });
        
      case 'pin':
        return NextResponse.json({
          success: true,
          message: 'Mensagem fixada com sucesso'
        });
        
      case 'mark_important':
        return NextResponse.json({
          success: true,
          message: 'Mensagem marcada como importante'
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Ação não reconhecida' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Erro na API de mensagens (PUT):', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    
    if (!messageId) {
      return NextResponse.json(
        { success: false, error: 'ID da mensagem é obrigatório' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Mensagem excluída com sucesso'
    });
    
  } catch (error) {
    console.error('Erro na API de mensagens (DELETE):', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
