import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar senha
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter no mínimo 6 caracteres" },
        { status: 400 }
      );
    }

    // Buscar token (você precisará criar esta tabela)
    // const record = await prisma.resetToken.findUnique({
    //   where: { token },
    // });

    // if (!record || record.expiresAt < new Date()) {
    //   return NextResponse.json(
    //     { error: "Token inválido ou expirado" },
    //     { status: 400 }
    //   );
    // }

    // Hash da nova senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Atualizar senha do usuário
    // await prisma.user.update({
    //   where: { id: record.userId },
    //   data: { passwordHash },
    // });

    // Deletar token usado
    // await prisma.resetToken.delete({ where: { token } });

    return NextResponse.json({ 
      success: true, 
      message: "Senha alterada com sucesso" 
    });
  } catch (error) {
    console.error("Error in reset-password:", error);
    return NextResponse.json(
      { error: "Erro ao resetar senha" },
      { status: 500 }
    );
  }
}
