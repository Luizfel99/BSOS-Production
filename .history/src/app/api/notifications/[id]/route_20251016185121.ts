import { NextRequest, NextResponse } from 'next/server';
import { 
  updateNotification, 
  deleteNotification,
  markAsRead
} from '@/services/notifications';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const userCookie = request.cookies.get('bsos-user')?.value;
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // For individual notification GET, we could implement getNotificationById
    // For now, return success placeholder
    return NextResponse.json({
      success: true,
      data: { id: params.id, message: 'Individual notification endpoint' }
    });

  } catch (error) {
    console.error('GET /api/notifications/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const userCookie = request.cookies.get('bsos-user')?.value;
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'mark_read') {
      const result = await markAsRead(params.id);
      return NextResponse.json(result);
    }

    const result = await updateNotification(params.id, data);
    return NextResponse.json(result);

  } catch (error) {
    console.error('PUT /api/notifications/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const userCookie = request.cookies.get('bsos-user')?.value;
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const result = await deleteNotification(params.id);
    return NextResponse.json(result);

  } catch (error) {
    console.error('DELETE /api/notifications/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}