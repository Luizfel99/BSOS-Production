// ============================================================================
// FILE: src/lib/jwt.ts  (helper central de JWT)
// ============================================================================
import jwt from "jsonwebtoken";

type Role = "admin" | "manager" | "supervisor" | "cleaner" | "client" | "owner";
export type JwtUser = { id: string | number; email: string; role: Role; locale?: "en"|"pt"|"es" };

export function signJwt(user: JwtUser, days = 7) {
  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign(user, secret, { expiresIn: `${days}d` });
}

export function verifyJwt<T>(token: string): T | null {
  try {
    const secret = process.env.JWT_SECRET || "dev-secret";
    return jwt.verify(token, secret) as T;
  } catch {
    return null;
  }
}
