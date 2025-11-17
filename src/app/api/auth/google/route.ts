import { NextResponse } from "next/server";

export async function HEAD() {
  const ok = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
  return new NextResponse(null, { status: ok ? 200 : 501 });
}

export async function GET() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Google Sign-In not configured" },
      { status: 501 }
    );
  }
  // why: placeholder – aqui entraria sua integração real (NextAuth/Passport/OAuth).
  return NextResponse.redirect(new URL("/login?oauth=google-ready", process.env.APP_URL ?? "http://localhost:3020"));
}
