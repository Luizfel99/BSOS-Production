import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ConnectRequest {
  credentials: Record<string, any>;
  settings?: Record<string, any>;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body: ConnectRequest = await request.json();
    const { credentials, settings = {} } = body;

    if (!credentials) {
      return NextResponse.json(
        { success: false, error: 'Credentials are required' },
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

    // Update integration with connection details
    const updatedIntegration = await prisma.integration.update({
      where: { id },
      data: {
        apiKey: credentials.apiKey,
        settings,
        lastSync: new Date(),
        status: 'CONNECTED'
      }
    });

    // Simulate connection validation based on integration type
    let connectionValid = true;
    let connectionMessage = 'Connection established successfully';

    try {
      // Here you would implement actual API validation
      // For now, we'll simulate based on integration type
      switch (integration.platform) {
        case 'AIRBNB':
        case 'HOSTAWAY':
          // Validate booking platform credentials
          if (!credentials.apiKey || !credentials.propertyId) {
            connectionValid = false;
            connectionMessage = 'Invalid booking platform credentials';
          }
          break;
        case 'TURNO':
          // Validate payment processor credentials
          if (!credentials.merchantId || !credentials.apiSecret) {
            connectionValid = false;
            connectionMessage = 'Invalid payment processor credentials';
          }
          break;
        case 'TASKBIRD':
          // Validate communication service credentials
          if (!credentials.accountSid || !credentials.authToken) {
            connectionValid = false;
            connectionMessage = 'Invalid communication service credentials';
          }
          break;
        default:
          // Generic validation
          if (!credentials.apiKey) {
            connectionValid = false;
            connectionMessage = 'API key is required';
          }
      }

      if (!connectionValid) {
        // Update integration to reflect failed connection
        await prisma.integration.update({
          where: { id },
          data: {
            status: 'ERROR'
          }
        });

        return NextResponse.json(
          { success: false, error: connectionMessage },
          { status: 400 }
        );
      }

    } catch (validationError) {
      // Update integration to reflect validation error
      await prisma.integration.update({
        where: { id },
        data: {
          status: 'ERROR'
        }
      });

      return NextResponse.json(
        { success: false, error: 'Connection validation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedIntegration.id,
        name: updatedIntegration.name,
        platform: updatedIntegration.platform,
        status: updatedIntegration.status,
        lastSync: updatedIntegration.lastSync
      },
      message: connectionMessage
    });

  } catch (error) {
    console.error('Error connecting integration:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect integration' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

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

    // Disconnect integration (clear credentials and deactivate)
    const updatedIntegration = await prisma.integration.update({
      where: { id },
      data: {
        status: 'DISCONNECTED',
        apiKey: null
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedIntegration.id,
        name: updatedIntegration.name,
        platform: updatedIntegration.platform,
        status: updatedIntegration.status
      },
      message: 'Integration disconnected successfully'
    });

  } catch (error) {
    console.error('Error disconnecting integration:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to disconnect integration' 
      },
      { status: 500 }
    );
  }
}