// Client-side notification services
import { NotificationType } from '@prisma/client';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: NotificationType;
  userId?: string; // Optional - defaults to current user
}

export interface NotificationResponse {
  success: boolean;
  data?: Notification | Notification[];
  message: string;
}

/**
 * Get all notifications for current user
 */
export async function getNotifications(): Promise<NotificationResponse> {
  try {
    const response = await fetch('/api/notifications', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      success: false,
      message: 'Failed to fetch notifications'
    };
  }
}

/**
 * Create a new notification
 */
export async function createNotification(
  notificationData: CreateNotificationRequest
): Promise<NotificationResponse> {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    return {
      success: false,
      message: 'Failed to create notification'
    };
  }
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string): Promise<NotificationResponse> {
  try {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: 'PUT',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return {
      success: false,
      message: 'Failed to mark notification as read'
    };
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<NotificationResponse> {
  try {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting notification:', error);
    return {
      success: false,
      message: 'Failed to delete notification'
    };
  }
}

/**
 * Get notification type color for styling
 */
export function getNotificationColor(type: NotificationType): string {
  switch (type) {
    case 'SUCCESS':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'ERROR':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'WARNING':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'INFO':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'SYSTEM':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'TASK_ASSIGNED':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'TASK_COMPLETED':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'PROPERTY_UPDATED':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'PAYMENT_RECEIVED':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Get notification type icon
 */
export function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case 'SUCCESS':
      return '✅';
    case 'ERROR':
      return '❌';
    case 'WARNING':
      return '⚠️';
    case 'INFO':
      return 'ℹ️';
    case 'SYSTEM':
      return '⚙️';
    case 'TASK_ASSIGNED':
      return '📋';
    case 'TASK_COMPLETED':
      return '✅';
    case 'PROPERTY_UPDATED':
      return '🏠';
    case 'PAYMENT_RECEIVED':
      return '💰';
    default:
      return '📧';
  }
}

/**
 * Format notification time for display
 */
export function formatNotificationTime(date: Date | string): string {
  const notificationDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - notificationDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return 'Agora mesmo';
  } else if (diffMins < 60) {
    return `${diffMins} min atrás`;
  } else if (diffHours < 24) {
    return `${diffHours} horas atrás`;
  } else if (diffDays < 7) {
    return `${diffDays} dias atrás`;
  } else {
    return notificationDate.toLocaleDateString('pt-BR');
  }
}