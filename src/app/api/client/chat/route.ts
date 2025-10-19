import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || 'client-001';
    const channelId = searchParams.get('channelId') || 'client-support';

    // Mock chat messages
    const messages = [
      {
        id: 'msg-001',
        channelId: 'client-support',
        clientId: 'client-001',
        sender: 'bright-shine',
        senderName: 'Suporte Bright & Shine',
        senderAvatar: '/avatars/support.jpg',
        message: 'Olá João! Bem-vindo ao nosso chat de suporte. Como posso ajudá-lo hoje?',
        timestamp: '2025-10-09T09:00:00Z',
        type: 'text',
        read: true
      },
      {
        id: 'msg-002',
        channelId: 'client-support',
        clientId: 'client-001',
        sender: 'client',
        senderName: 'João Silva',
        senderAvatar: '/avatars/client.jpg',
        message: 'Olá! Gostaria de saber sobre a limpeza agendada para amanhã.',
        timestamp: '2025-10-09T09:15:00Z',
        type: 'text',
        read: true
      },
      {
        id: 'msg-003',
        channelId: 'client-support',
        clientId: 'client-001',
        sender: 'bright-shine',
        senderName: 'Ana Costa - Supervisora',
        senderAvatar: '/avatars/ana.jpg',
        message: 'Perfeito! Sua limpeza está confirmada para amanhã às 09:00. A equipe da Ana Silva e Carlos Santos chegará pontualmente. Há alguma instrução especial?',
        timestamp: '2025-10-09T09:30:00Z',
        type: 'text',
        read: true
      },
      {
        id: 'msg-004',
        channelId: 'client-support',
        clientId: 'client-001',
        sender: 'client',
        senderName: 'João Silva',
        senderAvatar: '/avatars/client.jpg',
        message: 'Sim, por favor tenham cuidado especial com os objetos de arte na sala principal.',
        timestamp: '2025-10-09T10:00:00Z',
        type: 'text',
        read: true
      },
      {
        id: 'msg-005',
        channelId: 'client-support',
        clientId: 'client-001',
        sender: 'bright-shine',
        senderName: 'Ana Costa - Supervisora',
        senderAvatar: '/avatars/ana.jpg',
        message: 'Anotado! Vou repassar essa informação para a equipe. Eles têm experiência com itens delicados. Mais alguma coisa?',
        timestamp: '2025-10-09T10:15:00Z',
        type: 'text',
        read: true
      },
      {
        id: 'msg-006',
        channelId: 'client-support',
        clientId: 'client-001',
        sender: 'client',
        senderName: 'João Silva',
        senderAvatar: '/avatars/client.jpg',
        message: 'Só uma dúvida sobre os produtos de limpeza. Vocês usam produtos ecológicos?',
        timestamp: '2025-10-09T11:00:00Z',
        type: 'text',
        read: false
      },
      {
        id: 'msg-007',
        channelId: 'client-support',
        clientId: 'client-001',
        sender: 'bright-shine',
        senderName: 'Ana Costa - Supervisora',
        senderAvatar: '/avatars/ana.jpg',
        message: 'Sim! Utilizamos uma linha completa de produtos ecológicos e biodegradáveis. São seguros para pets e crianças. Posso enviar a lista dos produtos se desejar.',
        timestamp: '2025-10-09T11:30:00Z',
        type: 'text',
        read: false
      }
    ];

    // Filter by channelId and clientId
    const filteredMessages = messages.filter(msg => 
      msg.channelId === channelId && msg.clientId === clientId
    );

    return NextResponse.json({
      success: true,
      messages: filteredMessages,
      channel: {
        id: channelId,
        name: 'Suporte ao Cliente',
        type: 'support',
        participants: [
          { id: 'client-001', name: 'João Silva', role: 'client' },
          { id: 'support-001', name: 'Ana Costa', role: 'supervisor' },
          { id: 'support-002', name: 'Suporte Bright & Shine', role: 'support' }
        ],
        unreadCount: filteredMessages.filter(msg => !msg.read && msg.sender !== 'client').length
      }
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, channelId, message, type = 'text', attachments = [] } = body;

    const newMessage = {
      id: `msg-${Date.now()}`,
      channelId: channelId || 'client-support',
      clientId,
      sender: 'client',
      senderName: 'João Silva', // In real app, get from auth
      senderAvatar: '/avatars/client.jpg',
      message,
      timestamp: new Date().toISOString(),
      type,
      attachments,
      read: true
    };

    // Simulate auto-response for demo
    const autoResponse = {
      id: `msg-${Date.now() + 1}`,
      channelId: channelId || 'client-support',
      clientId,
      sender: 'bright-shine',
      senderName: 'Suporte Bright & Shine',
      senderAvatar: '/avatars/support.jpg',
      message: 'Obrigado pela sua mensagem! Nossa equipe irá responder em breve. Tempo médio de resposta: 15 minutos.',
      timestamp: new Date(Date.now() + 2000).toISOString(),
      type: 'text',
      read: false
    };

    return NextResponse.json({
      success: true,
      message: newMessage,
      autoResponse,
      messageId: newMessage.id
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
