import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get('recipientId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let notifications = db.getNotifications();

    // Filtros
    if (recipientId) {
      notifications = notifications.filter(n => n.recipientId === recipientId);
    }
    if (type) {
      notifications = notifications.filter(n => n.type === type);
    }
    if (status) {
      notifications = notifications.filter(n => n.status === status);
    }

    // Ordenar por data de criação (mais recentes primeiro)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const notificationData = await request.json();
    
    // Validações
    if (!notificationData.recipientId || !notificationData.type || !notificationData.message) {
      return NextResponse.json({ error: 'Dados obrigatórios não fornecidos' }, { status: 400 });
    }

    const notification = db.createNotification({
      ...notificationData,
      status: 'pending'
    });

    // Processar envio baseado no tipo
    switch (notification.type) {
      case 'whatsapp':
        await sendWhatsAppMessage(notification);
        break;
      case 'email':
        await sendEmailMessage(notification);
        break;
      case 'sms':
        await sendSMSMessage(notification);
        break;
      default:
        console.log('Tipo de notificação não suportado:', notification.type);
    }

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// Função para enviar WhatsApp (integração com API do WhatsApp Business)
async function sendWhatsAppMessage(notification: any) {
  try {
    const recipient = db.getUserById(notification.recipientId);
    if (!recipient || !recipient.phone) {
      throw new Error('Destinatário ou telefone não encontrado');
    }

    // Simular envio de WhatsApp
    // Em produção, você usaria uma API como Twilio, ChatAPI, ou WhatsApp Business API
    console.log(`[WhatsApp] Enviando para ${recipient.phone}: ${notification.message}`);
    
    // Simular delay do envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Marcar como enviado
    // db.updateNotification(notification.id, { status: 'sent', sentAt: new Date().toISOString() });
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    // db.updateNotification(notification.id, { status: 'failed' });
    return { success: false, error };
  }
}

// Função para enviar Email
async function sendEmailMessage(notification: any) {
  try {
    const recipient = db.getUserById(notification.recipientId);
    if (!recipient || !recipient.email) {
      throw new Error('Destinatário ou email não encontrado');
    }

    // Simular envio de email
    // Em produção, você usaria um serviço como SendGrid, Nodemailer, etc.
    console.log(`[Email] Enviando para ${recipient.email}: ${notification.title}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error };
  }
}

// Função para enviar SMS
async function sendSMSMessage(notification: any) {
  try {
    const recipient = db.getUserById(notification.recipientId);
    if (!recipient || !recipient.phone) {
      throw new Error('Destinatário ou telefone não encontrado');
    }

    // Simular envio de SMS
    // Em produção, você usaria Twilio, AWS SNS, etc.
    console.log(`[SMS] Enviando para ${recipient.phone}: ${notification.message}`);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    return { success: false, error };
  }
}

// Endpoint para templates de notificação
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'get_templates') {
      const templates = getNotificationTemplates();
      return NextResponse.json({ templates });
    }

    if (action === 'send_bulk') {
      const { recipients, template, customData } = await request.json();
      
      const results = [];
      for (const recipientId of recipients) {
        const personalizedMessage = personalizeTemplate(template, customData, recipientId);
        
        const notification = db.createNotification({
          recipientId,
          recipientType: 'user',
          type: template.type,
          title: template.title,
          message: personalizedMessage,
          status: 'pending',
          templateId: template.id
        });

        results.push(notification);
      }

      return NextResponse.json({ sent: results.length, notifications: results });
    }

    return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 });
  } catch (error) {
    console.error('Erro na ação de notificações:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

function getNotificationTemplates() {
  return [
    {
      id: 'task_assigned',
      name: 'Tarefa Atribuída',
      type: 'whatsapp',
      title: 'Nova Tarefa',
      template: 'Olá {name}! Você tem uma nova tarefa de {taskType} agendada para {date} às {time} na propriedade {propertyName}. Endereço: {address}',
      variables: ['name', 'taskType', 'date', 'time', 'propertyName', 'address']
    },
    {
      id: 'task_reminder',
      name: 'Lembrete de Tarefa',
      type: 'whatsapp',
      title: 'Lembrete',
      template: 'Lembrete: Você tem uma tarefa de {taskType} às {time} na propriedade {propertyName}. Não esqueça!',
      variables: ['taskType', 'time', 'propertyName']
    },
    {
      id: 'task_completed',
      name: 'Tarefa Concluída',
      type: 'whatsapp',
      title: 'Tarefa Concluída',
      template: 'Tarefa de {taskType} na propriedade {propertyName} foi marcada como concluída. Obrigado!',
      variables: ['taskType', 'propertyName']
    },
    {
      id: 'bonus_notification',
      name: 'Bonificação Recebida',
      type: 'whatsapp',
      title: 'Bonificação! 🎉',
      template: 'Parabéns {name}! Você recebeu uma bonificação de R$ {amount} pela excelente execução da tarefa. Continue assim!',
      variables: ['name', 'amount']
    },
    {
      id: 'new_reservation',
      name: 'Nova Reserva',
      type: 'email',
      title: 'Nova Reserva Recebida',
      template: 'Uma nova reserva foi recebida para {propertyName}. Hóspede: {guestName}, Check-in: {checkIn}, Check-out: {checkOut}',
      variables: ['propertyName', 'guestName', 'checkIn', 'checkOut']
    },
    {
      id: 'checkout_notification',
      name: 'Notificação de Checkout',
      type: 'whatsapp',
      title: 'Checkout Hoje',
      template: 'Hoje temos checkout na propriedade {propertyName} às {time}. Hóspede: {guestName}. A limpeza está agendada para logo após.',
      variables: ['propertyName', 'time', 'guestName']
    },
    {
      id: 'checkin_notification',
      name: 'Notificação de Checkin',
      type: 'whatsapp',
      title: 'Checkin Hoje',
      template: 'Hoje temos checkin na propriedade {propertyName} às {time}. Hóspede: {guestName}. Certifique-se de que tudo está pronto!',
      variables: ['propertyName', 'time', 'guestName']
    },
    {
      id: 'low_stock_alert',
      name: 'Alerta de Estoque Baixo',
      type: 'email',
      title: 'Alerta: Estoque Baixo',
      template: 'O item {itemName} está com estoque baixo. Quantidade atual: {currentStock} {unit}. Quantidade mínima: {minStock} {unit}.',
      variables: ['itemName', 'currentStock', 'unit', 'minStock']
    }
  ];
}

function personalizeTemplate(template: any, customData: any, recipientId: string) {
  let message = template.template;
  const recipient = db.getUserById(recipientId);
  
  // Substituir variáveis padrão
  if (recipient) {
    message = message.replace(/{name}/g, recipient.name);
  }
  
  // Substituir variáveis personalizadas
  for (const [key, value] of Object.entries(customData)) {
    const regex = new RegExp(`{${key}}`, 'g');
    message = message.replace(regex, String(value));
  }
  
  return message;
}
