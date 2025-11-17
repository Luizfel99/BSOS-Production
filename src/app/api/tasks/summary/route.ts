// ============================================================================
// FILE: src/app/api/tasks/summary/route.ts
// DESC: resumo por status para o gráfico (tolerante à ausência de modelo)
// ============================================================================
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    // Tenta agrupar por status; se Task não existir, responde zeros
    const rows = await (db as any).task?.groupBy({
      by: ["status"],
      _count: { _all: true }
    });
    if (!rows) return NextResponse.json({ todo: 0, in_progress: 0, done: 0 });
    const map: Record<string, number> = {};
    for (const r of rows) map[r.status] = r._count._all;
    return NextResponse.json({
      todo: map["todo"] || 0,
      in_progress: map["in_progress"] || 0,
      done: map["done"] || 0
    });
  } catch {
    return NextResponse.json({ todo: 0, in_progress: 0, done: 0 });
  }
}
