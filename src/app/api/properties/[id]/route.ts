import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Cookie-based authentication
function getUserFromCookies(request: NextRequest) {
  const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                      request.cookies.get('__Secure-next-auth.session-token')?.value;
  
  if (!sessionToken) return null;
  
  // In a real app, you'd decode the session token
  // For now, returning a mock user for development
  return { id: 'user-1', role: 'OWNER', name: 'Test User', email: 'test@test.com' };
}

// Validation schemas
const updatePropertySchema = z.object({
  name: z.string().min(1, 'Property name is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
  type: z.enum(['APARTMENT', 'HOUSE', 'STUDIO', 'COMMERCIAL']).optional(),
  size: z.string().optional(),
  clientName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  cleaningFrequency: z.string().optional(),
  platform: z.string().optional(),
  platformId: z.string().optional(),
  ownerId: z.string().optional(),
  active: z.boolean().optional(),
});

// GET - Get property by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getUserFromCookies(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Role-based access control
    if (currentUser.role === 'CLEANER' && !property.active) {
      return NextResponse.json(
        { error: 'Property not accessible' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: property,
    });

  } catch (error: any) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getUserFromCookies(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions - Only owners and managers can update properties
    if (!['OWNER', 'MANAGER'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to update properties' },
        { status: 403 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updatePropertySchema.parse(body);

    // If ownerId is being updated, verify the new owner exists and has appropriate role
    if (validatedData.ownerId) {
      const owner = await prisma.user.findUnique({
        where: { id: validatedData.ownerId }
      });

      if (!owner) {
        return NextResponse.json(
          { error: 'Owner not found' },
          { status: 404 }
        );
      }

      if (!['OWNER', 'MANAGER'].includes(owner.role)) {
        return NextResponse.json(
          { error: 'Owner must have OWNER or MANAGER role' },
          { status: 400 }
        );
      }
    }

    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: validatedData
    });

    return NextResponse.json({
      success: true,
      data: updatedProperty,
      message: 'Property updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating property:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update property', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete property (soft delete by setting active to false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getUserFromCookies(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions - Only owners and managers can delete properties
    if (!['OWNER', 'MANAGER'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to delete properties' },
        { status: 403 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Soft delete - set active to false
    const deletedProperty = await prisma.property.update({
      where: { id: params.id },
      data: { active: false }
    });

    return NextResponse.json({
      success: true,
      data: { deleted: true },
      message: 'Property deleted successfully',
    });

  } catch (error: any) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property', details: error.message },
      { status: 500 }
    );
  }
}