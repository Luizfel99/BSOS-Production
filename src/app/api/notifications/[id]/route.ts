import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteContext {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const userCookie = request.cookies.get('bsos-user')?.value;
    if (!userCookie) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const notification = await prisma.notification.update({
      where: { id: params.id },
      data: { read: true }
    });

    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to mark as read' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const userCookie = request.cookies.get('bsos-user')?.value;
    if (!userCookie) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' }, 
        { status: 401 }
      );
    }

    await prisma.notification.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete notification' }, 
      { status: 500 }
    );
  }
}
