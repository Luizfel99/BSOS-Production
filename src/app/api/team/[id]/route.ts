import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { can } from "@/utils/can";
import { getUserFromRequest } from "@/lib/auth-server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const member = await db.teamMember.findUnique({
    where: { id: params.id },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });
  if (!member) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ member });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user || !can(user, "team", "update")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  const updated = await db.teamMember.update({
    where: { id: params.id },
    data: {
      position: body.position ?? undefined,
      phone: body.phone ?? undefined,
    },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });
  return NextResponse.json({ member: updated });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = await getUserFromRequest(req);
  if (!auth || !can(auth, "team", "delete")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await db.teamMember.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
