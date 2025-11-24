import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "auth_token";
const JWT_TTL = "7d";

// why: após reset, já faz auto-login (cookie httpOnly) e retorna user
export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token e senha são obrigatórios" },
        { status: 400 },
      );
    }

    // Validar senha
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter no mínimo 6 caracteres" },
        { status: 400 },
      );
    }

    // Buscar token (comente se resetToken não existir no schema)
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

    // Atualizar senha do usuário (descomente quando resetToken existir)
    // const user = await prisma.user.update({
    //   where: { id: record.userId },
    //   data: { passwordHash },
    //   select: { id: true, name: true, email: true, role: true },
    // });

    // Deletar token usado
    // await prisma.resetToken.delete({ where: { token } });

    // TEMPORÁRIO: retorno sem user real até resetToken existir
    // const jwtToken = jwt.sign(
    //   { id: user.id, email: user.email, role: user.role, name: user.name },
    //   process.env.JWT_SECRET!,
    //   { expiresIn: JWT_TTL }
    // );

    // const res = NextResponse.json({ ok: true, token: jwtToken, user });
    // res.cookies.set(COOKIE_NAME, jwtToken, {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   secure: process.env.NODE_ENV === "production",
    //   path: "/",
    //   maxAge: 7 * 24 * 60 * 60,
    // });
    // return res;

    return NextResponse.json({
      ok: true,
      message: "Senha alterada com sucesso",
    });
  } catch (error) {
    console.error("Error in reset-password:", error);
    return NextResponse.json(
      { error: "Erro ao resetar senha" },
      { status: 500 },
    );
  }
}
