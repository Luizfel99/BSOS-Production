import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ConfigRequest {
  settings: Record<string, any>;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const integration = await prisma.integration.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        platform: true,
        status: true,
        settings: true,
        lastSync: true
      }
    });

    if (!integration) {
      return NextResponse.json(
        { success: false, error: 'Integration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: integration,
      message: 'Configuration retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching integration config:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch configuration' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body: ConfigRequest = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Valid settings object is required' },
        { status: 400 }
      );
    }

    // Check if integration exists
    const integration = await prisma.integration.findUnique({
      where: { id }
    });

    if (!integration) {
      return NextResponse.json(
        { success: false, error: 'Integration not found' },
        { status: 404 }
      );
    }

    // Validate settings based on integration type
    let validationError = null;

    try {
      switch (integration.platform) {
        case 'AIRBNB':
        case 'HOSTAWAY':
          if (settings.syncInterval && (settings.syncInterval < 5 || settings.syncInterval > 1440)) {
            validationError = 'Sync interval must be between 5 and 1440 minutes';
          }
          if (settings.autoSync !== undefined && typeof settings.autoSync !== 'boolean') {
            validationError = 'Auto sync must be a boolean value';
          }
          break;
        case 'TURNO':
          if (settings.currency && !/^[A-Z]{3}$/.test(settings.currency)) {
            validationError = 'Currency must be a valid 3-letter ISO code';
          }
          if (settings.webhookUrl && !settings.webhookUrl.startsWith('https://')) {
            validationError = 'Webhook URL must use HTTPS';
          }
          break;
        case 'TASKBIRD':
          if (settings.defaultTemplate && typeof settings.defaultTemplate !== 'string') {
            validationError = 'Default template must be a string';
          }
          if (settings.rateLimitPerHour && (settings.rateLimitPerHour < 1 || settings.rateLimitPerHour > 1000)) {
            validationError = 'Rate limit must be between 1 and 1000 per hour';
          }
          break;
      }

      if (validationError) {
        return NextResponse.json(
          { success: false, error: validationError },
          { status: 400 }
        );
      }

    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid settings format' },
        { status: 400 }
      );
    }

    // Merge new settings with existing ones
    const currentSettings = integration.settings as Record<string, any> || {};
    const updatedSettings = { ...currentSettings, ...settings };

    // Update integration settings
    const updatedIntegration = await prisma.integration.update({
      where: { id },
      data: {
        settings: updatedSettings,
        lastSync: new Date() // Update last sync to reflect configuration change
      },
      select: {
        id: true,
        name: true,
        platform: true,
        status: true,
        settings: true,
        lastSync: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedIntegration,
      message: 'Configuration updated successfully'
    });

  } catch (error) {
    console.error('Error updating integration config:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update configuration' 
      },
      { status: 500 }
    );
  }
}