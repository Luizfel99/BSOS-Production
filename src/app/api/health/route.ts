import { NextResponse } from "next/server";

/**
 * GET /api/health
 * 
 * App-level health check with version info
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    version: process.env.VERCEL_GIT_COMMIT_SHA || "dev",
    timestamp: new Date().toISOString(),
  });
}
