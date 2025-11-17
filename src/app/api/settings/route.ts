import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { SettingsSchema, DEFAULT_SETTINGS } from "@/lib/validation/settings";

/**
 * GET /api/settings
 * 
 * Returns user preferences merged with defaults
 */
export async function GET(req: Request) {
  let jwtUser;
  try {
    jwtUser = requireUser(req);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Fetch user preference from database
  const pref = await db.userPreference
    .findUnique({ where: { userId: jwtUser.id } })
    .catch(() => null as any);

  // Merge with defaults
  const merged = {
    ...DEFAULT_SETTINGS,
    ...(pref?.prefs || {}),
    notifications: {
      ...DEFAULT_SETTINGS.notifications,
      ...(pref?.prefs?.notifications || {}),
    },
  };
  
  return NextResponse.json({ ok: true, settings: merged });
}

/**
 * PATCH /api/settings
 * 
 * Validates and saves user preferences (upsert)
 */
export async function PATCH(req: Request) {
  let jwtUser;
  try {
    jwtUser = requireUser(req);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = SettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const incoming = parsed.data;
  
  // Defensive merge with existing preferences
  const existing = await db.userPreference
    .findUnique({ where: { userId: jwtUser.id } })
    .catch(() => null as any);
    
  const nextPrefs = {
    ...DEFAULT_SETTINGS,
    ...(existing?.prefs || {}),
    ...incoming,
    notifications: {
      ...DEFAULT_SETTINGS.notifications,
      ...(existing?.prefs?.notifications || {}),
      ...(incoming?.notifications || {}),
    },
  };

  await db.userPreference.upsert({
    where: { userId: jwtUser.id },
    create: { userId: jwtUser.id, prefs: nextPrefs as any },
    update: { prefs: nextPrefs as any },
  });

  return NextResponse.json({ ok: true, settings: nextPrefs });
}
