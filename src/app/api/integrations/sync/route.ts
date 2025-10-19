import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Mock data para sincronização de integrações
  const syncResult = {
    success: true,
    timestamp: new Date().toISOString(),
    platforms: {
      airbnb: {
        status: 'success',
        newBookings: 3,
        updatedBookings: 2,
        lastSync: new Date().toISOString()
      },
      booking: {
        status: 'success', 
        newBookings: 1,
        updatedBookings: 0,
        lastSync: new Date().toISOString()
      },
      vrbo: {
        status: 'success',
        newBookings: 0,
        updatedBookings: 1,
        lastSync: new Date().toISOString()
      }
    },
    totalNewBookings: 4,
    totalUpdatedBookings: 3,
    message: 'Sincronização concluída com sucesso'
  };

  // Simular tempo de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));

  return NextResponse.json(syncResult);
}
