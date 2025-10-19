import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['ASSIGNED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update task status
    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: { 
        status,
        updatedAt: new Date()
      },
      include: {
        property: {
          select: {
            name: true,
            address: true,
            type: true
          }
        },
        assignedTo: {
          select: {
            name: true,
            phone: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: { task: updatedTask },
      message: `Task status updated to ${status} successfully`
    });

  } catch (error) {
    console.error('Error updating task status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update task status' 
      },
      { status: 500 }
    );
  }
}