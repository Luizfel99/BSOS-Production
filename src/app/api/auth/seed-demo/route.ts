import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Creates demo users if they don't exist
 * 
 * Why: Exported helper for reuse in tests and seed scripts
 */
export async function ensureDemoUsers() {
  const pwd = process.env.NEXT_PUBLIC_DEMO_PWD || "demo123";
  const hash = await bcrypt.hash(pwd, 10);
  const users = [
    {
      name: "Admin Demo",
      email: process.env.NEXT_PUBLIC_DEMO_EMAIL_ADMIN || "admin@demo.local",
      role: "admin",
    },
    {
      name: "Manager Demo",
      email: process.env.NEXT_PUBLIC_DEMO_EMAIL_MANAGER || "manager@demo.local",
      role: "manager",
    },
    {
      name: "Supervisor Demo",
      email:
        process.env.NEXT_PUBLIC_DEMO_EMAIL_SUPERVISOR || "supervisor@demo.local",
      role: "supervisor",
    },
    {
      name: "Cleaner Demo",
      email: process.env.NEXT_PUBLIC_DEMO_EMAIL_CLEANER || "cleaner@demo.local",
      role: "cleaner",
    },
    {
      name: "Client Demo",
      email: process.env.NEXT_PUBLIC_DEMO_EMAIL_CLIENT || "client@demo.local",
      role: "client",
    },
  ] as const;

  const created: Array<{ email: string; created: boolean }> = [];
  for (const u of users) {
    const found = await db.user.findUnique({ where: { email: u.email } });
    if (!found) {
      await db.user.create({
        data: {
          name: u.name,
          email: u.email,
          role: u.role as any,
          passwordHash: hash,
        },
      });
      created.push({ email: u.email, created: true });
    } else {
      created.push({ email: u.email, created: false });
    }
  }
  return created;
}

/**
 * POST /api/auth/seed-demo
 *
 * Creates demo users if they don't exist (admin/manager/supervisor/cleaner/client).
 * Run once in dev: POST http://localhost:3020/api/auth/seed-demo
 */
export async function POST() {
  try {
    const created = await ensureDemoUsers();
    return NextResponse.json({
      ok: true,
      created,
      hint: "Use /login demo buttons.",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "seed_failed" },
      { status: 500 }
    );
  }
}
