import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-mail é obrigatório" },
        { status: 400 },
      );
    }

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({ where: { email } });

    // Por segurança, sempre retornamos sucesso mesmo se usuário não existir
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutos

    // Salvar token no banco (comente se resetToken não existir no schema)
    // await prisma.resetToken.create({
    //   data: {
    //     token,
    //     userId: user.id,
    //     expiresAt,
    //   },
    // });

    // Gerar link de recuperação
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    // resposta curta primeiro; e-mail pode atrasar em ambientes frios
    queueMicrotask(async () => {
      try {
        await sendEmail(
          email,
          "Recuperação de Senha - BSOS",
          `
            <h2>Recuperação de Senha</h2>
            <p>Olá ${user.name},</p>
            <p>Você solicitou a recuperação de senha. Clique no link abaixo para criar uma nova senha:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Este link expira em 15 minutos.</p>
            <p>Se você não solicitou esta recuperação, ignore este e-mail.</p>
          `,
        );
      } catch {
        // silêncio: não bloquear UX
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 },
    );
  }
}
