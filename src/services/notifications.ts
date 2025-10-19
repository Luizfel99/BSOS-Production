// ========================
// NOTIFICATIONS SERVICE
// Phase 7 - SURGICAL MODE
// ========================

import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// Define notification types locally since they're not exported from Prisma yet
export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  SYSTEM = 'SYSTEM',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  PROPERTY_UPDATED = 'PROPERTY_UPDATED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED'
}

// ========================
// INTERFACES & TYPES
// ========================

export interface NotificationCreate {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
}

export interface NotificationUpdate {
  read?: boolean;
  title?: string;
  message?: string;
  type?: NotificationType;
}

export interface NotificationFilter {
  userId?: string;
  type?: NotificationType;
  read?: boolean;
  limit?: number;
  offset?: number;
}

export interface NotificationSummary {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  recent: any[];
}

// ========================
// CORE NOTIFICATION OPERATIONS
// ========================

/**
 * Get notifications with filtering and pagination
 */
export async function getNotifications(filter: NotificationFilter = {}) {
  try {
    const { userId, type, read, limit = 50, offset = 0 } = filter;

    const where: any = {};
    if (userId) where.userId = userId;
    if (type) where.type = type;
    if (typeof read === 'boolean') where.read = read;

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.notification.count({ where });

    return {
      success: true,
      data: notifications,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      success: false,
      error: 'Failed to fetch notifications',
      data: []
    };
  }
}

/**
 * Create a new notification
 */
export async function createNotification(data: NotificationCreate) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || NotificationType.INFO,
        read: false
      }
    });

    return {
      success: true,
      data: notification
    };
  } catch (error) {
    console.error('Error creating notification:', error);
    return {
      success: false,
      error: 'Failed to create notification'
    };
  }
}

/**
 * Update notification (mainly for marking as read)
 */
export async function updateNotification(id: string, data: NotificationUpdate) {
  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });

    return {
      success: true,
      data: notification
    };
  } catch (error) {
    console.error('Error updating notification:', error);
    return {
      success: false,
      error: 'Failed to update notification'
    };
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(id: string) {
  try {
    await prisma.notification.delete({
      where: { id }
    });

    return {
      success: true,
      message: 'Notification deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return {
      success: false,
      error: 'Failed to delete notification'
    };
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(id: string) {
  return updateNotification(id, { read: true });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
  try {
    const result = await prisma.notification.updateMany({
      where: { 
        userId: userId,
        read: false 
      },
      data: { 
        read: true,
        updatedAt: new Date()
      }
    });

    return {
      success: true,
      data: { updated: result.count }
    };
  } catch (error) {
    console.error('Error marking all as read:', error);
    return {
      success: false,
      error: 'Failed to mark all notifications as read'
    };
  }
}

/**
 * Get notification summary for a user
 */
export async function getNotificationSummary(userId: string): Promise<NotificationSummary> {
  try {
    const total = await prisma.notification.count({
      where: { userId }
    });

    const unread = await prisma.notification.count({
      where: { userId, read: false }
    });

    // Count by type
    const byTypeResults = await prisma.notification.groupBy({
      by: ['type'],
      where: { userId },
      _count: { type: true }
    });

    const byType: Record<NotificationType, number> = {
      INFO: 0,
      WARNING: 0,
      SUCCESS: 0,
      ERROR: 0,
      SYSTEM: 0,
      TASK_ASSIGNED: 0,
      TASK_COMPLETED: 0,
      PROPERTY_UPDATED: 0,
      PAYMENT_RECEIVED: 0
    };

    byTypeResults.forEach(result => {
      byType[result.type] = result._count.type;
    });

    // Get recent notifications
    const recent = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return {
      total,
      unread,
      byType,
      recent
    };
  } catch (error) {
    console.error('Error getting notification summary:', error);
    return {
      total: 0,
      unread: 0,
      byType: {
        INFO: 0,
        WARNING: 0,
        SUCCESS: 0,
        ERROR: 0,
        SYSTEM: 0,
        TASK_ASSIGNED: 0,
        TASK_COMPLETED: 0,
        PROPERTY_UPDATED: 0,
        PAYMENT_RECEIVED: 0
      },
      recent: []
    };
  }
}

// ========================
// BULK OPERATIONS
// ========================

/**
 * Create notifications for multiple users
 */
export async function createBulkNotification(
  userIds: string[], 
  notification: Omit<NotificationCreate, 'userId'>
) {
  try {
    const notifications = userIds.map(userId => ({
      userId,
      title: notification.title,
      message: notification.message,
      type: notification.type || NotificationType.INFO,
      read: false
    }));

    const result = await prisma.notification.createMany({
      data: notifications
    });

    return {
      success: true,
      data: { created: result.count }
    };
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    return {
      success: false,
      error: 'Failed to create bulk notifications'
    };
  }
}

/**
 * Delete old notifications (cleanup)
 */
export async function cleanupOldNotifications(daysOld = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        },
        read: true
      }
    });

    return {
      success: true,
      data: { deleted: result.count }
    };
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
    return {
      success: false,
      error: 'Failed to cleanup old notifications'
    };
  }
}

