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
 * POST /api/settings - Create or update setting
 */
export async function POST(request: NextRequest) {
  try {
    const userCookie = request.cookies.get('bsos-user')?.value;
    if (!userCookie) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const userData = JSON.parse(userCookie);
    const userRole: UserRole = userData.role || 'CLEANER';

    const body = await request.json();
    const { category, key, value, type, encrypted, action } = body;

    // Handle import action
    if (action === 'import' && body.settingsData) {
      const importedCount = await importSettings(body.settingsData, userRole);
      return NextResponse.json({
        success: true,
        data: { importedCount },
        message: `Successfully imported ${importedCount} settings`
      });
    }

    // Validate required fields
    if (!category || !key || value === undefined) {
      return NextResponse.json(
        { success: false, message: 'Category, key, and value are required' },
        { status: 400 }
      );
    }

    // Validate setting value based on type
    if (type && !validateSettingValue(value, type)) {
      return NextResponse.json(
        { success: false, message: `Invalid value for type ${type}` },
        { status: 400 }
      );
    }

    const setting = await updateSetting(
      category,
      key,
      value,
      userRole,
      { type, encrypted }
    );

    return NextResponse.json({
      success: true,
      data: setting,
      message: 'Setting updated successfully'
    });

  } catch (error) {
    console.error('POST Settings error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update setting';
    const status = message.includes('Access denied') ? 403 : 500;
    
    return NextResponse.json(
      { success: false, message }, 
      { status }
    );
  }
}

/**
 * DELETE /api/settings - Delete setting
 */
export async function DELETE(request: NextRequest) {
  try {
    const userCookie = request.cookies.get('bsos-user')?.value;
    if (!userCookie) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const userData = JSON.parse(userCookie);
    const userRole: UserRole = userData.role || 'CLEANER';

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as SettingCategory;
    const key = searchParams.get('key');

    if (!category || !key) {
      return NextResponse.json(
        { success: false, message: 'Category and key are required' },
        { status: 400 }
      );
    }

    await deleteSetting(category, key, userRole);

    return NextResponse.json({
      success: true,
      message: 'Setting deleted successfully'
    });

  } catch (error) {
    console.error('DELETE Settings error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete setting';
    const status = message.includes('Access denied') ? 403 : 500;
    
    return NextResponse.json(
      { success: false, message }, 
      { status }
    );
  }
}