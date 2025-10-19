import { NextRequest, NextResponse } from 'next/server';

// POST /api/communication/send
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { channel_id, message, sender_id, message_type, attachments } = body;

    // Validar dados obrigatórios
    if (!channel_id || !message || !sender_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados obrigatórios ausentes',
          message: 'ID do canal, mensagem e remetente são obrigatórios',
        },
        { status: 400 }
      );
    }

    // Simular envio da mensagem
    const mockMessage = {
      id: `msg-${Date.now()}`,
      channelId: channel_id,
      senderId: sender_id,
      senderName: 'Usuário Atual', // TODO: Buscar do banco
      message,
      messageType: message_type || 'text',
      attachments: attachments || [],
      timestamp: new Date().toISOString(),
      status: 'sent',
      readBy: [],
    };

    console.log('💬 Mensagem enviada:', mockMessage);

    // Simular notificação para membros do canal
    const channelMembers = ['emp-123', 'supervisor-456', 'admin-789'];
    const notifications = channelMembers
      .filter(memberId => memberId !== sender_id)
      .map(memberId => ({
        userId: memberId,
        type: 'new_message',
        channelId: channel_id,
        messageId: mockMessage.id,
        sentAt: new Date().toISOString(),
      }));

    return NextResponse.json({
      success: true,
      data: {
        message: mockMessage,
        notifications,
        channelInfo: {
          id: channel_id,
          totalMessages: Math.floor(Math.random() * 100) + 1,
          activeMembers: channelMembers.length,
        },
      },
      message: 'Mensagem enviada com sucesso! 📨',
    });

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível enviar a mensagem',
      },
      { status: 500 }
    );
  }
}
