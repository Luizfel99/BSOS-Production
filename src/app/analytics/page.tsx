'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import MobileNavigation from '@/components/MobileNavigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Users,
  CheckCircle,
  Star,
  Calendar,
  DollarSign,
  Clock,
  Target,
  Award,
  BarChart3
} from 'lucide-react';

// Sample data - will be replaced with Prisma data later
const sampleData = {
  monthlyCleanings: [
    { month: 'Jan', cleanings: 45, completed: 42, revenue: 4200 },
    { month: 'Feb', cleanings: 52, completed: 50, revenue: 5000 },
    { month: 'Mar', cleanings: 48, completed: 46, revenue: 4600 },
    { month: 'Apr', cleanings: 61, completed: 59, revenue: 5900 },
    { month: 'May', cleanings: 55, completed: 53, revenue: 5300 },
    { month: 'Jun', cleanings: 67, completed: 65, revenue: 6500 },
  ],
  
  teamPerformance: [
    { name: 'Maria Silva', cleanings: 28, rating: 4.8, efficiency: 95 },
    { name: 'João Santos', cleanings: 24, rating: 4.6, efficiency: 92 },
    { name: 'Ana Costa', cleanings: 31, rating: 4.9, efficiency: 98 },
    { name: 'Pedro Oliveira', cleanings: 22, rating: 4.5, efficiency: 88 },
  ],
  
  clientSatisfaction: [
    { rating: '5 Stars', count: 85, percentage: 68 },
    { rating: '4 Stars', count: 25, percentage: 20 },
    { rating: '3 Stars', count: 10, percentage: 8 },
    { rating: '2 Stars', count: 3, percentage: 2.4 },
    { rating: '1 Star', count: 2, percentage: 1.6 },
  ],
  
  weeklyTrends: [
    { day: 'Mon', tasks: 12, completed: 11, satisfaction: 4.7 },
    { day: 'Tue', tasks: 15, completed: 14, satisfaction: 4.8 },
    { day: 'Wed', tasks: 18, completed: 17, satisfaction: 4.6 },
    { day: 'Thu', tasks: 14, completed: 13, satisfaction: 4.9 },
    { day: 'Fri', tasks: 16, completed: 16, satisfaction: 4.8 },
    { day: 'Sat', tasks: 8, completed: 8, satisfaction: 4.9 },
    { day: 'Sun', tasks: 5, completed: 5, satisfaction: 4.7 },
  ],
  
  propertyTypes: [
    { name: 'Apartamentos', value: 45, color: '#3B82F6' },
    { name: 'Casas', value: 30, color: '#10B981' },
    { name: 'Escritórios', value: 15, color: '#F59E0B' },
    { name: 'Airbnb', value: 10, color: '#EF4444' },
  ]
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, trend, color = 'blue' }: {
  title: string;
  value: string | number;
  icon: any;
  trend?: { value: number; isPositive: boolean };
  color?: string;
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${
                !trend.isPositive ? 'rotate-180' : ''
              }`} />
              {trend.value}% vs mês anterior
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('6months');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate summary metrics
  const totalCleanings = sampleData.monthlyCleanings.reduce((sum, month) => sum + month.cleanings, 0);
  const totalCompleted = sampleData.monthlyCleanings.reduce((sum, month) => sum + month.completed, 0);
  const completionRate = Math.round((totalCompleted / totalCleanings) * 100);
  const averageRating = sampleData.teamPerformance.reduce((sum, member) => sum + member.rating, 0) / sampleData.teamPerformance.length;
  const totalRevenue = sampleData.monthlyCleanings.reduce((sum, month) => sum + month.revenue, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50">
        <MobileNavigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Insights e métricas de performance do B.S.O.S.
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7days">Últimos 7 dias</option>
                  <option value="30days">Últimos 30 dias</option>
                  <option value="3months">Últimos 3 meses</option>
                  <option value="6months">Últimos 6 meses</option>
                  <option value="1year">Último ano</option>
                </select>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total de Limpezas"
              value={totalCleanings}
              icon={CheckCircle}
              trend={{ value: 12, isPositive: true }}
              color="blue"
            />
            
            <MetricCard
              title="Taxa de Conclusão"
              value={`${completionRate}%`}
              icon={Target}
              trend={{ value: 3, isPositive: true }}
              color="green"
            />
            
            <MetricCard
              title="Satisfação do Cliente"
              value={averageRating.toFixed(1)}
              icon={Star}
              trend={{ value: 0.2, isPositive: true }}
              color="yellow"
            />
            
            <MetricCard
              title="Receita Total"
              value={`R$ ${totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: 8, isPositive: true }}
              color="purple"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Performance */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Mensal
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={sampleData.monthlyCleanings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="cleanings"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                    name="Limpezas Agendadas"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stackId="2"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                    name="Limpezas Concluídas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Team Performance */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance da Equipe
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleData.teamPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cleanings" fill="#3B82F6" name="Limpezas" />
                  <Bar dataKey="efficiency" fill="#10B981" name="Eficiência %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Client Satisfaction */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Satisfação do Cliente
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sampleData.clientSatisfaction}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ rating, percentage }) => `${rating}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {sampleData.clientSatisfaction.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Trends */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tendências Semanais
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={sampleData.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tasks"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    name="Tarefas"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Concluídas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Property Types */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tipos de Propriedade
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sampleData.propertyTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {sampleData.propertyTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Melhor Funcionário
                  </h4>
                  <p className="text-gray-600">Ana Costa - 4.9⭐</p>
                  <p className="text-sm text-gray-500">98% de eficiência</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Tempo Médio
                  </h4>
                  <p className="text-gray-600">2h 15min por limpeza</p>
                  <p className="text-sm text-gray-500">-8% vs mês anterior</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Clientes Ativos
                  </h4>
                  <p className="text-gray-600">124 proprietários</p>
                  <p className="text-sm text-gray-500">+5 novos este mês</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}