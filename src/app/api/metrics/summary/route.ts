// ============================================================================
// FILE: src/app/api/metrics/summary/route.ts
// PURPOSE: KPI counts for dashboard (safe if models missing → return 0)
// ============================================================================
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  async function countSafe(model: any) {
    try {
      return (await model?.count?.()) ?? 0;
    } catch {
      return 0;
    }
  }
  const [tasks, team, properties] = await Promise.all([
    countSafe((db as any).task),
    countSafe((db as any).teamMember),
    countSafe((db as any).property),
  ]);
  return NextResponse.json({ tasks, team, properties });
}
