import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;
    
    // Try to parse body, but don't fail if it's empty
    let body = {};
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch (parseError) {
      // Body is empty or not JSON, use empty object
    }

    // Mock marking channel as read
    const result = {
      success: true,
      channelId,
      markedAsRead: true,
      timestamp: new Date().toISOString(),
      userId: (body as any).userId || 'current-user'
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error marking channel as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark channel as read' },
      { status: 500 }
    );
  }
}