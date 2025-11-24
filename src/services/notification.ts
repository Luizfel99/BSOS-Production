/**
 * Unified Notification Service
 * Routes notifications through Email, SMS, and WhatsApp based on user preferences and message priority
 */

import { sendEmail, EmailTemplate, EmailData } from '@/lib/sendgrid';
import { sendSMS, sendTemplateSMS, smsTemplates } from '@/lib/twilio';
import { sendWhatsAppMessage, sendWhatsAppTemplate, sendWhatsAppText, whatsAppTemplates } from '@/lib/whatsapp';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Notification channels
 */
export type NotificationChannel = 'email' | 'sms' | 'whatsapp';

/**
 * Notification priority levels
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Notification types
 */
export type NotificationType =
  | 'task_assigned'
  | 'task_completed'
  | 'task_reminder'
  | 'booking_confirmed'
  | 'booking_reminder'
  | 'payment_receipt'
  | 'password_reset'
  | 'verification_code'
  | 'team_invitation'
  | 'low_stock_alert'
  | 'emergency_alert'
  | 'custom';

/**
 * Notification data structure
 */
export interface NotificationData {
  userId: string;
  type: NotificationType;
  priority?: NotificationPriority;
  channels?: NotificationChannel[];
  email?: string;
  phone?: string;
  whatsapp?: string;
  variables?: Record<string, any>;
  customMessage?: string;
  subject?: string;
}

/**
 * Notification result
 */
export interface NotificationResult {
  success: boolean;
  channels: {
    email?: { sent: boolean; error?: string };
    sms?: { sent: boolean; error?: string };
    whatsapp?: { sent: boolean; error?: string };
  };
}

/**
 * Channel priority mapping
 */
const channelPriorityMap: Record<NotificationPriority, NotificationChannel[]> = {
  low: ['email'],
  medium: ['email', 'sms'],
  high: ['email', 'sms', 'whatsapp'],
  urgent: ['sms', 'whatsapp', 'email']
};

/**
 * Get user's notification preferences
 */