// ========================
// ROLE-BASED HELPERS
// ========================

/**
 * Check if user has access to notification operations
 */
export function hasNotificationAccess(userRole: UserRole, targetOperation: string): boolean {
  switch (targetOperation) {
    case 'CREATE_SYSTEM':
    case 'BULK_CREATE':
    case 'CLEANUP':
      return userRole === UserRole.ADMIN;
    
    case 'CREATE_TEAM':
      return userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;
    
    case 'READ_OWN':
    case 'UPDATE_OWN':
    case 'DELETE_OWN':
      return true; // All roles can manage their own notifications
    
    default:
      return false;
  }
}

/**
 * Create system notification (for admins/owners only)
 */
export async function createSystemNotification(
  title: string, 
  message: string, 
  userIds?: string[]
) {
  try {
    // If no specific users, notify all ADMIN and OWNER users
    if (!userIds || userIds.length === 0) {
      const adminUsers = await prisma.user.findMany({
        where: {
          role: { in: [UserRole.ADMIN] },
          active: true
        },
        select: { id: true }
      });
      
      userIds = adminUsers.map(user => user.id);
    }

    return createBulkNotification(userIds, {
      title,
      message,
      type: NotificationType.SYSTEM
    });
  } catch (error) {
    console.error('Error creating system notification:', error);
    return {
      success: false,
      error: 'Failed to create system notification'
    };
  }
}

// ========================
// NOTIFICATION TRIGGERS
// ========================

/**
 * Send task assignment notification
 */
export async function notifyTaskAssigned(userId: string, taskTitle: string) {
  return createNotification({
    userId,
    title: 'New Task Assigned',
    message: `You have been assigned to: ${taskTitle}`,
    type: NotificationType.TASK_ASSIGNED
  });
}

/**
 * Send task completion notification
 */
export async function notifyTaskCompleted(userId: string, taskTitle: string) {
  return createNotification({
    userId,
    title: 'Task Completed',
    message: `Task completed: ${taskTitle}`,
    type: NotificationType.TASK_COMPLETED
  });
}

/**
 * Send property update notification
 */
export async function notifyPropertyUpdated(userId: string, propertyName: string) {
  return createNotification({
    userId,
    title: 'Property Updated',
    message: `Property "${propertyName}" has been updated`,
    type: NotificationType.PROPERTY_UPDATED
  });
}

/**
 * Send payment received notification
 */
export async function notifyPaymentReceived(userId: string, amount: number) {
  return createNotification({
    userId,
    title: 'Payment Received',
    message: `Payment of $${amount.toFixed(2)} has been received`,
    type: NotificationType.PAYMENT_RECEIVED
  });
}

export default {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  getNotificationSummary,
  createBulkNotification,
  cleanupOldNotifications,
  hasNotificationAccess,
  createSystemNotification,
  notifyTaskAssigned,
  notifyTaskCompleted,
  notifyPropertyUpdated,
  notifyPaymentReceived
};