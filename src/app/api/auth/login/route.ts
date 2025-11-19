import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const body = await req.json();
  
  // Handle demo login
  if (body.demo && body.role) {
    const demoEmails: Record<string, string> = {
      admin: "admin@demo.bsos",
      manager: "manager@demo.bsos",
      supervisor: "supervisor@demo.bsos",
      cleaner: "cleaner@demo.bsos",
      client: "client@demo.bsos",
      owner: "owner@demo.bsos",
    };
    
    const email = demoEmails[body.role];
    if (!email) {
      return NextResponse.json({ error: "invalid_role" }, { status: 400 });
    }
    
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "demo_user_not_found" }, { status: 404 });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  }

  // Regular login with email/password
  const { email, password } = body;

  const user = await db.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });

  // why: middleware depende do cookie; HttpOnly para segurança
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
