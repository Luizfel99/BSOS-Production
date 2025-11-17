import jwt from "jsonwebtoken";

/**
 * JWT payload structure for authenticated users
 */
export type JwtPayload = { id: string; email: string; role: string };

/**
 * Reads JWT token from request headers (cookie or Bearer authorization)
 *
 * Why: Supports both cookie-based (middleware) and Bearer token (API clients)
 */
export function readTokenFromHeaders(req: Request): string | null {
  const cookie = req.headers.get("cookie") || "";
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const m = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  return m?.[1] || bearer || null;
}

/**
 * Verifies JWT token and returns payload
 *
 * Why: Centralized JWT verification with error handling
 */
export function verifyJwt(token: string): JwtPayload {
  // Fail hard if JWT_SECRET is missing
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return jwt.verify(token, secret) as JwtPayload;
}

/**
 * Requires authenticated user from request, throws on unauthorized
 *
 * Why: Reusable auth guard for protected API routes
 */
export function requireUser(req: Request): JwtPayload {
  const token = readTokenFromHeaders(req);
  if (!token) throw new Error("unauthorized");
  try {
    return verifyJwt(token);
  } catch {
    throw new Error("unauthorized");
  }
}
