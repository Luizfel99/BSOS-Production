import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { can } from "@/utils/can";
import { getUserFromRequest } from "@/lib/auth-server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const task = await db.task.findUnique({
    where: { id: params.id },
    include: { property: true, assignee: true },
  });
  if (!task) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ task });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest(req);
  if (!user || !can(user, "tasks", "update"))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  // regra simples: cleaner só atualiza status das suas tasks
  if (user.role === "cleaner") {
    const exists = await db.task.findUnique({ where: { id: params.id } });
    if (!exists || exists.assigneeId !== user.id)
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const updated = await db.task.update({
      where: { id: params.id },
      data: { status: body.status ?? exists.status },
    });
    return NextResponse.json({ task: updated });
  }

  const updated = await db.task.update({
    where: { id: params.id },
    data: {
      title: body.title ?? undefined,
      description: body.description ?? undefined,
      status: body.status ?? undefined,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      propertyId: body.propertyId ?? undefined,
      assigneeId: body.assigneeId ?? undefined,
    },
  });
  return NextResponse.json({ task: updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest(req);
  if (!user || !can(user, "tasks", "delete"))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  await db.task.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
