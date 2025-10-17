import { NextRequest, NextResponse } from 'next/server';import { NextRequest, NextResponse } from 'next/server';// ========================import { NextRequest, NextResponse } from 'next/server';

import { 

  getNotifications, import { 

  createNotification, 

  getNotificationSummary,  getNotifications, // NOTIFICATIONS API ROUTESimport { db } from '../../../lib/database';

  markAllAsRead,

  markAsRead,  createNotification, 

  hasNotificationAccess

} from '@/services/notifications';  getNotificationSummary,// Phase 7 - SURGICAL MODE

import { UserRole } from '@prisma/client';

  markAllAsRead,

export async function GET(request: NextRequest) {

  try {  markAsRead,// ========================export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);

      hasNotificationAccess

    const userCookie = request.cookies.get('bsos-user')?.value;

    if (!userCookie) {} from '@/services/notifications';  try {

      return NextResponse.json(

        { error: 'Authentication required' }, import { UserRole } from '@prisma/client';

        { status: 401 }

      );import { NextRequest, NextResponse } from 'next/server';    const { searchParams } = new URL(request.url);

    }

export async function GET(request: NextRequest) {

    const userData = JSON.parse(userCookie);

    const userId = userData.id;  try {import {     const recipientId = searchParams.get('recipientId');



    const type = searchParams.get('type') || undefined;    const { searchParams } = new URL(request.url);

    const read = searchParams.get('read');

    const limit = parseInt(searchParams.get('limit') || '50');      getNotifications,     const type = searchParams.get('type');

    const offset = parseInt(searchParams.get('offset') || '0');

    const summary = searchParams.get('summary') === 'true';    const userCookie = request.cookies.get('bsos-user')?.value;



    if (summary) {    if (!userCookie) {  createNotification,     const status = searchParams.get('status');

      const summaryData = await getNotificationSummary(userId);

      return NextResponse.json({      return NextResponse.json(

        success: true,

        data: summaryData        { error: 'Authentication required' },   getNotificationSummary,

      });

    }        { status: 401 }



    const result = await getNotifications({      );  markAllAsRead,    let notifications = db.getNotifications();

      userId,

      type: type as any,    }

      read: read === 'true' ? true : read === 'false' ? false : undefined,

      limit,  markAsRead,

      offset

    });    const userData = JSON.parse(userCookie);



    return NextResponse.json(result);    const userId = userData.id;  hasNotificationAccess    // Filtros



  } catch (error) {    const userRole = userData.role as UserRole;

    console.error('GET /api/notifications error:', error);

    return NextResponse.json(} from '@/services/notifications';    if (recipientId) {

      { error: 'Internal server error' }, 

      { status: 500 }    const type = searchParams.get('type') || undefined;

    );

  }    const read = searchParams.get('read');import { UserRole } from '@prisma/client';      notifications = notifications.filter(n => n.recipientId === recipientId);

}

    const limit = parseInt(searchParams.get('limit') || '50');

export async function POST(request: NextRequest) {

  try {    const offset = parseInt(searchParams.get('offset') || '0');    }

    const userCookie = request.cookies.get('bsos-user')?.value;

    if (!userCookie) {    const summary = searchParams.get('summary') === 'true';

      return NextResponse.json(

        { error: 'Authentication required' }, // ========================    if (type) {

        { status: 401 }

      );    if (summary) {

    }

      const summaryData = await getNotificationSummary(userId);// GET /api/notifications      notifications = notifications.filter(n => n.type === type);

    const userData = JSON.parse(userCookie);

    const userRole = userData.role as UserRole;      return NextResponse.json({

    const body = await request.json();

    const { action, ...data } = body;        success: true,// ========================    }



    switch (action) {        data: summaryData

      case 'create':

        if (!hasNotificationAccess(userRole, 'CREATE_TEAM')) {      });export async function GET(request: NextRequest) {    if (status) {

          return NextResponse.json(

            { error: 'Insufficient permissions' },     }

            { status: 403 }

          );  try {      notifications = notifications.filter(n => n.status === status);

        }

    const result = await getNotifications({

        const result = await createNotification({

          userId: data.userId || userData.id,      userId,    const { searchParams } = new URL(request.url);    }

          title: data.title,

          message: data.message,      type: type as any,

          type: data.type

        });      read: read === 'true' ? true : read === 'false' ? false : undefined,    



        return NextResponse.json(result);      limit,



      case 'mark_all_read':      offset    // Get user from headers/cookies (BSOS auth system)    // Ordenar por data de criação (mais recentes primeiro)

        const markResult = await markAllAsRead(userData.id);

        return NextResponse.json(markResult);    });



      default:    const userCookie = request.cookies.get('bsos-user')?.value;    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(

          { error: 'Invalid action' },     return NextResponse.json(result);

          { status: 400 }

        );    if (!userCookie) {

    }

  } catch (error) {

  } catch (error) {

    console.error('POST /api/notifications error:', error);    console.error('GET /api/notifications error:', error);      return NextResponse.json(    return NextResponse.json({ notifications });

    return NextResponse.json(

      { error: 'Internal server error' },     return NextResponse.json(

      { status: 500 }

    );      { error: 'Internal server error' },         { error: 'Authentication required' },   } catch (error) {

  }

}      { status: 500 }

    );        { status: 401 }    console.error('Erro ao buscar notificações:', error);

  }

}      );    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });



export async function POST(request: NextRequest) {    }  }

  try {

    const userCookie = request.cookies.get('bsos-user')?.value;}

    if (!userCookie) {

      return NextResponse.json(    const userData = JSON.parse(userCookie);

        { error: 'Authentication required' }, 

        { status: 401 }    const userId = userData.id;export async function POST(request: NextRequest) {

      );

    }    const userRole = userData.role as UserRole;  try {



    const userData = JSON.parse(userCookie);    const notificationData = await request.json();

    const userRole = userData.role as UserRole;

    // Parse query parameters    

    const body = await request.json();

    const { action, ...data } = body;    const type = searchParams.get('type') || undefined;    // Validações



    switch (action) {    const read = searchParams.get('read');    if (!notificationData.recipientId || !notificationData.type || !notificationData.message) {

      case 'create':

        if (!hasNotificationAccess(userRole, 'CREATE_TEAM')) {    const limit = parseInt(searchParams.get('limit') || '50');      return NextResponse.json({ error: 'Dados obrigatórios não fornecidos' }, { status: 400 });

          return NextResponse.json(

            { error: 'Insufficient permissions' },     const offset = parseInt(searchParams.get('offset') || '0');    }

            { status: 403 }

          );    const summary = searchParams.get('summary') === 'true';

        }

    const notification = db.createNotification({

        const result = await createNotification({

          userId: data.userId || userData.id,    // Return summary if requested      ...notificationData,

          title: data.title,

          message: data.message,    if (summary) {      status: 'pending'

          type: data.type

        });      const summaryData = await getNotificationSummary(userId);    });



        return NextResponse.json(result);      return NextResponse.json({



      case 'mark_all_read':        success: true,    // Processar envio baseado no tipo

        const markResult = await markAllAsRead(userData.id);

        return NextResponse.json(markResult);        data: summaryData    switch (notification.type) {



      default:      });      case 'whatsapp':

        return NextResponse.json(

          { error: 'Invalid action' },     }        await sendWhatsAppMessage(notification);

          { status: 400 }

        );        break;

    }

    // Get notifications for the user      case 'email':

  } catch (error) {

    console.error('POST /api/notifications error:', error);    const result = await getNotifications({        await sendEmailMessage(notification);

    return NextResponse.json(

      { error: 'Internal server error' },       userId,        break;

      { status: 500 }

    );      type: type as any,      case 'sms':

  }

}      read: read === 'true' ? true : read === 'false' ? false : undefined,        await sendSMSMessage(notification);



export async function PUT(request: NextRequest) {      limit,        break;

  try {

    const userCookie = request.cookies.get('bsos-user')?.value;      offset      default:

    if (!userCookie) {

      return NextResponse.json(    });        console.log('Tipo de notificação não suportado:', notification.type);

        { error: 'Authentication required' }, 

        { status: 401 }    }

      );

    }    return NextResponse.json(result);



    const userData = JSON.parse(userCookie);    return NextResponse.json({ notification }, { status: 201 });

    const body = await request.json();

    const { notificationIds, action } = body;  } catch (error) {  } catch (error) {



    if (action === 'mark_read' && Array.isArray(notificationIds)) {    console.error('GET /api/notifications error:', error);    console.error('Erro ao criar notificação:', error);

      const results = await Promise.all(

        notificationIds.map(id => markAsRead(id))    return NextResponse.json(    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });

      );

      { error: 'Internal server error' },   }

      const successful = results.filter(r => r.success).length;

            { status: 500 }}

      return NextResponse.json({

        success: true,    );

        data: { updated: successful }

      });  }// Função para enviar WhatsApp (integração com API do WhatsApp Business)

    }

}async function sendWhatsAppMessage(notification: any) {

    return NextResponse.json(

      { error: 'Invalid bulk action' },   try {

      { status: 400 }

    );// ========================    const recipient = db.getUserById(notification.recipientId);



  } catch (error) {// POST /api/notifications    if (!recipient || !recipient.phone) {

    console.error('PUT /api/notifications error:', error);

    return NextResponse.json(// ========================      throw new Error('Destinatário ou telefone não encontrado');

      { error: 'Internal server error' }, 

      { status: 500 }export async function POST(request: NextRequest) {    }

    );

  }  try {

}
    // Get user from headers/cookies (BSOS auth system)    // Simular envio de WhatsApp

    const userCookie = request.cookies.get('bsos-user')?.value;    // Em produção, você usaria uma API como Twilio, ChatAPI, ou WhatsApp Business API

    if (!userCookie) {    console.log(`[WhatsApp] Enviando para ${recipient.phone}: ${notification.message}`);

      return NextResponse.json(    

        { error: 'Authentication required' },     // Simular delay do envio

        { status: 401 }    await new Promise(resolve => setTimeout(resolve, 1000));

      );    

    }    // Marcar como enviado

    // db.updateNotification(notification.id, { status: 'sent', sentAt: new Date().toISOString() });

    const userData = JSON.parse(userCookie);    

    const userRole = userData.role as UserRole;    return { success: true };

  } catch (error) {

    const body = await request.json();    console.error('Erro ao enviar WhatsApp:', error);

    const { action, ...data } = body;    // db.updateNotification(notification.id, { status: 'failed' });

    return { success: false, error };

    // Handle different POST actions  }

    switch (action) {}

      case 'create':

        // Check permissions for creating notifications// Função para enviar Email

        if (!hasNotificationAccess(userRole, 'CREATE_TEAM')) {async function sendEmailMessage(notification: any) {

          return NextResponse.json(  try {

            { error: 'Insufficient permissions' },     const recipient = db.getUserById(notification.recipientId);

            { status: 403 }    if (!recipient || !recipient.email) {

          );      throw new Error('Destinatário ou email não encontrado');

        }    }



        const result = await createNotification({    // Simular envio de email

          userId: data.userId || userData.id,    // Em produção, você usaria um serviço como SendGrid, Nodemailer, etc.

          title: data.title,    console.log(`[Email] Enviando para ${recipient.email}: ${notification.title}`);

          message: data.message,    

          type: data.type    await new Promise(resolve => setTimeout(resolve, 500));

        });    

    return { success: true };

        return NextResponse.json(result);  } catch (error) {

    console.error('Erro ao enviar email:', error);

      case 'mark_all_read':    return { success: false, error };

        const markResult = await markAllAsRead(userData.id);  }

        return NextResponse.json(markResult);}



      default:// Função para enviar SMS

        return NextResponse.json(async function sendSMSMessage(notification: any) {

          { error: 'Invalid action' },   try {

          { status: 400 }    const recipient = db.getUserById(notification.recipientId);

        );    if (!recipient || !recipient.phone) {

    }      throw new Error('Destinatário ou telefone não encontrado');

    }

  } catch (error) {

    console.error('POST /api/notifications error:', error);    // Simular envio de SMS

    return NextResponse.json(    // Em produção, você usaria Twilio, AWS SNS, etc.

      { error: 'Internal server error' },     console.log(`[SMS] Enviando para ${recipient.phone}: ${notification.message}`);

      { status: 500 }    

    );    await new Promise(resolve => setTimeout(resolve, 800));

  }    

}    return { success: true };

  } catch (error) {

// ========================    console.error('Erro ao enviar SMS:', error);

// PUT /api/notifications    return { success: false, error };

// ========================  }

export async function PUT(request: NextRequest) {}

  try {

    // Get user from headers/cookies (BSOS auth system)// Endpoint para templates de notificação

    const userCookie = request.cookies.get('bsos-user')?.value;export async function PUT(request: NextRequest) {

    if (!userCookie) {  try {

      return NextResponse.json(    const { searchParams } = new URL(request.url);

        { error: 'Authentication required' },     const action = searchParams.get('action');

        { status: 401 }

      );    if (action === 'get_templates') {

    }      const templates = getNotificationTemplates();

      return NextResponse.json({ templates });

    const userData = JSON.parse(userCookie);    }

    const body = await request.json();

    const { notificationIds, action } = body;    if (action === 'send_bulk') {

      const { recipients, template, customData } = await request.json();

    if (action === 'mark_read' && Array.isArray(notificationIds)) {      

      // Bulk mark as read      const results = [];

      const results = await Promise.all(      for (const recipientId of recipients) {

        notificationIds.map(id => markAsRead(id))        const personalizedMessage = personalizeTemplate(template, customData, recipientId);

      );        

        const notification = db.createNotification({

      const successful = results.filter(r => r.success).length;          recipientId,

                recipientType: 'user',

      return NextResponse.json({          type: template.type,

        success: true,          title: template.title,

        data: { updated: successful }          message: personalizedMessage,

      });          status: 'pending',

    }          templateId: template.id

        });

    return NextResponse.json(

      { error: 'Invalid bulk action' },         results.push(notification);

      { status: 400 }      }

    );

      return NextResponse.json({ sent: results.length, notifications: results });

  } catch (error) {    }

    console.error('PUT /api/notifications error:', error);

    return NextResponse.json(    return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 });

      { error: 'Internal server error' },   } catch (error) {

      { status: 500 }    console.error('Erro na ação de notificações:', error);

    );    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });

  }  }

}}

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
