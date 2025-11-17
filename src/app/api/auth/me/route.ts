import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        { error: "Usuário desativado" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/auth/me:", error);

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    if (error.name === "TokenExpiredError") {
      return NextResponse.json({ error: "Token expirado" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}
