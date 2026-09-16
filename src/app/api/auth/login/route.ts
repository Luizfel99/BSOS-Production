import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("JWT secret is not configured");
  }

  return secret;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        phone: true,
        avatar: true,
        active: true,
        createdAt: true,
      },
    });

    // Keep authentication failures deliberately generic so the endpoint does
    // not disclose whether a specific email address exists in the system.
    if (!user || !user.active) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("Login error:", err);

    if (process.env.NODE_ENV !== "production") {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: "Internal server error", detail: message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
