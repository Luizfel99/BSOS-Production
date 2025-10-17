import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// Cookie-based authentication
function getUserFromCookies(request: NextRequest) {
  // Check BSOS authentication cookies (same as middleware)
  const userCookie = request.cookies.get('bsos-user')?.value;
  const roleCookie = request.cookies.get('bsos-selected-role')?.value;
  const authToken = request.cookies.get('auth-token')?.value;
  
  if (!userCookie || !roleCookie || !authToken) {
    return null;
  }
  
  try {
    const userData = JSON.parse(userCookie);
    if (!userData || !userData.id || !userData.email || !userData.role) {
      return null;
    }
    
    // Validate role matches and auth token is valid
    if (userData.role !== roleCookie || !authToken.startsWith(userData.id)) {
      return null;
    }
    
    return userData;
  } catch (error) {
    return null;
  }
}

// Validation schemas
const createPropertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  type: z.enum(['APARTMENT', 'HOUSE', 'STUDIO', 'COMMERCIAL']).default('APARTMENT'),
  size: z.string().optional(),
  clientName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  cleaningFrequency: z.string().optional(),
  platform: z.string().optional(),
  platformId: z.string().optional(),
  ownerId: z.string().optional(),
  active: z.boolean().default(true),
});

const propertyFiltersSchema = z.object({
  search: z.string().nullable().optional(),
  type: z.enum(['APARTMENT', 'HOUSE', 'STUDIO', 'COMMERCIAL']).nullable().optional(),
  active: z.string().nullable().transform(val => val === 'true').optional(),
});

// GET - List properties with filters
export async function GET(request: NextRequest) {
  try {
    const currentUser = getUserFromCookies(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const filters = propertyFiltersSchema.parse({
      search: searchParams.get('search'),
      type: searchParams.get('type'),
      active: searchParams.get('active'),
    });

    // Build where clause
    const where: any = {};

    // Role-based filtering
    if (currentUser.role === 'CLEANER') {
      // Cleaners can only see active properties
      where.active = true;
    } else if (currentUser.role === 'SUPERVISOR') {
      // Supervisors can see all properties but limited access
      where.active = filters.active !== undefined ? filters.active : true;
    } else {
      // Owners and Managers can see all properties
      if (filters.active !== undefined) {
        where.active = filters.active;
      }
    }

    // Apply search filter
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
        { platform: { contains: filters.search, mode: 'insensitive' } },
        { platformId: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Apply type filter
    if (filters.type) {
      where.type = filters.type;
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: [
        { active: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: properties,
      total: properties.length,
    });

  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new property
export async function POST(request: NextRequest) {
  try {
    const currentUser = getUserFromCookies(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions
    if (!['ADMIN', 'MANAGER'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create properties' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createPropertySchema.parse(body);

    // If ownerId is provided, verify the user exists and has appropriate role
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

    const property = await prisma.property.create({
      data: {
        ...validatedData,
        // If no ownerId provided, assign to current user if they're owner/manager
        ownerId: validatedData.ownerId || (
          ['OWNER', 'MANAGER'].includes(currentUser.role) ? currentUser.id : undefined
        ),
      }
    });

    return NextResponse.json({
      success: true,
      data: property,
      message: 'Property created successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating property:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create property', details: error.message },
      { status: 500 }
    );
  }
}