import { NextRequest, NextResponse } from 'next/server';

// Mock data for now - will be replaced with Prisma queries
const mockAnalyticsData = {
  overview: {
    totalCleanings: 363,
    completionRate: 96.7,
    averageRating: 4.7,
    totalRevenue: 31500,
    activeCleaners: 12,
    activeClients: 124
  },
  
  monthlyTrends: [
    { month: 'Jan', cleanings: 45, completed: 42, revenue: 4200, satisfaction: 4.6 },
    { month: 'Feb', cleanings: 52, completed: 50, revenue: 5000, satisfaction: 4.7 },
    { month: 'Mar', cleanings: 48, completed: 46, revenue: 4600, satisfaction: 4.8 },
    { month: 'Apr', cleanings: 61, completed: 59, revenue: 5900, satisfaction: 4.6 },
    { month: 'May', cleanings: 55, completed: 53, revenue: 5300, satisfaction: 4.9 },
    { month: 'Jun', cleanings: 67, completed: 65, revenue: 6500, satisfaction: 4.7 },
  ],
  
  teamPerformance: [
    { 
      id: 1, 
      name: 'Maria Silva', 
      cleanings: 28, 
      completed: 27,
      rating: 4.8, 
      efficiency: 95,
      revenue: 2800
    },
    { 
      id: 2, 
      name: 'João Santos', 
      cleanings: 24, 
      completed: 23,
      rating: 4.6, 
      efficiency: 92,
      revenue: 2400
    },
    { 
      id: 3, 
      name: 'Ana Costa', 
      cleanings: 31, 
      completed: 31,
      rating: 4.9, 
      efficiency: 98,
      revenue: 3100
    },
    { 
      id: 4, 
      name: 'Pedro Oliveira', 
      cleanings: 22, 
      completed: 20,
      rating: 4.5, 
      efficiency: 88,
      revenue: 2200
    },
  ],
  
  clientSatisfaction: [
    { rating: 5, count: 85, percentage: 68.0 },
    { rating: 4, count: 25, percentage: 20.0 },
    { rating: 3, count: 10, percentage: 8.0 },
    { rating: 2, count: 3, percentage: 2.4 },
    { rating: 1, count: 2, percentage: 1.6 },
  ],
  
  propertyTypes: [
    { type: 'apartamento', name: 'Apartamentos', count: 45, percentage: 45 },
    { type: 'casa', name: 'Casas', count: 30, percentage: 30 },
    { type: 'escritorio', name: 'Escritórios', count: 15, percentage: 15 },
    { type: 'airbnb', name: 'Airbnb', count: 10, percentage: 10 },
  ],
  
  recentActivities: [
    {
      id: 1,
      type: 'cleaning_completed',
      message: 'Limpeza concluída no Apt 304 - Copacabana',
      cleaner: 'Ana Costa',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      rating: 5
    },
    {
      id: 2,
      type: 'new_booking',
      message: 'Nova reserva agendada para Casa Vila Madalena',
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      type: 'rating_received',
      message: 'Avaliação 5⭐ recebida de cliente',
      cleaner: 'Maria Silva',
      timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
      rating: 5
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '6months';
    const metric = searchParams.get('metric') || 'all';

    // TODO: Replace with actual Prisma queries
    /*
    Example Prisma queries for future implementation:
    
    const totalCleanings = await prisma.cleaning.count({
      where: {
        createdAt: {
          gte: getDateRange(timeRange)
        }
      }
    });

    const completionRate = await prisma.cleaning.aggregate({
      where: {
        createdAt: {
          gte: getDateRange(timeRange)
        }
      },
      _avg: {
        completionPercentage: true
      }
    });

    const teamPerformance = await prisma.user.findMany({
      where: {
        role: 'cleaner'
      },
      include: {
        cleanings: {
          where: {
            createdAt: {
              gte: getDateRange(timeRange)
            }
          }
        },
        ratings: true
      }
    });

    const clientSatisfaction = await prisma.rating.groupBy({
      by: ['score'],
      _count: {
        score: true
      },
      where: {
        createdAt: {
          gte: getDateRange(timeRange)
        }
      }
    });
    */

    // Filter data based on requested metric
    let responseData;
    
    switch (metric) {
      case 'overview':
        responseData = { overview: mockAnalyticsData.overview };
        break;
      case 'trends':
        responseData = { monthlyTrends: mockAnalyticsData.monthlyTrends };
        break;
      case 'team':
        responseData = { teamPerformance: mockAnalyticsData.teamPerformance };
        break;
      case 'satisfaction':
        responseData = { clientSatisfaction: mockAnalyticsData.clientSatisfaction };
        break;
      case 'properties':
        responseData = { propertyTypes: mockAnalyticsData.propertyTypes };
        break;
      case 'activities':
        responseData = { recentActivities: mockAnalyticsData.recentActivities };
        break;
      default:
        responseData = mockAnalyticsData;
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      timeRange,
      lastUpdated: new Date().toISOString(),
      // Add metadata for future caching
      metadata: {
        source: 'mock_data',
        version: '1.0',
        nextUpdate: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics data',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  // Support HEAD requests for health checks
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Last-Modified': new Date().toUTCString()
    }
  });
}

// Helper function for future Prisma integration
function getDateRange(timeRange: string): Date {
  const now = new Date();
  
  switch (timeRange) {
    case '7days':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30days':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '3months':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '6months':
      return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    case '1year':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000); // 6 months default
  }
}