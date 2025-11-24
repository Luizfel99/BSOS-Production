// ============================================================================
// FILE: src/app/api/settings/locale/route.ts
// DESC: Persist locale on user if column exists; fallback to no-op ok
// ============================================================================
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-server";

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { locale } = await req.json();
    if (!["en", "pt", "es"].includes(locale)) {
      return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
    }

    // Try to update locale column if present; otherwise just return ok=true
    try {
      await db.user.update({
        where: { id: user.id },
        data: { locale },
      });
    } catch {
      // Ignore if column doesn't exist yet
    }

    return NextResponse.json({ ok: true, locale });
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}
