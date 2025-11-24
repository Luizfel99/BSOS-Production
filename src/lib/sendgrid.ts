import sgMail from '@sendgrid/mail';

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@brightshine.com';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Bright & Shine';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

/**
 * Email template types
 */
export type EmailTemplate = 
  | 'welcome'
  | 'task_assigned'
  | 'task_completed'
  | 'booking_confirmed'
  | 'booking_reminder'
  | 'payment_receipt'
  | 'password_reset'
  | 'verification_code'
  | 'team_invitation'
  | 'low_stock_alert'
  | 'custom';

/**
 * Email data structure
 */
export interface EmailData {
  to: string | string[];
  subject: string;
  template?: EmailTemplate;
  variables?: Record<string, any>;
  html?: string;
  text?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
  }>;
}

/**
 * Email templates
 */
const templates: Record<EmailTemplate, (vars: Record<string, any>) => { subject: string; html: string; text: string }> = {
  welcome: (vars) => ({
    subject: `Welcome to ${FROM_NAME}!`,
    html: `
      <h1>Welcome ${vars.name}!</h1>
      <p>We're excited to have you on board.</p>
      <p>Your account has been created successfully. You can now log in and start using our platform.</p>
      <p><a href="${vars.loginUrl}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Login to Your Account</a></p>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br>${FROM_NAME} Team</p>
    `,
    text: `Welcome ${vars.name}! Your account has been created. Login at: ${vars.loginUrl}`
  }),

  task_assigned: (vars) => ({
    subject: `New Task Assigned: ${vars.taskTitle}`,
    html: `
      <h2>New Task Assigned</h2>
      <p>Hi ${vars.assigneeName},</p>
      <p>You have been assigned a new task:</p>
      <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin: 0 0 8px 0;">${vars.taskTitle}</h3>
        <p style="margin: 4px 0;"><strong>Property:</strong> ${vars.propertyName}</p>
        <p style="margin: 4px 0;"><strong>Due Date:</strong> ${vars.dueDate}</p>
        <p style="margin: 4px 0;"><strong>Priority:</strong> ${vars.priority}</p>
        ${vars.description ? `<p style="margin: 8px 0 0 0;">${vars.description}</p>` : ''}
      </div>
      <p><a href="${vars.taskUrl}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Task</a></p>
    `,
    text: `New task assigned: ${vars.taskTitle}. Due: ${vars.dueDate}. View at: ${vars.taskUrl}`
  }),

  task_completed: (vars) => ({
    subject: `Task Completed: ${vars.taskTitle}`,
    html: `
      <h2>Task Completed ✓</h2>
      <p>Hi ${vars.managerName},</p>
      <p>${vars.completedBy} has completed the following task:</p>
      <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin: 0 0 8px 0;">${vars.taskTitle}</h3>
        <p style="margin: 4px 0;"><strong>Property:</strong> ${vars.propertyName}</p>
        <p style="margin: 4px 0;"><strong>Completed At:</strong> ${vars.completedAt}</p>
      </div>
      <p><a href="${vars.taskUrl}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Review Task</a></p>
    `,
    text: `Task completed: ${vars.taskTitle} by ${vars.completedBy}. View at: ${vars.taskUrl}`
  }),

  booking_confirmed: (vars) => ({
    subject: `Booking Confirmed - ${vars.propertyName}`,
    html: `
      <h2>Booking Confirmed</h2>
      <p>Hi ${vars.guestName},</p>
      <p>Your booking has been confirmed!</p>
      <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin: 0 0 8px 0;">${vars.propertyName}</h3>
        <p style="margin: 4px 0;"><strong>Check-in:</strong> ${vars.checkIn}</p>
        <p style="margin: 4px 0;"><strong>Check-out:</strong> ${vars.checkOut}</p>
        <p style="margin: 4px 0;"><strong>Guests:</strong> ${vars.guests}</p>
        <p style="margin: 4px 0;"><strong>Confirmation Code:</strong> ${vars.confirmationCode}</p>
      </div>
      <p>We look forward to hosting you!</p>
    `,
    text: `Booking confirmed for ${vars.propertyName}. Check-in: ${vars.checkIn}, Check-out: ${vars.checkOut}. Code: ${vars.confirmationCode}`
  }),

  booking_reminder: (vars) => ({
    subject: `Reminder: Check-in Tomorrow at ${vars.propertyName}`,
    html: `
      <h2>Check-in Reminder</h2>
      <p>Hi ${vars.guestName},</p>
      <p>This is a friendly reminder that your check-in is tomorrow!</p>
      <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin: 0 0 8px 0;">${vars.propertyName}</h3>
        <p style="margin: 4px 0;"><strong>Check-in:</strong> ${vars.checkIn} at ${vars.checkInTime}</p>
        <p style="margin: 4px 0;"><strong>Address:</strong> ${vars.address}</p>
        <p style="margin: 4px 0;"><strong>Access Code:</strong> ${vars.accessCode}</p>
      </div>
      <p>See you soon!</p>
    `,
    text: `Check-in reminder for ${vars.propertyName} tomorrow at ${vars.checkInTime}. Address: ${vars.address}. Code: ${vars.accessCode}`
  }),

  payment_receipt: (vars) => ({
    subject: `Payment Receipt - ${vars.amount}`,
    html: `
      <h2>Payment Receipt</h2>
      <p>Hi ${vars.customerName},</p>
      <p>Thank you for your payment!</p>
      <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Amount:</strong> ${vars.amount}</p>
        <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${vars.paymentMethod}</p>
        <p style="margin: 4px 0;"><strong>Date:</strong> ${vars.date}</p>
        <p style="margin: 4px 0;"><strong>Transaction ID:</strong> ${vars.transactionId}</p>
        ${vars.description ? `<p style="margin: 8px 0 0 0;"><strong>Description:</strong> ${vars.description}</p>` : ''}
      </div>
      <p>This is your receipt for this transaction.</p>
    `,
    text: `Payment receipt: ${vars.amount} on ${vars.date}. Transaction ID: ${vars.transactionId}`
  }),

  password_reset: (vars) => ({
    subject: 'Reset Your Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hi ${vars.name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <p><a href="${vars.resetUrl}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a></p>
      <p>This link will expire in ${vars.expiresIn || '1 hour'}.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
    text: `Reset your password: ${vars.resetUrl}. Link expires in ${vars.expiresIn || '1 hour'}.`
  }),

  verification_code: (vars) => ({
    subject: 'Your Verification Code',
    html: `
      <h2>Verification Code</h2>
      <p>Hi ${vars.name},</p>
      <p>Your verification code is:</p>
      <div style="background: #F3F4F6; padding: 24px; border-radius: 8px; margin: 16px 0; text-align: center;">
        <h1 style="margin: 0; font-size: 48px; letter-spacing: 8px; color: #4F46E5;">${vars.code}</h1>
      </div>
      <p>This code will expire in ${vars.expiresIn || '10 minutes'}.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `,
    text: `Your verification code is: ${vars.code}. Expires in ${vars.expiresIn || '10 minutes'}.`
  }),

  team_invitation: (vars) => ({
    subject: `You've been invited to join ${FROM_NAME}`,
    html: `
      <h2>Team Invitation</h2>
      <p>Hi ${vars.name},</p>
      <p>${vars.invitedBy} has invited you to join ${FROM_NAME} as a <strong>${vars.role}</strong>.</p>
      <p><a href="${vars.acceptUrl}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Accept Invitation</a></p>
      <p>This invitation will expire in ${vars.expiresIn || '7 days'}.</p>
    `,
    text: `You've been invited to join ${FROM_NAME} by ${vars.invitedBy}. Accept at: ${vars.acceptUrl}`
  }),

  low_stock_alert: (vars) => ({
    subject: `Low Stock Alert: ${vars.itemName}`,
    html: `
      <h2>⚠️ Low Stock Alert</h2>
      <p>Hi ${vars.managerName},</p>
      <p>The following item is running low on stock:</p>
      <div style="background: #FEF3C7; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #F59E0B;">
        <h3 style="margin: 0 0 8px 0;">${vars.itemName}</h3>
        <p style="margin: 4px 0;"><strong>Current Stock:</strong> ${vars.currentStock} ${vars.unit}</p>
        <p style="margin: 4px 0;"><strong>Minimum Required:</strong> ${vars.minStock} ${vars.unit}</p>
        <p style="margin: 4px 0;"><strong>Category:</strong> ${vars.category}</p>
      </div>
      <p>Please reorder to maintain adequate supply.</p>
    `,
    text: `Low stock alert: ${vars.itemName}. Current: ${vars.currentStock}, Minimum: ${vars.minStock}`
  }),

  custom: (vars) => ({
    subject: vars.subject || 'Notification',
    html: vars.html || vars.message || '',
    text: vars.text || vars.message || ''
  })
};

/**
 * Send email using SendGrid
 */
export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    if (!SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured. Email not sent.');
      return false;
    }

    let emailContent: { subject: string; html: string; text: string };

    if (data.template && data.template !== 'custom') {
      const templateFn = templates[data.template];
      emailContent = templateFn(data.variables || {});
    } else if (data.html || data.text) {
      emailContent = {
        subject: data.subject,
        html: data.html || '',
        text: data.text || ''
      };
    } else {
      throw new Error('Email must have either template or html/text content');
    }

    const msg = {
      to: Array.isArray(data.to) ? data.to : [data.to],
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME
      },
      subject: data.subject || emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
      attachments: data.attachments
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${data.to}`);
    return true;

  } catch (error: any) {
    console.error('SendGrid Error:', error.response?.body || error.message);
    return false;
  }
}

/**
 * Send bulk emails
 */
export async function sendBulkEmail(
  recipients: string[],
  data: Omit<EmailData, 'to'>
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const success = await sendEmail({ ...data, to: recipient });
    if (success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}

/**
 * Verify SendGrid configuration
 */
export function isEmailConfigured(): boolean {
  return !!SENDGRID_API_KEY && !!FROM_EMAIL;
}
