import { ApiResponse } from '@/lib/handlers';

// Tipos para comunicação
export interface MessageData {
  content: string;
  channelId?: string;
  recipientId?: string;
  type: 'text' | 'image' | 'document' | 'voice';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: File[];
}

export interface NotificationData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  recipients: string[];
  scheduledFor?: string;
  actionUrl?: string;
  data?: any;
}

export interface ChannelData {
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  members: string[];
}

/**
 * 💬 SERVIÇOS DE COMUNICAÇÃO
 * Funções para gerenciar mensagens, notificações e canais
 */

// Enviar mensagem
export const sendMessage = async (data: MessageData): Promise<ApiResponse> => {
  const formData = new FormData();
  
  formData.append('content', data.content);
  formData.append('type', data.type);
  
  if (data.channelId) formData.append('channelId', data.channelId);
  if (data.recipientId) formData.append('recipientId', data.recipientId);
  if (data.priority) formData.append('priority', data.priority);
  
  if (data.attachments) {
    data.attachments.forEach((file, index) => {
      formData.append(`attachment_${index}`, file);
    });
  }
  
  const res = await fetch('/api/communication/send', {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) {
    throw new Error(`Failed to send message: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar mensagens
export const getMessages = async (filters?: {
  channelId?: string;
  recipientId?: string;
  senderId?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
  }
  
  const res = await fetch(`/api/communication/messages?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch messages: ${res.statusText}`);
  }
  
  return res.json();
};

// Criar canal de comunicação
export const createChannel = async (data: ChannelData): Promise<ApiResponse> => {
  const res = await fetch('/api/communication/channels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create channel: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar canais
export const getChannels = async (filters?: {
  type?: string;
  memberId?: string;
}): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  
  const res = await fetch(`/api/communication/channels?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch channels: ${res.statusText}`);
  }
  
  return res.json();
};

// Marcar mensagens como lidas
export const markChannelAsRead = async (channelId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/communication/channels/${channelId}/read`, {
    method: 'POST',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to mark channel as read: ${res.statusText}`);
  }
  
  return res.json();
};

// Criar notificação
export const createNotification = async (data: NotificationData): Promise<ApiResponse> => {
  const res = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create notification: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar notificações
export const getNotifications = async (filters?: {
  recipientId?: string;
  type?: string;
  read?: boolean;
  limit?: number;
}): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
  }
  
  const res = await fetch(`/api/notifications?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.statusText}`);
  }
  
  return res.json();
};

// Marcar notificação como lida
export const markNotificationAsRead = async (notificationId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to mark notification as read: ${res.statusText}`);
  }
  
  return res.json();
};

// Marcar todas as notificações como lidas
export const markAllNotificationsAsRead = async (recipientId: string): Promise<ApiResponse> => {
  const res = await fetch('/api/notifications/read-all', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipientId }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to mark all notifications as read: ${res.statusText}`);
  }
  
  return res.json();
};

// Deletar notificação
export const deleteNotification = async (notificationId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/notifications/${notificationId}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to delete notification: ${res.statusText}`);
  }
  
  return res.json();
};