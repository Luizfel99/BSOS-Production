import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const type = formData.get('type') as string;
    const taskId = formData.get('taskId') as string;
    const userId = formData.get('userId') as string;
    const category = formData.get('category') as string;
    const notes = formData.get('notes') as string;

    if (!photo || !type || !taskId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Photo, type, taskId, and userId are required' },
        { status: 400 }
      );
    }

    // Validate photo type
    const validTypes = ['BEFORE', 'AFTER', 'DETAIL', 'FINAL'];
    if (!validTypes.includes(type.toUpperCase())) {
      return NextResponse.json(
        { success: false, error: 'Invalid photo type' },
        { status: 400 }
      );
    }

    // In a real implementation, you would upload the file to a storage service
    // For now, we'll simulate the upload and create a mock URL
    const timestamp = Date.now();
    const fileName = `${taskId}_${type}_${timestamp}.${photo.name.split('.').pop()}`;
    const mockUrl = `/uploads/photos/${fileName}`;

    // Store photo metadata in database
    const photoRecord = await prisma.photo.create({
      data: {
        taskId,
        userId,
        url: mockUrl,
        type: type.toUpperCase() as any,
        category: category || 'general',
        notes: notes || null,
        metadata: {
          originalName: photo.name,
          size: photo.size,
          mimeType: photo.type,
          uploadedAt: new Date().toISOString()
        }
      },
      include: {
        task: {
          select: {
            id: true,
            property: {
              select: {
                name: true
              }
            }
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    });

    // Update task photos count
    await prisma.task.update({
      where: { id: taskId },
      data: {
        photosUploaded: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: photoRecord.id,
        url: photoRecord.url,
        type: photoRecord.type,
        taskId: photoRecord.taskId,
        uploadedAt: photoRecord.createdAt.toISOString(),
        metadata: photoRecord.metadata
      },
      message: 'Photo uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload photo' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const type = searchParams.get('type');

    let whereClause: any = {};
    
    if (taskId) {
      whereClause.taskId = taskId;
    }
    
    if (type) {
      whereClause.type = type.toUpperCase();
    }

    const photos = await prisma.photo.findMany({
      where: whereClause,
      include: {
        task: {
          select: {
            id: true,
            property: {
              select: {
                name: true,
                address: true
              }
            }
          }
        },
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: { photos },
      message: 'Photos retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch photos' 
      },
      { status: 500 }
    );
  }
}