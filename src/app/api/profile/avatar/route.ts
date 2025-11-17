// ============================================================================
// FILE: src/app/api/profile/avatar/route.ts
// DESC: Avatar upload → Vercel Blob (public)
// ============================================================================
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  let jwtUser;
  try {
    jwtUser = requireUser(req);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "file_required" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // why: addRandomSuffix avoids collisions; access public for avatars
  const result = await put(file.name, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type || "application/octet-stream",
  });

  await db.user.update({ where: { id: jwtUser.id }, data: { avatar: result.url } });

  return NextResponse.json({ ok: true, avatar: result.url });
}
