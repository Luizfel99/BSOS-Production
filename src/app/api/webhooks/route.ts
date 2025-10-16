import { NextRequest } from 'next/server';
import { handleWebhook } from '../../../services/webhookHandlers';

export async function POST(request: NextRequest) {
  return handleWebhook(request);
}

export async function GET() {
  return new Response(JSON.stringify({ 
    status: 'Webhook endpoint ativo',
    endpoints: [
      'POST /api/webhooks?platform=airbnb',
      'POST /api/webhooks?platform=hostaway', 
      'POST /api/webhooks?platform=booking',
      'POST /api/webhooks?platform=turno',
      'POST /api/webhooks?platform=taskbird'
    ],
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
