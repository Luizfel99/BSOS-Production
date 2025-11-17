import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "E-mail e código são obrigatórios" },
        { status: 400 },
      );
    }

    // Buscar código de verificação (você precisará criar esta tabela)
    // const record = await prisma.verificationCode.findFirst({
    //   where: {
    //     email,
    //     code,
    //     expiresAt: { gte: new Date() }
    //   }
    // });

    // if (!record) {
    //   return NextResponse.json(
    //     { error: "Código inválido ou expirado" },
    //     { status: 400 }
    //   );
    // }

    // Deletar código usado
    // await prisma.verificationCode.delete({
    //   where: { id: record.id }
    // });

    return NextResponse.json({
      success: true,
      message: "Código verificado com sucesso",
    });
  } catch (error) {
    console.error("Error in verify-code:", error);
    return NextResponse.json(
      { error: "Erro ao verificar código" },
      { status: 500 },
    );
  }
}
