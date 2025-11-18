// ============================================================================
// FILE: src/app/api/auth/dev-login/route.ts
// Propósito: login DEMO por role (sem senha), para testes rápidos.
// Emite cookie httpOnly `auth_token` + retorna JSON.
// ============================================================================
import { NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { role = "admin", locale = "en" } = await req
      .json()
      .catch(() => ({}));
    const roles = [
      "admin",
      "manager",
      "supervisor",
      "cleaner",
      "client",
      "owner",
    ];
    if (!roles.includes(role))
      return NextResponse.json({ error: "invalid_role" }, { status: 400 });

    // Busca usuário demo do banco
    const email = `${role}@demo.bsos`;
    const dbUser = await db.user.findUnique({ where: { email } });

    if (!dbUser) {
      return NextResponse.json(
        { error: "demo_user_not_found", message: "Run seed script first" },
        { status: 404 }
      );
    }

    const user = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role as any,
      locale: locale,
    };

    const token = signJwt(user, 7);
    const res = NextResponse.json({ ok: true, user });

    // Cookie compatível com middleware e fetch em rotas
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (e) {
    console.error("dev-login error:", e);
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}
