import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || 'client-001';
    const property = searchParams.get('property');

    // Mock inventory data
    const inventory = [
      {
        id: 'inv-001',
        clientId: 'client-001',
        property: 'Casa da Praia - Ipanema',
        name: 'Lençol Casal Branco',
        category: 'linens',
        brand: 'Trussardi',
        currentStock: 8,
        requiredStock: 12,
        minStock: 4,
        lastRestocked: '2025-10-01',
        autoReorder: true,
        unitCost: 45,
        supplier: 'Casa & Cia',
        location: 'Armário Principal - Prateleira 2',
        condition: 'excellent',
        lastInspection: '2025-10-05'
      },
      {
        id: 'inv-002',
        clientId: 'client-001',
        property: 'Casa da Praia - Ipanema',
        name: 'Toalha de Banho Premium',
        category: 'linens',
        brand: 'Buddemeyer',
        currentStock: 15,
        requiredStock: 20,
        minStock: 8,
        lastRestocked: '2025-09-28',
        autoReorder: true,
        unitCost: 25,
        supplier: 'Casa & Cia',
        location: 'Armário Banheiro Suite',
        condition: 'good',
        lastInspection: '2025-10-05'
      },
      {
        id: 'inv-003',
        clientId: 'client-001',
        property: 'Casa da Praia - Ipanema',
        name: 'Shampoo Premium 30ml',
        category: 'amenities',
        brand: 'L\'Occitane',
        currentStock: 25,
        requiredStock: 50,
        minStock: 15,
        lastRestocked: '2025-10-05',
        autoReorder: true,
        unitCost: 8,
        supplier: 'Beauty Supply Co',
        location: 'Estoque Banheiros',
        condition: 'excellent',
        lastInspection: '2025-10-06',
        expiryDate: '2026-10-05'
      },
      {
        id: 'inv-004',
        clientId: 'client-001',
        property: 'Apartamento Copacabana',
        name: 'Condicionador Premium 30ml',
        category: 'amenities',
        brand: 'L\'Occitane',
        currentStock: 30,
        requiredStock: 50,
        minStock: 15,
        lastRestocked: '2025-10-05',
        autoReorder: true,
        unitCost: 8,
        supplier: 'Beauty Supply Co',
        location: 'Estoque Banheiros',
        condition: 'excellent',
        lastInspection: '2025-10-06',
        expiryDate: '2026-10-05'
      },
      {
        id: 'inv-005',
        clientId: 'client-001',
        property: 'Casa da Praia - Ipanema',
        name: 'Sabonete Artesanal',
        category: 'amenities',
        brand: 'Granado',
        currentStock: 12,
        requiredStock: 30,
        minStock: 10,
        lastRestocked: '2025-09-30',
        autoReorder: true,
        unitCost: 6,
        supplier: 'Beauty Supply Co',
        location: 'Estoque Banheiros',
        condition: 'excellent',
        lastInspection: '2025-10-06',
        expiryDate: '2026-09-30'
      },
      {
        id: 'inv-006',
        clientId: 'client-001',
        property: 'Casa da Praia - Ipanema',
        name: 'Papel Higiênico Premium',
        category: 'supplies',
        brand: 'Personal VIP',
        currentStock: 24,
        requiredStock: 48,
        minStock: 12,
        lastRestocked: '2025-10-03',
        autoReorder: true,
        unitCost: 12,
        supplier: 'Distribuidora Higiene',
        location: 'Depósito Geral',
        condition: 'excellent',
        lastInspection: '2025-10-06'
      }
    ];

    // Filter by property if specified
    let filteredInventory = inventory.filter(item => item.clientId === clientId);
    if (property) {
      filteredInventory = filteredInventory.filter(item => item.property === property);
    }

    // Group by category
    const categories = filteredInventory.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    // Calculate alerts
    const alerts = filteredInventory.filter(item => 
      item.currentStock <= item.minStock || 
      (item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) // 30 days
    );

    return NextResponse.json({
      success: true,
      inventory: filteredInventory,
      categories,
      alerts: {
        lowStock: alerts.filter(item => item.currentStock <= item.minStock),
        expiringSoon: alerts.filter(item => 
          item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        )
      },
      summary: {
        totalItems: filteredInventory.length,
        totalValue: filteredInventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0),
        needsRestock: filteredInventory.filter(item => item.currentStock < item.requiredStock).length,
        autoReorderEnabled: filteredInventory.filter(item => item.autoReorder).length
      }
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemIds, quantity, urgent = false, notes } = body;

    const restockRequest = {
      id: `restock-${Date.now()}`,
      clientId: body.clientId || 'client-001',
      property: body.property,
      items: itemIds.map((id: string) => ({
        itemId: id,
        requestedQuantity: quantity,
        priority: urgent ? 'high' : 'normal'
      })),
      status: 'pending',
      urgent,
      notes,
      requestedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + (urgent ? 24 : 72) * 60 * 60 * 1000).toISOString()
    };

    return NextResponse.json({
      success: true,
      restockRequest,
      message: 'Solicitação de reposição enviada com sucesso'
    });
  } catch (error) {
    console.error('Error creating restock request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create restock request' },
      { status: 500 }
    );
  }
}
