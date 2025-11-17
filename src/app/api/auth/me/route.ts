import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/prisma";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const token = tokenMatch?.[1] || bearer;

  if (!token) return NextResponse.json({ user: null }, { status: 200 });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await db.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true, avatar: true },
    });
    return NextResponse.json({ user: user ?? null });
  } catch {
    return NextResponse.json({ user: null });
  }
}
