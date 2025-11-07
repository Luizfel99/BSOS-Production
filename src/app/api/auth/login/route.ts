import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET || "bsos_dev_secret";

export async function POST(req: Request) {
  try {
    console.log("Login attempt started");

    const { email, password } = await req.json();
    console.log("Received email:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Checking Prisma connection...");
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,  // ✅ correto
        role: true,
        phone: true,
        avatar: true,
        active: true,
        createdAt: true,
      }
    });

    console.log("User found:", user ? "yes" : "no");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
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
      SECRET,
      { expiresIn: "7d" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Login error:", err);
    // In development return the error message to help debugging
    if (process.env.NODE_ENV !== 'production') {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}