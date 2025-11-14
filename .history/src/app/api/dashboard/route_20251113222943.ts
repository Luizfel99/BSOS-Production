import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    const pending = await prisma.task.count({
      where: { status: TaskStatus.pending }
    });

    const inProgress = await prisma.task.count({
      where: { status: TaskStatus.in_progress }
    });

    const completed = await prisma.task.count({
      where: { status: TaskStatus.completed }
    });

    return NextResponse.json({
      user: decoded,
      stats: {
        pending,
        inProgress,
        completed
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
