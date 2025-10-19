import { useState, useEffect } from 'react';

export interface AnalyticsOverview {
  totalCleanings: number;
  completionRate: number;
  averageRating: number;
  totalRevenue: number;
  activeCleaners: number;
  activeClients: number;
}

export interface MonthlyTrend {
  month: string;
  cleanings: number;
  completed: number;
  revenue: number;
  satisfaction: number;
}

export interface TeamMember {
  id: number;
  name: string;
  cleanings: number;
  completed: number;
  rating: number;
  efficiency: number;
  revenue: number;
}

export interface SatisfactionData {
  rating: number;
  count: number;
  percentage: number;
}

export interface PropertyType {
  type: string;
  name: string;
  count: number;
  percentage: number;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  monthlyTrends: MonthlyTrend[];
  teamPerformance: TeamMember[];
  clientSatisfaction: SatisfactionData[];
  propertyTypes: PropertyType[];
  recentActivities: any[];
}

export interface UseAnalyticsOptions {
  timeRange?: string;
  metric?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseAnalyticsReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsReturn {
  const {
    timeRange = '6months',
    metric = 'all',
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000 // 5 minutes
  } = options;

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        timeRange,
        metric
      });

      const response = await fetch(`/api/analytics?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache control for better performance
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch analytics data');
      }

      setData(result.data);
      setLastUpdated(new Date(result.lastUpdated));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, metric]);

  // Auto refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchAnalytics, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, timeRange, metric]);

  return {
    data,
    loading,
    error,
    refresh: fetchAnalytics,
    lastUpdated
  };
}

// Specialized hooks for specific analytics data
export function useAnalyticsOverview(timeRange?: string) {
  return useAnalytics({ timeRange, metric: 'overview' });
}

export function useTeamPerformance(timeRange?: string) {
  return useAnalytics({ timeRange, metric: 'team' });
}

export function useClientSatisfaction(timeRange?: string) {
  return useAnalytics({ timeRange, metric: 'satisfaction' });
}

export function useMonthlyTrends(timeRange?: string) {
  return useAnalytics({ timeRange, metric: 'trends' });
}

// Utility functions for data processing
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatRating = (rating: number): string => {
  return `${rating.toFixed(1)}⭐`;
};

export const calculateGrowth = (current: number, previous: number): {
  value: number;
  isPositive: boolean;
  percentage: number;
} => {
  const difference = current - previous;
  const percentage = previous > 0 ? (difference / previous) * 100 : 0;
  
  return {
    value: difference,
    isPositive: difference >= 0,
    percentage: Math.abs(percentage)
  };
};

// Color schemes for charts
export const CHART_COLORS = {
  primary: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  success: ['#10B981', '#34D399', '#6EE7B7'],
  warning: ['#F59E0B', '#FBBF24', '#FCD34D'],
  danger: ['#EF4444', '#F87171', '#FCA5A5'],
  info: ['#3B82F6', '#60A5FA', '#93C5FD']
};

export default useAnalytics;