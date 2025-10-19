import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CreateTeamMemberSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CLEANER', 'CLIENT']),
  active: z.boolean().default(true)
});

// Helper function to get user from cookies (based on current auth system)
function getUserFromCookies(request: NextRequest) {
  try {
    const userCookie = request.cookies.get('bsos-user')?.value;
    if (!userCookie) return null;
    
    const user = JSON.parse(userCookie);
    if (!user?.id || !user?.role) return null;
    
    return user;
  } catch (error) {
    console.error('Error parsing user from cookies:', error);
    return null;
  }
}

// GET /api/team - List all team members
export async function GET(request: NextRequest) {
  try {
    const currentUser = getUserFromCookies(request);
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions - all authenticated users can view team
    const userRole = currentUser.role;
    if (!['owner', 'manager', 'supervisor', 'employee', 'cleaner', 'client'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const whereClause: any = {};
    
    if (active !== null) {
      whereClause.active = active === 'true';
    }
    
    if (role) {
      whereClause.role = role.toUpperCase();
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const teamMembers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        avatar: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: teamMembers,
      total: teamMembers.length
    });

  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/team - Create new team member
export async function POST(request: NextRequest) {
  try {
    const currentUser = getUserFromCookies(request);
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions - only owner and manager can create team members
    const userRole = currentUser.role;
    if (!['owner', 'manager'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = CreateTeamMemberSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      );
    }

    // Create new team member
    const newMember = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        role: validatedData.role,
        active: validatedData.active
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        active: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: newMember,
      message: 'Membro da equipe criado com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating team member:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}