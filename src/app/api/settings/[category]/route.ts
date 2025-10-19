// Settings Category API Route - Category-specific operations
// SURGICAL MODE: Granular settings management per category

import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import { 
  getSettingsByCategory,
  getSettingValue,
  updateSetting,
  deleteSetting,
  hasSettingAccess,
  validateSettingValue,
  type SettingCategory 
} from '@/services/settings';

interface RouteContext {
  params: { category: string };
}

/**
 * GET /api/settings/[category] - Get all settings for a specific category
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
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
    const category = params.category as SettingCategory;

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    // Get specific setting value if key is provided
    if (key) {
      const value = await getSettingValue(category, key, userRole);
      
      if (value === null) {
        return NextResponse.json(
          { success: false, message: 'Setting not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { category, key, value },
        message: 'Setting retrieved successfully'
      });
    }

    // Get all settings for the category
    const settings = await getSettingsByCategory(category, userRole);

    return NextResponse.json({
      success: true,
      data: settings,
      message: `Settings for ${category} retrieved successfully`
    });

  } catch (error) {
    console.error(`GET Settings [${params.category}] error:`, error);
    const message = error instanceof Error ? error.message : 'Failed to retrieve settings';
    const status = message.includes('Access denied') ? 403 : 500;
    
    return NextResponse.json(
      { success: false, message }, 
      { status }
    );
  }
}

/**
 * POST /api/settings/[category] - Update setting in specific category
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
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
    const category = params.category as SettingCategory;

    // Check category access
    if (!hasSettingAccess(userRole, category)) {
      return NextResponse.json(
        { success: false, message: `Access denied to ${category} settings` },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { key, value, type = 'STRING', encrypted = false } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { success: false, message: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Validate setting value based on type
    if (!validateSettingValue(value, type)) {
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
    console.error(`POST Settings [${params.category}] error:`, error);
    const message = error instanceof Error ? error.message : 'Failed to update setting';
    const status = message.includes('Access denied') ? 403 : 500;
    
    return NextResponse.json(
      { success: false, message }, 
      { status }
    );
  }
}

/**
 * PUT /api/settings/[category] - Batch update settings for category
 */
export async function PUT(request: NextRequest, { params }: RouteContext) {
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
    const category = params.category as SettingCategory;

    // Check category access
    if (!hasSettingAccess(userRole, category)) {
      return NextResponse.json(
        { success: false, message: `Access denied to ${category} settings` },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { success: false, message: 'Settings array is required' },
        { status: 400 }
      );
    }

    const updatedSettings = [];
    const errors = [];

    // Process batch updates
    for (const settingData of settings) {
      try {
        const { key, value, type = 'STRING', encrypted = false } = settingData;

        if (!key || value === undefined) {
          errors.push(`Invalid setting data: ${JSON.stringify(settingData)}`);
          continue;
        }

        // Validate setting value
        if (!validateSettingValue(value, type)) {
          errors.push(`Invalid value for ${key}: ${value} (type: ${type})`);
          continue;
        }

        const setting = await updateSetting(
          category,
          key,
          value,
          userRole,
          { type, encrypted }
        );

        updatedSettings.push(setting);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to update ${settingData.key}: ${errorMessage}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        updated: updatedSettings,
        errors: errors.length > 0 ? errors : undefined
      },
      message: `Updated ${updatedSettings.length} settings${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
    });

  } catch (error) {
    console.error(`PUT Settings [${params.category}] error:`, error);
    const message = error instanceof Error ? error.message : 'Failed to batch update settings';
    
    return NextResponse.json(
      { success: false, message }, 
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/settings/[category] - Delete setting from specific category
 */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
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
    const category = params.category as SettingCategory;

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { success: false, message: 'Setting key is required' },
        { status: 400 }
      );
    }

    await deleteSetting(category, key, userRole);

    return NextResponse.json({
      success: true,
      message: `Setting ${key} deleted from ${category} successfully`
    });

  } catch (error) {
    console.error(`DELETE Settings [${params.category}] error:`, error);
    const message = error instanceof Error ? error.message : 'Failed to delete setting';
    const status = message.includes('Access denied') ? 403 : 500;
    
    return NextResponse.json(
      { success: false, message }, 
      { status }
    );
  }
}