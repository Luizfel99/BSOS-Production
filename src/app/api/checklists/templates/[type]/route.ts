import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await context.params;

    const template = await prisma.checklistTemplate.findUnique({
      where: { type }
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: template.id,
        name: template.name,
        type: template.type,
        items: template.items,
        settings: template.settings
      },
      message: 'Template retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch template' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await context.params;
    const body = await request.json();
    const { name, items, settings, description } = body;

    const updatedTemplate = await prisma.checklistTemplate.upsert({
      where: { type },
      update: {
        name: name || undefined,
        items: items || undefined,
        settings: settings || undefined,
        description: description || undefined,
        updatedAt: new Date()
      },
      create: {
        name: name || `Template ${type}`,
        type,
        items: items || [],
        settings: settings || {},
        description: description || null
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedTemplate,
      message: 'Template updated successfully'
    });

  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update template' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await context.params;

    await prisma.checklistTemplate.update({
      where: { type },
      data: { active: false }
    });

    return NextResponse.json({
      success: true,
      message: 'Template deactivated successfully'
    });

  } catch (error) {
    console.error('Error deactivating template:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to deactivate template' 
      },
      { status: 500 }
    );
  }
}