import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { can } from "@/utils/can";
import { getUserFromRequest } from "@/lib/auth-server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const property = await db.property.findUnique({ where: { id: params.id } });
  if (!property) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ property });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user || !can(user, "properties", "update")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  const updated = await db.property.update({
    where: { id: params.id },
    data: {
      name: body.name ?? undefined,
      address: body.address ?? undefined,
      city: body.city ?? undefined,
      state: body.state ?? undefined,
      country: body.country ?? undefined,
    },
  });
  return NextResponse.json({ property: updated });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user || !can(user, "properties", "delete")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await db.property.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
