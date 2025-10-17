// Settings API Route - Simplified with Zod validation
// GET → return all settings grouped by category
// PUT → update or create setting (general or integration)

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Zod schema for PUT request validation
const UpdateSettingSchema = z.object({
  category: z.string().min(1, "Category is required"),
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  type: z.enum(['STRING', 'BOOLEAN', 'NUMBER', 'JSON', 'ENCRYPTED']).optional().default('STRING'),
  encrypted: z.boolean().optional().default(false)
});

/**
 * GET /api/settings - Get all settings grouped by category
 */
export async function GET(request: NextRequest) {
  try {
    const userCookie = request.cookies.get('bsos-user')?.value;
    if (!userCookie) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // Parse user data from cookie
    const userData = JSON.parse(userCookie);
    const userRole = userData.role || 'CLEANER';

    // Get all settings grouped by category
    const settings = await prisma.setting.findMany({
      orderBy: [{ category: 'asc' }, { key: 'asc' }]
    });

    // Group by category
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push({
        category: setting.category,
        key: setting.key,
        value: setting.value,
        type: setting.type,
        encrypted: setting.encrypted
      });
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      success: true,
      data: groupedSettings,
      message: 'Settings retrieved successfully'
    });

  } catch (error) {
    console.error('GET Settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve settings' }, 
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings - Update or create setting (general or integration)
 */
export async function PUT(request: NextRequest) {
  try {
    const userCookie = request.cookies.get('bsos-user')?.value;
    if (!userCookie) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const userData = JSON.parse(userCookie);
    const userRole = userData.role || 'CLEANER';

    // Parse and validate request body with Zod
    const body = await request.json();
    const validationResult = UpdateSettingSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid request data',
          errors: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { category, key, value, type, encrypted } = validationResult.data;

    // Basic RBAC check
    if (userRole === 'CLEANER' || userRole === 'CLIENT') {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    // Upsert setting
    const setting = await prisma.setting.upsert({
      where: { 
        category_key: { category, key } 
      },
      update: {
        value,
        type,
        encrypted,
        updatedAt: new Date()
      },
      create: {
        category,
        key,
        value,
        type,
        encrypted
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        category: setting.category,
        key: setting.key,
        value: setting.value,
        type: setting.type,
        encrypted: setting.encrypted
      },
      message: 'Setting updated successfully'
    });

  } catch (error) {
    console.error('PUT Settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update setting' }, 
      { status: 500 }
    );
  }
}

