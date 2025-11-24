import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 *
 * Why: Clears the HttpOnly auth_token cookie server-side to end the session.
 * The middleware will no longer recognize the user as authenticated.
 */
export async function POST() {
  const res = NextResponse.json({ ok: true });

  // Expire the cookie immediately by setting maxAge to 0
  res.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}

// Optional: Allow GET for simpler calls (e.g., curl/browser)
export const GET = POST;
