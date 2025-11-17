import jwt from "jsonwebtoken";
import { db } from "@/lib/prisma";
import type { MinimalUser } from "@/utils/can";

export async function getUserFromRequest(req: Request): Promise<MinimalUser | null> {
  // tenta cookie auth_token (Next API/Edge)
  const cookieHeader = req.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const token = tokenMatch?.[1] || bearer;

  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    // valida no banco se existir
    const u = await db.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!u) return null;
    return u as MinimalUser;
  } catch {
    return null;
  }
}
