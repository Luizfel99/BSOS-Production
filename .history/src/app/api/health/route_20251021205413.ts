import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // tenta acessar o banco
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "✅ BSOS API running",
      db: "✅ Connected to Neon",
      time: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "⚠️ API running, but DB error",
        message: err.message,
      },
      { status: 500 }
    );
  }
}