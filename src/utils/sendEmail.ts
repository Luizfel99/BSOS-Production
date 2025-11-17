/**
 * Email Utility
 * Função para envio de emails
 *
 * Para produção, instale: npm install @sendgrid/mail
 * Configure as variáveis de ambiente:
 * - SENDGRID_API_KEY
 * - EMAIL_FROM (ex: "BSOS <noreply@seudominio.com>")
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  // Verificar se está em produção e SendGrid está configurado
  const useSendGrid =
    process.env.SENDGRID_API_KEY && process.env.NODE_ENV === "production";

  if (useSendGrid) {
    try {
      // Importar SendGrid dinamicamente
      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      await sgMail.send({
        to,
        from: process.env.EMAIL_FROM || "noreply@bsos.com",
        subject,
        html,
      });

      console.log(`✅ Email enviado para ${to}`);
    } catch (error) {
      console.error("❌ Erro ao enviar email via SendGrid:", error);
      throw error;
    }
  } else {
    // Modo desenvolvimento: apenas log no console
    console.log("📧 EMAIL SIMULADO (DEV MODE)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Para:", to);
    console.log("Assunto:", subject);
    console.log("Conteúdo HTML:");
    console.log(html);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("💡 Para envio real, configure SENDGRID_API_KEY no .env");
  }
}

export default sendEmail;
