import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface SettingsUpdateRequest {
  globalSettings?: Record<string, any>;
  integrationSettings?: Array<{
    id: string;
    settings: Record<string, any>;
  }>;
}

interface IntegrationData {
  id: string;
  name: string;
  platform: 'AIRBNB' | 'HOSTAWAY' | 'TURNO' | 'TASKBIRD';
  apiKey: string | null;
  webhookUrl: string | null;
  settings: any;
  lastSync: Date | null;
  status: 'CONNECTED' | 'DISCONNECTED' | 'PENDING' | 'ERROR';
  syncFrequency: number;
  autoCreateTasks: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // backward-compat param
    const platform = searchParams.get('platform') || type; // accept both
    const status = searchParams.get('status');
    const active = searchParams.get('active');

    // Build where clause based on query parameters
    const where: any = {};
    if (platform) {
      where.platform = platform;
    }
    if (status) {
      where.status = status;
    } else if (active !== null) {
      // Interpret active flag as CONNECTED status
      where.status = active === 'true' ? 'CONNECTED' : { not: 'CONNECTED' };
    }

    const integrations: IntegrationData[] = await prisma.integration.findMany({
      where,
      select: {
        id: true,
        name: true,
        platform: true,
        apiKey: true,
        webhookUrl: true,
        settings: true,
        lastSync: true,
        status: true,
        syncFrequency: true,
        autoCreateTasks: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: [
        { status: 'desc' },
        { name: 'asc' }
      ]
    });

    // Get system-wide integration settings if they exist
    // This could be stored in a separate settings table or as a special integration record
    const systemSettings = {
      maxConcurrentSyncs: 3,
      defaultSyncInterval: 60,
      retryAttempts: 3,
      webhookTimeout: 30,
      enableLogging: true
    };

    return NextResponse.json({
      success: true,
      data: {
        integrations,
        systemSettings,
        summary: {
          total: integrations.length,
          connected: integrations.filter((i: IntegrationData) => i.status === 'CONNECTED').length,
          disconnected: integrations.filter((i: IntegrationData) => i.status === 'DISCONNECTED').length,
          pending: integrations.filter((i: IntegrationData) => i.status === 'PENDING').length,
          error: integrations.filter((i: IntegrationData) => i.status === 'ERROR').length
        }
      },
      message: 'Integration settings retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching integration settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch integration settings' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: SettingsUpdateRequest = await request.json();
    const { globalSettings, integrationSettings } = body;

    const results = [];

    // Update individual integration settings if provided
    if (integrationSettings && Array.isArray(integrationSettings)) {
      for (const intSetting of integrationSettings) {
        try {
          const integration = await prisma.integration.findUnique({
            where: { id: intSetting.id }
          });

          if (!integration) {
            results.push({
              id: intSetting.id,
              success: false,
              error: 'Integration not found'
            });
            continue;
          }

          // Merge settings
          const currentSettings = (integration.settings as Record<string, any>) || {};
          const updatedSettings = { ...currentSettings, ...intSetting.settings };

          await prisma.integration.update({
            where: { id: intSetting.id },
            data: {
              settings: updatedSettings,
              lastSync: new Date()
            }
          });

          results.push({
            id: intSetting.id,
            success: true,
            message: 'Settings updated successfully'
          });

        } catch (error) {
          results.push({
            id: intSetting.id,
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update settings'
          });
        }
      }
    }

    // Handle global settings (this could be stored in a system configuration table)
    let globalSettingsResult = null;
    if (globalSettings) {
      try {
        // For now, we'll simulate storing global settings
        // In a real implementation, you might have a SystemConfig table
        globalSettingsResult = {
          success: true,
          message: 'Global settings updated successfully',
          settings: globalSettings
        };
      } catch (error) {
        globalSettingsResult = {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update global settings'
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        integrationResults: results,
        globalSettingsResult,
        summary: {
          integrations: {
            total: results.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length
          },
          globalSettings: globalSettingsResult?.success || false
        }
      },
      message: 'Settings update completed'
    });

  } catch (error) {
    console.error('Error updating integration settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update integration settings' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, platform, type, settings = {} } = body as { name: string; platform?: string; type?: string; settings?: any };
    const resolvedPlatform = platform || type; // support either field from clients

    if (!name || !resolvedPlatform) {
      return NextResponse.json(
        { success: false, error: 'Name and platform are required' },
        { status: 400 }
      );
    }

    // Validate integration type
    const validPlatforms = ['AIRBNB', 'HOSTAWAY', 'TURNO', 'TASKBIRD'];
    if (!validPlatforms.includes(resolvedPlatform)) {
      return NextResponse.json(
        { success: false, error: 'Invalid integration platform' },
        { status: 400 }
      );
    }

    // Create new integration
    const newIntegration = await prisma.integration.create({
      data: {
        name,
        platform: resolvedPlatform as any,
        settings,
      },
      select: {
        id: true,
        name: true,
        platform: true,
        settings: true,
        status: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: newIntegration,
      message: 'Integration created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating integration:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create integration' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const integrationId = searchParams.get('id');

    if (!integrationId) {
      return NextResponse.json(
        { success: false, error: 'Integration ID is required' },
        { status: 400 }
      );
    }

    // Check if integration exists
    const integration = await prisma.integration.findUnique({
      where: { id: integrationId }
    });

    if (!integration) {
      return NextResponse.json(
        { success: false, error: 'Integration not found' },
        { status: 404 }
      );
    }

    // Delete the integration
    await prisma.integration.delete({
      where: { id: integrationId }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: integrationId,
        name: integration.name,
        platform: integration.platform
      },
      message: 'Integration deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting integration:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete integration' 
      },
      { status: 500 }
    );
  }
}