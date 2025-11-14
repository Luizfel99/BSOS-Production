/**
 * Email Utility
 * Função para envio de emails (placeholder para integração futura com SendGrid/Resend)
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  // Por enquanto, apenas log no console
  // Posteriormente integrar com SendGrid, Resend, ou outro serviço
  
  console.log("📧 EMAIL ENVIADO (SIMULADO)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Para:", to);
  console.log("Assunto:", subject);
  console.log("Conteúdo:");
  console.log(html);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // TODO: Implementar envio real de email
  // Exemplo com SendGrid:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({
  //   to,
  //   from: process.env.EMAIL_FROM,
  //   subject,
  //   html,
  // });

  // Exemplo com Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: process.env.EMAIL_FROM,
  //   to,
  //   subject,
  //   html,
  // });
}

export default sendEmail;
