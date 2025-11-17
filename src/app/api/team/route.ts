import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { can } from "@/utils/can";
import { getUserFromRequest } from "@/lib/auth-server";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user || !can(user, "team", "read")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const members = await db.teamMember.findMany({
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ team: members });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user || !can(user, "team", "create")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  const created = await db.teamMember.create({
    data: {
      userId: body.userId,
      position: body.position ?? "Member",
      phone: body.phone ?? null,
    },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });
  return NextResponse.json({ member: created }, { status: 201 });
}
