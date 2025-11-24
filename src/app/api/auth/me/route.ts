import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const cookie = (req as any).cookies?.get?.("auth_token")?.value
    // em edge/web runtime o cookie pode vir via header
    ?? (req.headers.get("cookie") ?? "")
      .split(";")
      .map(s => s.trim())
      .find(s => s.startsWith("auth_token="))
      ?.split("=")[1];

  const header = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");

  const token = cookie || header;
  if (!token) return NextResponse.json({ user: null });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    // retorna apenas o necessário
    return NextResponse.json({
      user: { id: payload.id, email: payload.email, role: payload.role, name: payload.name ?? "" }
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
