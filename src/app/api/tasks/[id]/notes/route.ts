import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const notes = await prisma.taskNote.findMany({
      where: { taskId: id },
      include: {
        user: {
          select: {
            name: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: { notes },
      message: 'Notes retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching task notes:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch notes' 
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { content, type = 'field_note', userId } = body;

    if (!content || !userId) {
      return NextResponse.json(
        { success: false, error: 'Content and userId are required' },
        { status: 400 }
      );
    }

    // Create new note
    const note = await prisma.taskNote.create({
      data: {
        taskId: id,
        userId,
        content,
        type
      },
      include: {
        user: {
          select: {
            name: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: { note },
      message: 'Note saved successfully'
    });

  } catch (error) {
    console.error('Error creating task note:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save note' 
      },
      { status: 500 }
    );
  }
}