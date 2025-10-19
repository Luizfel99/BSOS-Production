'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw 
} from 'lucide-react';
import { formatCurrency } from '@/lib/stripe';
import { useNotifications } from '@/hooks/useNotifications';

interface BalanceData {
  available: number;
  pending: number;
  total: number;
  currency: string;
  lastUpdated: string;
}

interface AnalyticsData {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  monthlyTransactions: number;
  averageTransactionValue: number;
  topPaymentMethods: Array<{
    type: string;
    percentage: number;
    amount: number;
  }>;
}

export default function BalanceOverview() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { success, error } = useNotifications();

  const fetchBalanceData = async () => {
    try {
      const response = await fetch('/api/finance/balance');
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      setBalance(data.balance);
      setAnalytics(data.analytics);
    } catch (err) {
      error('Failed to load balance data');
      console.error('Balance fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBalanceData();
    success('Balance data refreshed');
  };

  useEffect(() => {
    fetchBalanceData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-gray-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading balance data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {balance && (
          <>
            {/* Available Balance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(balance.available, balance.currency)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">Available for payout</span>
              </div>
            </div>

            {/* Pending Balance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(balance.pending, balance.currency)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Calendar className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-yellow-600">Processing payments</span>
              </div>
            </div>

            {/* Total Balance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(balance.total, balance.currency)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">Last updated: {balance.lastUpdated}</span>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Analytics Section */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Analytics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-semibold">
                  {formatCurrency(analytics.totalRevenue, balance?.currency || 'usd')}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">This Month</span>
                <span className="font-semibold">
                  {formatCurrency(analytics.monthlyRevenue, balance?.currency || 'usd')}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Transaction</span>
                <span className="font-semibold">
                  {formatCurrency(analytics.averageTransactionValue, balance?.currency || 'usd')}
                </span>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Transactions</span>
                  <span className="font-semibold">{analytics.totalTransactions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold">{analytics.monthlyTransactions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {analytics.topPaymentMethods.map((method, index) => (
                <div key={method.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                      }}
                    />
                    <span className="text-gray-700 capitalize">
                      {method.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(method.amount, balance?.currency || 'usd')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {method.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}