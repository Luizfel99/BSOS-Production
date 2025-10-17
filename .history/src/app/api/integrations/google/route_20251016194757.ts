import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: false, 
    message: "Google integration in development" 
  });
}

export async function POST() {
  return NextResponse.json({ 
    success: false, 
    message: "Google integration in development" 
  });
}