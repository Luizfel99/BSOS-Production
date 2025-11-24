import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ProfileUpdateSchema } from "@/lib/validation/profile";

/**
 * PATCH /api/profile/update
 *
 * Updates user profile (name, locale) with Zod validation
 */
export async function PATCH(req: Request) {
  let userJwt;
  try {
    userJwt = requireUser(req);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = ProfileUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, locale } = parsed.data;
  await db.user.update({
    where: { id: userJwt.id },
    data: { name, ...(locale ? { locale } : {}) },
  });

  return NextResponse.json({ ok: true });
}
