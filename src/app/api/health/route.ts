import { NextResponse } from 'next/server';

export async function GET() {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    service: 'BSOS API',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    checks: {
      database: await checkDatabase(),
      stripe: await checkStripe(),
      memory: checkMemory(),
    }
  };

  const allHealthy = Object.values(healthData.checks).every(check => check.status === 'healthy');

  return NextResponse.json(
    healthData,
    { status: allHealthy ? 200 : 503 }
  );
}

async function checkDatabase() {
  try {
    // Simple database connection check
    if (process.env.DATABASE_URL) {
      // In a real implementation, you'd test the actual connection
      return { status: 'healthy', message: 'Database URL configured' };
    } else {
      return { status: 'warning', message: 'Database URL not configured (using mock data)' };
    }
  } catch (error) {
    return { status: 'unhealthy', message: 'Database connection failed' };
  }
}

async function checkStripe() {
  try {
    if (process.env.STRIPE_SECRET_KEY) {
      return { status: 'healthy', message: 'Stripe configured' };
    } else {
      return { status: 'warning', message: 'Stripe not configured' };
    }
  } catch (error) {
    return { status: 'unhealthy', message: 'Stripe check failed' };
  }
}

function checkMemory() {
  const used = process.memoryUsage();
  const total = used.heapTotal;
  const usedPercent = (used.heapUsed / total) * 100;
  
  if (usedPercent > 90) {
    return { status: 'unhealthy', message: `High memory usage: ${usedPercent.toFixed(1)}%` };
  } else if (usedPercent > 75) {
    return { status: 'warning', message: `Moderate memory usage: ${usedPercent.toFixed(1)}%` };
  } else {
    return { status: 'healthy', message: `Memory usage: ${usedPercent.toFixed(1)}%` };
  }
}