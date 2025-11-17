import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const now = await db.$queryRawUnsafe<{ now: Date }[]>('select now() as now');
    return NextResponse.json({
      ok: true,
      db: "neon",
      now: now?.[0]?.now ?? null,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}
