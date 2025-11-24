import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";

/**
 * POST /api/auth/change-password
 *
 * Authenticated password change using JWT from cookie or Bearer token.
 * Validates current password with bcrypt.compare, then updates passwordHash.
 */

function readTokenFrom(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return m?.[1] || bearer || null;
}

export async function POST(req: Request) {
  const token = readTokenFrom(req);
  if (!token)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let payload: any;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { id: payload.id } });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok)
    return NextResponse.json({ error: "wrong_password" }, { status: 400 });

  const hash = await bcrypt.hash(newPassword, 10);
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: hash },
  });

  return NextResponse.json({ ok: true });
}
