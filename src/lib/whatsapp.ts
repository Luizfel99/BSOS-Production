/**
 * WhatsApp Business API Integration
 * Supports both Cloud API and Business Solution Provider (BSP) integrations
 */

// WhatsApp configuration
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || 'v18.0';

/**
 * WhatsApp message types
 */
export type WhatsAppMessageType = 'text' | 'template' | 'media' | 'interactive';

/**
 * WhatsApp message data
 */
export interface WhatsAppMessage {
  to: string;
  type: WhatsAppMessageType;
  text?: string;
  templateName?: string;
  templateLanguage?: string;
  templateParams?: string[];
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document';
  caption?: string;
}

/**
 * Send WhatsApp message using Cloud API
 */
export async function sendWhatsAppMessage(data: WhatsAppMessage): Promise<boolean> {
  try {
    if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
      console.warn('WhatsApp API not configured. Message not sent.');
      return false;
    }

    const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    let messageBody: any = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: data.to
    };

    // Build message based on type
    switch (data.type) {
      case 'text':
        messageBody.type = 'text';
        messageBody.text = { body: data.text };
        break;

      case 'template':
        messageBody.type = 'template';
        messageBody.template = {
          name: data.templateName,
          language: { code: data.templateLanguage || 'en' },
          components: data.templateParams ? [
            {
              type: 'body',
              parameters: data.templateParams.map(param => ({
                type: 'text',
                text: param
              }))
            }
          ] : []
        };
        break;

      case 'media':
        if (!data.mediaUrl || !data.mediaType) {
          throw new Error('Media URL and type are required for media messages');
        }
        messageBody.type = data.mediaType;
        messageBody[data.mediaType] = {
          link: data.mediaUrl,
          caption: data.caption
        };
        break;

      default:
        throw new Error(`Unsupported message type: ${data.type}`);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(messageBody)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'WhatsApp API request failed');
    }

    console.log(`WhatsApp message sent to ${data.to}. Message ID: ${result.messages?.[0]?.id}`);
    return true;

  } catch (error: any) {
    console.error('WhatsApp Error:', error.message);
    return false;
  }
}

/**
 * Send bulk WhatsApp messages
 */
export async function sendBulkWhatsApp(
  recipients: string[],
  messageData: Omit<WhatsAppMessage, 'to'>
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const success = await sendWhatsAppMessage({ ...messageData, to: recipient });
    if (success) {
      sent++;
    } else {
      failed++;
    }
    
    // Rate limiting: WhatsApp Cloud API allows ~80 msg/sec, but we'll be conservative
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { sent, failed };
}

/**
 * WhatsApp message templates (must be pre-approved in Meta Business Suite)
 */
export const whatsAppTemplates = {
  taskAssigned: {
    name: 'task_assigned',
    language: 'en',
    buildParams: (assigneeName: string, taskTitle: string, dueDate: string) => [
      assigneeName,
      taskTitle,
      dueDate
    ]
  },

  bookingConfirmation: {
    name: 'booking_confirmation',
    language: 'en',
    buildParams: (guestName: string, propertyName: string, checkIn: string, confirmationCode: string) => [
      guestName,
      propertyName,
      checkIn,
      confirmationCode
    ]
  },

  checkInReminder: {
    name: 'checkin_reminder',
    language: 'en',
    buildParams: (guestName: string, propertyName: string, checkInTime: string, accessCode: string) => [
      guestName,
      propertyName,
      checkInTime,
      accessCode
    ]
  },

  verificationCode: {
    name: 'verification_code',
    language: 'en',
    buildParams: (code: string) => [code]
  },

  passwordReset: {
    name: 'password_reset',
    language: 'en',
    buildParams: (name: string, resetCode: string) => [name, resetCode]
  },

  paymentReceipt: {
    name: 'payment_receipt',
    language: 'en',
    buildParams: (customerName: string, amount: string, date: string, transactionId: string) => [
      customerName,
      amount,
      date,
      transactionId
    ]
  },

  lowStockAlert: {
    name: 'low_stock_alert',
    language: 'en',
    buildParams: (managerName: string, itemName: string, currentStock: string) => [
      managerName,
      itemName,
      currentStock
    ]
  }
};

/**
 * Send templated WhatsApp message
 */
export async function sendWhatsAppTemplate(
  to: string,
  template: keyof typeof whatsAppTemplates,
  ...args: any[]
): Promise<boolean> {
  const templateConfig = whatsAppTemplates[template];
  const build = templateConfig.buildParams as (...a: any[]) => string[];
  const params = build(...args);

  return sendWhatsAppMessage({
    to,
    type: 'template',
    templateName: templateConfig.name,
    templateLanguage: templateConfig.language,
    templateParams: params
  });
}

/**
 * Send simple text WhatsApp message (requires 24-hour window or user-initiated conversation)
 */
export async function sendWhatsAppText(to: string, message: string): Promise<boolean> {
  return sendWhatsAppMessage({
    to,
    type: 'text',
    text: message
  });
}

/**
 * Send WhatsApp media (image, video, document)
 */
export async function sendWhatsAppMedia(
  to: string,
  mediaUrl: string,
  mediaType: 'image' | 'video' | 'document',
  caption?: string
): Promise<boolean> {
  return sendWhatsAppMessage({
    to,
    type: 'media',
    mediaUrl,
    mediaType,
    caption
  });
}

/**
 * Verify WhatsApp configuration
 */
export function isWhatsAppConfigured(): boolean {
  return !!WHATSAPP_PHONE_NUMBER_ID && !!WHATSAPP_ACCESS_TOKEN;
}

/**
 * Validate WhatsApp phone number format
 */
export function validateWhatsAppNumber(phone: string): boolean {
  // WhatsApp requires E.164 format without + symbol
  const whatsappRegex = /^[1-9]\d{1,14}$/;
  const cleanPhone = phone.replace(/^\+/, '');
  return whatsappRegex.test(cleanPhone);
}

/**
 * Format phone number for WhatsApp (E.164 without +)
 */
export function formatWhatsAppNumber(phone: string): string {
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');
  
  // Remove leading + if present
  if (phone.startsWith('+')) {
    digits = phone.substring(1).replace(/\D/g, '');
  }
  
  // If 10 digits (US format), add country code
  if (digits.length === 10) {
    return '1' + digits;
  }
  
  return digits;
}

/**
 * Get message template status (requires Business Account ID)
 */
export async function getTemplateStatus(templateName: string): Promise<any> {
  try {
    if (!WHATSAPP_BUSINESS_ACCOUNT_ID || !WHATSAPP_ACCESS_TOKEN) {
      throw new Error('WhatsApp Business Account not configured');
    }

    const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates?name=${templateName}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch template status');
    }

    return await response.json();

  } catch (error: any) {
    console.error('WhatsApp Template Status Error:', error.message);
    return null;
  }
}
