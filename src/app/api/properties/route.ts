import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { can } from "@/utils/can";
import { getUserFromRequest } from "@/lib/auth-server";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user || !can(user, "properties", "read")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const props = await db.property.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ properties: props });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user || !can(user, "properties", "create")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  const created = await db.property.create({
    data: {
      name: body.name,
      address: body.address ?? "",
      city: body.city ?? "",
      state: body.state ?? "",
      country: body.country ?? "US",
    },
  });
  return NextResponse.json({ property: created }, { status: 201 });
}
