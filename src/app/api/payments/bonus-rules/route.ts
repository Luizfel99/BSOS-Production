import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock bonus rules for payments
    const bonusRules = [
      {
        id: 'bonus-001',
        name: 'Performance Excellence',
        type: 'performance',
        condition: 'rating >= 4.8',
        amount: 200,
        isActive: true,
        description: 'Bonus for maintaining rating above 4.8'
      },
      {
        id: 'bonus-002',
        name: 'Punctuality Bonus',
        type: 'punctuality',
        condition: 'onTime >= 95%',
        amount: 100,
        isActive: true,
        description: 'Bonus for being on time 95% or more'
      },
      {
        id: 'bonus-003',
        name: 'Volume Bonus',
        type: 'volume',
        condition: 'cleanings >= 20',
        amount: 150,
        isActive: true,
        description: 'Bonus for completing 20+ cleanings per month'
      },
      {
        id: 'bonus-004',
        name: 'Customer Satisfaction',
        type: 'satisfaction',
        condition: 'customerRating >= 4.7',
        amount: 175,
        isActive: true,
        description: 'Bonus for high customer satisfaction scores'
      }
    ];

    return NextResponse.json({
      success: true,
      bonusRules
    });
  } catch (error) {
    console.error('Error fetching payment bonus rules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bonus rules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newRule = {
      id: `bonus-${Date.now()}`,
      ...body,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      bonusRule: newRule,
      message: 'Bonus rule created successfully'
    });
  } catch (error) {
    console.error('Error creating bonus rule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create bonus rule' },
      { status: 500 }
    );
  }
}
