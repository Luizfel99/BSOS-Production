import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const UpdateTeamMemberSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CLEANER', 'CLIENT']).optional(),
  active: z.boolean().optional()
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

// GET /api/team/[id] - Get specific team member
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getUserFromCookies(request);
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = currentUser.role;
    if (!['owner', 'manager', 'supervisor', 'employee', 'cleaner', 'client'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const teamMember = await prisma.user.findUnique({
      where: { id: params.id },
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
      }
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Membro da equipe não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teamMember
    });

  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/team/[id] - Update team member
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getUserFromCookies(request);
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = currentUser.role;
    const userId = currentUser.id;

    // Check permissions
    if (!['owner', 'manager'].includes(userRole)) {
      // Supervisors can only edit their own profile
      if (userRole === 'supervisor' && params.id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      // Employees/cleaners cannot edit
      if (['employee', 'cleaner', 'client'].includes(userRole)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const body = await request.json();
    const validatedData = UpdateTeamMemberSchema.parse(body);

    // Check if team member exists
    const existingMember = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Membro da equipe não encontrado' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (validatedData.email && validatedData.email !== existingMember.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email já está em uso' },
          { status: 400 }
        );
      }
    }

    // Filter out undefined values
    const updateData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    );

    const updatedMember = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        active: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedMember,
      message: 'Membro da equipe atualizado com sucesso'
    });

  } catch (error) {
    console.error('Error updating team member:', error);
    
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

// DELETE /api/team/[id] - Delete team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getUserFromCookies(request);
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = currentUser.role;
    const userId = currentUser.id;

    // Only owner and manager can delete team members
    if (!['owner', 'manager'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prevent self-deletion
    if (params.id === userId) {
      return NextResponse.json(
        { error: 'Você não pode excluir sua própria conta' },
        { status: 400 }
      );
    }

    // Check if team member exists
    const existingMember = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Membro da equipe não encontrado' },
        { status: 404 }
      );
    }

    // Soft delete by setting active to false instead of hard delete
    // This preserves data integrity for historical records
    await prisma.user.update({
      where: { id: params.id },
      data: { 
        active: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Membro da equipe removido com sucesso'
    });

  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}