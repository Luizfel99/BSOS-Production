import twilio from 'twilio';

// Twilio configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: ReturnType<typeof twilio> | null = null;

/**
 * Get Twilio client instance (lazy initialization)
 */
function getTwilioClient() {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error('Twilio credentials not configured');
  }

  if (!twilioClient) {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  return twilioClient;
}

/**
 * SMS data structure
 */
export interface SMSData {
  to: string;
  message: string;
  from?: string;
}

/**
 * Send SMS via Twilio
 */
export async function sendSMS(data: SMSData): Promise<boolean> {
  try {
    const client = getTwilioClient();

    if (!TWILIO_PHONE_NUMBER && !data.from) {
      throw new Error('Twilio phone number not configured');
    }

    const message = await client.messages.create({
      body: data.message,
      from: data.from || TWILIO_PHONE_NUMBER,
      to: data.to
    });

    console.log(`SMS sent successfully to ${data.to}. SID: ${message.sid}`);
    return true;

  } catch (error: any) {
    console.error('Twilio SMS Error:', error.message);
    return false;
  }
}

/**
 * Send bulk SMS
 */
export async function sendBulkSMS(
  recipients: string[],
  message: string
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const success = await sendSMS({ to: recipient, message });
    if (success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}

/**
 * SMS templates for common scenarios
 */
export const smsTemplates = {
  taskAssigned: (assigneeName: string, taskTitle: string, dueDate: string) =>
    `Hi ${assigneeName}, you've been assigned: "${taskTitle}". Due: ${dueDate}. Check the app for details.`,

  taskReminder: (assigneeName: string, taskTitle: string) =>
    `Reminder: Task "${taskTitle}" is due soon. Please complete it ASAP.`,

  taskCompleted: (managerName: string, taskTitle: string, completedBy: string) =>
    `${completedBy} completed: "${taskTitle}". Review in the app.`,

  bookingConfirmation: (guestName: string, propertyName: string, checkIn: string, confirmationCode: string) =>
    `Hi ${guestName}, your booking for ${propertyName} is confirmed! Check-in: ${checkIn}. Code: ${confirmationCode}`,

  checkInReminder: (guestName: string, propertyName: string, checkInTime: string, accessCode: string) =>
    `Hi ${guestName}, check-in tomorrow at ${checkInTime} for ${propertyName}. Access code: ${accessCode}`,

  verificationCode: (code: string) =>
    `Your verification code is: ${code}. Valid for 10 minutes.`,

  passwordResetCode: (code: string) =>
    `Your password reset code is: ${code}. Valid for 1 hour.`,

  lowStockAlert: (managerName: string, itemName: string, currentStock: number) =>
    `Alert: ${itemName} is low (${currentStock} units). Please reorder.`,

  emergencyAlert: (message: string) =>
    `🚨 URGENT: ${message}`,

  custom: (message: string) => message
};

/**
 * Send templated SMS
 */
export async function sendTemplateSMS(
  to: string,
  template: keyof typeof smsTemplates,
  ...args: any[]
): Promise<boolean> {
  const templateFn = smsTemplates[template];
  let message: string;
  if (typeof templateFn === 'function') {
    const fn = templateFn as (...a: any[]) => string;
    message = fn(...args);
  } else {
    message = templateFn as string;
  }
  
  return sendSMS({ to, message });
}

/**
 * Verify Twilio configuration
 */
export function isSMSConfigured(): boolean {
  return !!TWILIO_ACCOUNT_SID && !!TWILIO_AUTH_TOKEN && !!TWILIO_PHONE_NUMBER;
}

/**
 * Validate phone number format (basic validation)
 */
export function validatePhoneNumber(phone: string): boolean {
  // Basic E.164 format validation: +[country code][number]
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
}

/**
 * Format phone number to E.164 (US numbers only for now)
 */
export function formatPhoneNumber(phone: string, countryCode: string = '+1'): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // If already starts with country code, return with +
  if (digits.length >= 11 && digits.startsWith('1')) {
    return '+' + digits;
  }
  
  // If 10 digits (US format), add country code
  if (digits.length === 10) {
    return countryCode + digits;
  }
  
  // If already formatted, return as is
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Otherwise, prepend country code
  return countryCode + digits;
}
