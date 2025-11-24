import { NextResponse } from 'next/server';

export async function GET() {
  // Intentionally throw to validate Sentry API capture
  throw new Error('Sentry test error (API)');
}

export async function POST() {
  // Intentionally throw to validate Sentry API capture
  throw new Error('Sentry test error (API POST)');
}
