import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

/**
 * GET /api/health/neon
 *
 * Health check endpoint that verifies database connectivity with SELECT 1
 */
export async function GET() {
  try {
    // Minimal query to check database connection
    const res = await db.$queryRawUnsafe("SELECT 1 as ok;");
    return NextResponse.json({ ok: true, res });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "db_error" },
      { status: 500 }
    );
  }
}
