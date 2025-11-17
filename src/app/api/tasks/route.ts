import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-server";
import { can } from "@/utils/can";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user || !can(user, "tasks", "read"))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? undefined;

  const tasks = await db.task.findMany({
    where: { status: status as any | undefined },
    orderBy: { createdAt: "desc" },
    include: {
      property: true,
      assignee: { select: { id: true, name: true, email: true } },
    },
    take: 100,
  });
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user || !can(user, "tasks", "create"))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  const created = await db.task.create({
    data: {
      title: body.title,
      description: body.description ?? null,
      status: body.status ?? "pending",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      propertyId: body.propertyId ?? null,
      assigneeId: body.assigneeId ?? null,
      creatorId: user.id,
    },
  });
  return NextResponse.json({ task: created }, { status: 201 });
}