async function getUserPreferences(userId: string) {
  try {
    const prefs = await prisma.userPreference.findUnique({
      where: { userId },
      include: { user: true }
    });
  const prefsData = (prefs?.prefs as any) || {};


    return {
      email: prefs?.user?.email,
      phone: prefsData.notificationPhone || null,
      whatsapp: prefsData.notificationWhatsApp || null,
      emailEnabled: prefsData.emailNotifications ?? true,
      smsEnabled: prefsData.smsNotifications ?? false,
      whatsappEnabled: prefsData.whatsappNotifications ?? false,
    };
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
}

/**
 * Send notification via email
 */
async function sendEmailNotification(
  type: NotificationType,
  email: string,
  variables: Record<string, any>,
  subject?: string
): Promise<{ sent: boolean; error?: string }> {
  try {
    const templateMap: Record<NotificationType, EmailTemplate> = {
      task_assigned: 'task_assigned',
      task_completed: 'task_completed',
      task_reminder: 'task_assigned', // Reuse template
      booking_confirmed: 'booking_confirmed',
      booking_reminder: 'booking_reminder',
      payment_receipt: 'payment_receipt',
      password_reset: 'password_reset',
      verification_code: 'verification_code',
      team_invitation: 'team_invitation',
      low_stock_alert: 'low_stock_alert',
      emergency_alert: 'custom',
      custom: 'custom'
    };

    const template = templateMap[type];
    
    const emailData: EmailData = {
      to: email,
      subject: subject || '',
      template,
      variables
    };

    const sent = await sendEmail(emailData);
    return { sent };

  } catch (error: any) {
    return { sent: false, error: error.message };
  }
}

/**
 * Send notification via SMS
 */
async function sendSMSNotification(
  type: NotificationType,
  phone: string,
  variables: Record<string, any>
): Promise<{ sent: boolean; error?: string }> {
  try {
    const templateMap: Record<NotificationType, keyof typeof smsTemplates> = {
      task_assigned: 'taskAssigned',
      task_completed: 'taskCompleted',
      task_reminder: 'taskReminder',
      booking_confirmed: 'bookingConfirmation',
      booking_reminder: 'checkInReminder',
      payment_receipt: 'custom',
      password_reset: 'passwordResetCode',
      verification_code: 'verificationCode',
      team_invitation: 'custom',
      low_stock_alert: 'lowStockAlert',
      emergency_alert: 'emergencyAlert',
      custom: 'custom'
    };

    const template = templateMap[type];
    const args = Object.values(variables);
    
    const sent = await sendTemplateSMS(phone, template, ...args);
    return { sent };

  } catch (error: any) {
    return { sent: false, error: error.message };
  }
}

/**
 * Send notification via WhatsApp
 */
async function sendWhatsAppNotification(
  type: NotificationType,
  whatsapp: string,
  variables: Record<string, any>
): Promise<{ sent: boolean; error?: string }> {
  try {
    // For approved templates only
    if (type in whatsAppTemplates) {
      const template = type.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
        .replace(/^[a-z]/, letter => letter.toLowerCase()) as keyof typeof whatsAppTemplates;
      
      const args = Object.values(variables);
      const sent = await sendWhatsAppTemplate(whatsapp, template, ...args);
      return { sent };
    }

    // Fallback to text message (requires 24-hour window)
    const message = variables.message || variables.customMessage || 'Notification from Bright & Shine';
    const sent = await sendWhatsAppText(whatsapp, message);
    return { sent };

  } catch (error: any) {
    return { sent: false, error: error.message };
  }
}

/**
 * Send notification through multiple channels
 */
export async function sendNotification(data: NotificationData): Promise<NotificationResult> {
  const result: NotificationResult = {
    success: false,
    channels: {}
  };

  try {
    // Get user preferences
    const prefs = await getUserPreferences(data.userId);
    if (!prefs) {
      throw new Error('User preferences not found');
    }

    // Determine channels to use
    const priority = data.priority || 'medium';
    const defaultChannels = channelPriorityMap[priority];
    const channels = data.channels || defaultChannels;

    // Override with provided contact info
    const email = data.email || prefs.email;
    const phone = data.phone || prefs.phone;
    const whatsapp = data.whatsapp || prefs.whatsapp;

    const variables = data.variables || {};

    // Send via requested channels
    const promises: Promise<void>[] = [];

    if (channels.includes('email') && email && prefs.emailEnabled) {
      promises.push(
        sendEmailNotification(data.type, email, variables, data.subject).then(res => {
          result.channels.email = res;
        })
      );
    }

    if (channels.includes('sms') && phone && prefs.smsEnabled) {
      promises.push(
        sendSMSNotification(data.type, phone, variables).then(res => {
          result.channels.sms = res;
        })
      );
    }

    if (channels.includes('whatsapp') && whatsapp && prefs.whatsappEnabled) {
      promises.push(
        sendWhatsAppNotification(data.type, whatsapp, variables).then(res => {
          result.channels.whatsapp = res;
        })
      );
    }

    // Wait for all notifications to complete
    await Promise.all(promises);

    // Consider success if at least one channel succeeded
    result.success = Object.values(result.channels).some(ch => ch.sent);

    return result;

  } catch (error: any) {
    console.error('Notification Error:', error.message);
    return result;
  }
}

/**
 * Send bulk notifications
 */
export async function sendBulkNotifications(
  notifications: NotificationData[]
): Promise<NotificationResult[]> {
  const results: NotificationResult[] = [];

  for (const notification of notifications) {
    const result = await sendNotification(notification);
    results.push(result);
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Send notification with retry logic
 */
export async function sendNotificationWithRetry(
  data: NotificationData,
  maxRetries: number = 3
): Promise<NotificationResult> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendNotification(data);
      
      if (result.success) {
        return result;
      }

      lastError = new Error('All channels failed');

      // Exponential backoff
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }

    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  console.error(`Failed to send notification after ${maxRetries} attempts:`, lastError);
  return {
    success: false,
    channels: {}
  };
}

/**
 * Helper functions for common notification scenarios
 */
export const notificationHelpers = {
  taskAssigned: async (userId: string, taskTitle: string, propertyName: string, dueDate: string, taskUrl: string) => {
    return sendNotification({
      userId,
      type: 'task_assigned',
      priority: 'medium',
      variables: {
        assigneeName: 'User',
        taskTitle,
        propertyName,
        dueDate,
        priority: 'Normal',
        taskUrl
      }
    });
  },

  taskCompleted: async (userId: string, taskTitle: string, propertyName: string, completedBy: string, taskUrl: string) => {
    return sendNotification({
      userId,
      type: 'task_completed',
      priority: 'low',
      variables: {
        managerName: 'Manager',
        taskTitle,
        propertyName,
        completedBy,
        completedAt: new Date().toLocaleString(),
        taskUrl
      }
    });
  },

  bookingConfirmed: async (userId: string, propertyName: string, checkIn: string, checkOut: string, confirmationCode: string) => {
    return sendNotification({
      userId,
      type: 'booking_confirmed',
      priority: 'high',
      variables: {
        guestName: 'Guest',
        propertyName,
        checkIn,
        checkOut,
        guests: '2',
        confirmationCode
      }
    });
  },

  verificationCode: async (userId: string, code: string, email: string) => {
    return sendNotification({
      userId,
      type: 'verification_code',
      priority: 'urgent',
      channels: ['email', 'sms'],
      email,
      variables: {
        name: 'User',
        code,
        expiresIn: '10 minutes'
      }
    });
  },

  passwordReset: async (userId: string, resetUrl: string, email: string) => {
    return sendNotification({
      userId,
      type: 'password_reset',
      priority: 'high',
      channels: ['email'],
      email,
      variables: {
        name: 'User',
        resetUrl,
        expiresIn: '1 hour'
      }
    });
  },

  lowStockAlert: async (userId: string, itemName: string, currentStock: number, minStock: number, category: string) => {
    return sendNotification({
      userId,
      type: 'low_stock_alert',
      priority: 'medium',
      variables: {
        managerName: 'Manager',
        itemName,
        currentStock: currentStock.toString(),
        minStock: minStock.toString(),
        unit: 'units',
        category
      }
    });
  }
};
