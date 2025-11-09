import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
      },
    });

    if (!user) {
      console.error(`❌ Login failed: User not found (${email})`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      console.error(`🔑 Invalid password for ${email}`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // ✅ Normaliza o role (ADMIN -> admin)
    const normalizedRole = user.role.toLowerCase();

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: normalizedRole,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log(`✅ Login success: ${email} (${normalizedRole})`);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: normalizedRole,
      },
      token,
    });
  } catch (error: any) {
    console.error('❌ Internal error in /api/auth/login:', error);
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}