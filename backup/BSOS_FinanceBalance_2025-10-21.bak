import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function GET(request: NextRequest) {
  try {
    // Fetch account balance
    const balance = await stripe.balance.retrieve();
    
    // Fetch recent transactions for analytics
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
    const sevenDaysAgo = now - (7 * 24 * 60 * 60);

    // Get charges from last 30 days for analytics
    const recentCharges = await stripe.charges.list({
      created: { gte: thirtyDaysAgo },
      limit: 100,
    });

    // Get refunds from last 30 days
    const recentRefunds = await stripe.refunds.list({
      created: { gte: thirtyDaysAgo },
      limit: 100,
    });

    // Calculate analytics
    const successfulCharges = recentCharges.data.filter(charge => charge.status === 'succeeded');
    const last7DaysCharges = successfulCharges.filter(charge => charge.created >= sevenDaysAgo);
    const last30DaysCharges = successfulCharges;

    const totalRevenue30Days = last30DaysCharges.reduce((sum, charge) => sum + charge.amount, 0);
    const totalRevenue7Days = last7DaysCharges.reduce((sum, charge) => sum + charge.amount, 0);
    
    const totalRefunds30Days = recentRefunds.data.reduce((sum, refund) => sum + refund.amount, 0);
    
    const netRevenue30Days = totalRevenue30Days - totalRefunds30Days;
    
    // Calculate average transaction value
    const avgTransactionValue = last30DaysCharges.length > 0 
      ? totalRevenue30Days / last30DaysCharges.length 
      : 0;

    // Group payment methods
    const paymentMethods = last30DaysCharges.reduce((acc, charge) => {
      const method = charge.payment_method_details?.type || 'unknown';
      acc[method] = (acc[method] || 0) + charge.amount;
      return acc;
    }, {} as Record<string, number>);

    // Calculate week-over-week growth
    const previousWeekStart = sevenDaysAgo - (7 * 24 * 60 * 60);
    const previousWeekCharges = successfulCharges.filter(
      charge => charge.created >= previousWeekStart && charge.created < sevenDaysAgo
    );
    const previousWeekRevenue = previousWeekCharges.reduce((sum, charge) => sum + charge.amount, 0);
    
    const weekOverWeekGrowth = previousWeekRevenue > 0 
      ? ((totalRevenue7Days - previousWeekRevenue) / previousWeekRevenue) * 100 
      : 0;

    // Generate daily revenue data for the last 7 days
    const dailyRevenue = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = now - (i * 24 * 60 * 60);
      const dayEnd = dayStart + (24 * 60 * 60);
      
      const dayCharges = successfulCharges.filter(
        charge => charge.created >= dayStart && charge.created < dayEnd
      );
      
      const dayRevenue = dayCharges.reduce((sum, charge) => sum + charge.amount, 0);
      
      dailyRevenue.push({
        date: new Date(dayStart * 1000).toISOString().split('T')[0],
        revenue: dayRevenue,
        transactions: dayCharges.length,
      });
    }

    return NextResponse.json({
      balance: {
        available: balance.available,
        pending: balance.pending,
        instant_available: balance.instant_available,
      },
      analytics: {
        total_revenue_30_days: totalRevenue30Days,
        total_revenue_7_days: totalRevenue7Days,
        total_refunds_30_days: totalRefunds30Days,
        net_revenue_30_days: netRevenue30Days,
        total_transactions_30_days: last30DaysCharges.length,
        total_transactions_7_days: last7DaysCharges.length,
        avg_transaction_value: avgTransactionValue,
        week_over_week_growth: weekOverWeekGrowth,
        payment_methods: paymentMethods,
        daily_revenue: dailyRevenue,
      },
    });

  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance information' },
      { status: 500 }
    );
  }
}