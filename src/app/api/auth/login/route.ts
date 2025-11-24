import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { apiRateLimiter, apiHelmet, apiSanitizer, apiLogger } from "../../_security-middleware";
import type { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

const demoEmails: Record<string, string> = {
  admin: "admin@demo.bsos",
  manager: "manager@demo.bsos",
  supervisor: "supervisor@demo.bsos",
  cleaner: "cleaner@demo.bsos",
  client: "client@demo.bsos",
  owner: "owner@demo.bsos",
};

// Wrapper para aplicar middlewares Express-like em Next.js API Route
function runMiddlewares(req: any, res: any, middlewares: any[]) {
  return new Promise((resolve, reject) => {
    let i = 0;
    function next(err?: any) {
      if (err) return reject(err);
      if (i >= middlewares.length) return resolve(null);
      middlewares[i++](req, res, next);
    }
    next();
  });
}

export async function POST(req: Request) {
  // Adaptar para Next.js API Route
  const fakeReq: any = {
    method: "POST",
    url: "/api/auth/login",
    headers: Object.fromEntries(req.headers.entries()),
    body: await req.json().catch(() => ({} as any)),
    socket: { remoteAddress: req.headers.get("x-forwarded-for") || "" },
  };
  const fakeRes: any = {
    statusCode: 200,
    json: (data: any) => data,
    end: () => {},
    setHeader: () => {},
  };
  try {
    await runMiddlewares(fakeReq, fakeRes, [apiRateLimiter, apiHelmet, apiSanitizer, apiLogger]);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "blocked" }, { status: 429 });
  }
  const body = fakeReq.body;

  if (body?.demo === true && body?.role) {
    const email = demoEmails[String(body.role)];
    if (!email) {
      return NextResponse.json({ error: "invalid_role" }, { status: 400 });
    }

    let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      const hash = await bcrypt.hash("demo123", 8);
      user = await db.user.create({
        data: {
          email,
          name: String(body.role).toUpperCase(),
          role: body.role,
          passwordHash: hash,
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  }

  const { email, password } = body ?? {};
  if (!email || !password) {
    return NextResponse.json({ error: "missing" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
}
