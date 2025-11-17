import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    // Validação básica
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    // Verificar se usuário já existe
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "E-mail já cadastrado" },
        { status: 400 },
      );
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 },
    );
  }
}
