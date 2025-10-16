/**
 * PAINEL ADMINISTRATIVO - Bright & Shine
 * Sistema completo de gestão empresarial
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Building2, Calendar, DollarSign, TrendingUp, 
  Shield, Settings, Download, Filter, Search, RefreshCw, AlertTriangle,
  Clock, Target, Award, PieChart, Activity, Globe, Lock, UserCheck,
  FileText, Zap, CreditCard, MapPin, Star, CheckCircle, XCircle,
  ArrowUp, ArrowDown, Eye, Edit3, Trash2, Plus, MoreHorizontal
} from 'lucide-react';

interface AdminStats {
  overview: {
    totalProperties: number;
    totalClients: number;
    totalEmployees: number;
    totalCleanings: number;
    activeBookings: number;
    pendingApprovals: number;
  };
  financial: {
    totalRevenue: number;
    netProfit: number;
    totalExpenses: number;
    avgRevenuePerProperty: number;
    monthlyGrowth: number;
    unpaidInvoices: number;
  };
  performance: {
    avgCleaningTime: number;
    clientSatisfaction: number;
    employeePerformance: number;
    completionRate: number;
    complaintRate: number;
    revisitRate: number;
  };
}

interface PropertyOverview {
  id: string;
  name: string;
  type: 'airbnb' | 'residential' | 'commercial';
  address: string;
  client: string;
  status: 'active' | 'inactive' | 'maintenance';
  cleaningsThisMonth: number;
  revenue: number;
  avgRating: number;
  lastCleaning: string;
  nextCleaning: string;
  assignedTeam: string[];
}

interface EmployeePerformance {
  id: string;
  name: string;
  photo: string;
  role: 'cleaner' | 'supervisor' | 'manager';
  cleaningsCompleted: number;
  avgTimePerCleaning: number;
  avgRating: number;
  efficiency: number;
  revenue: number;
  complaints: number;
  absences: number;
  status: 'active' | 'vacation' | 'sick' | 'inactive';
}

interface IntegrationStatus {
  id: string;
  name: string;
  type: 'calendar' | 'payment' | 'booking' | 'communication' | 'accounting';
  status: 'connected' | 'error' | 'disconnected';
  lastSync: string;
  syncFrequency: string;
  recordsProcessed: number;
  errorCount: number;
}

const integrationIcons = {
  airbnb: 'AB',
  hostaway: 'HW',
  stripe: 'ST',
  quickbooks: 'QB',
  google: 'GO',
  twilio: 'TW',
  icall: 'IC'
};

export default function PainelAdministrativo() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [properties, setProperties] = useState<PropertyOverview[]>([]);
  const [employees, setEmployees] = useState<EmployeePerformance[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'employees' | 'financial' | 'reports' | 'integrations' | 'permissions'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [selectedPeriod]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch all admin data
      const [statsRes, propertiesRes, employeesRes, integrationsRes] = await Promise.all([
        fetch(`/api/admin/stats?period=${selectedPeriod}`),
        fetch(`/api/admin/properties?period=${selectedPeriod}`),
        fetch(`/api/admin/employees?period=${selectedPeriod}`),
        fetch(`/api/admin/integrations`)
      ]);

      const statsData = await statsRes.json();
      const propertiesData = await propertiesRes.json();
      const employeesData = await employeesRes.json();
      const integrationsData = await integrationsRes.json();

      setStats(statsData.stats || {});
      setProperties(propertiesData.properties || []);
      setEmployees(employeesData.employees || []);
      setIntegrations(integrationsData.integrations || []);
      
    } catch (error) {
      console.error('Erro ao buscar dados administrativos:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/reports/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, period: selectedPeriod })
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${type}-${selectedPeriod}.pdf`;
      a.click();
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
    }
  };

  const syncIntegration = async (integrationId: string) => {
    try {
      await fetch(`/api/admin/integrations/${integrationId}/sync`, {
        method: 'POST'
      });
      fetchAdminData();
    } catch (error) {
      console.error('Erro ao sincronizar integração:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600">Gestão completa da Bright & Shine</p>
        </div>
        
        <div className="flex gap-3">
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={() => exportReport('complete')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Download className="h-4 w-4 inline mr-2" />
            Exportar Relatório
          </button>
          <button
            onClick={fetchAdminData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 inline mr-2" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b overflow-x-auto">
        {[
          { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
          { id: 'properties', label: 'Propriedades', icon: Building2 },
          { id: 'employees', label: 'Equipe', icon: Users },
          { id: 'financial', label: 'Financeiro', icon: DollarSign },
          { id: 'reports', label: 'Relatórios', icon: FileText },
          { id: 'integrations', label: 'Integrações', icon: Zap },
          { id: 'permissions', label: 'Permissões', icon: Shield }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Propriedades</p>
                  <p className="text-3xl font-bold">{stats.overview.totalProperties}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-200" />
              </div>
              <div className="mt-4 text-sm text-blue-100">
                {stats.overview.activeBookings} reservas ativas
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Receita Total</p>
                  <p className="text-3xl font-bold">R$ {stats.financial.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
              <div className="mt-4 flex items-center text-sm text-green-100">
                <ArrowUp className="h-4 w-4 mr-1" />
                {stats.financial.monthlyGrowth}% vs mês anterior
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Equipe Total</p>
                  <p className="text-3xl font-bold">{stats.overview.totalEmployees}</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
              <div className="mt-4 text-sm text-purple-100">
                Performance média: {stats.performance.employeePerformance}%
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Limpezas/Mês</p>
                  <p className="text-3xl font-bold">{stats.overview.totalCleanings}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-200" />
              </div>
              <div className="mt-4 text-sm text-orange-100">
                {stats.performance.completionRate}% taxa de conclusão
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Indicadores de Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tempo Médio de Limpeza</span>
                  <span className="font-semibold">{stats.performance.avgCleaningTime}min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Satisfação do Cliente</span>
                  <span className="font-semibold flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {stats.performance.clientSatisfaction}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxa de Reclamações</span>
                  <span className="font-semibold text-red-600">{stats.performance.complaintRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxa de Revisitas</span>
                  <span className="font-semibold text-orange-600">{stats.performance.revisitRate}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Resumo Financeiro</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Receita Total</span>
                  <span className="font-semibold text-green-600">
                    R$ {stats.financial.totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Despesas Totais</span>
                  <span className="font-semibold text-red-600">
                    R$ {stats.financial.totalExpenses.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lucro Líquido</span>
                  <span className="font-semibold text-blue-600">
                    R$ {stats.financial.netProfit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Faturas Pendentes</span>
                  <span className="font-semibold text-orange-600">
                    R$ {stats.financial.unpaidInvoices.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setShowPropertyModal(true)}
                className="p-4 border rounded-lg hover:bg-gray-50 text-center"
              >
                <Plus className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <span className="text-sm font-medium">Nova Propriedade</span>
              </button>
              
              <button
                onClick={() => setShowEmployeeModal(true)}
                className="p-4 border rounded-lg hover:bg-gray-50 text-center"
              >
                <UserCheck className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <span className="text-sm font-medium">Novo Funcionário</span>
              </button>
              
              <button
                onClick={() => exportReport('financial')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-center"
              >
                <FileText className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <span className="text-sm font-medium">Relatório Financeiro</span>
              </button>
              
              <button
                onClick={() => setShowIntegrationModal(true)}
                className="p-4 border rounded-lg hover:bg-gray-50 text-center"
              >
                <Zap className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <span className="text-sm font-medium">Nova Integração</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar propriedades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded px-3 py-1"
              />
            </div>
            
            <select className="border rounded px-3 py-1">
              <option value="all">Todos os Tipos</option>
              <option value="airbnb">Airbnb</option>
              <option value="residential">Residencial</option>
              <option value="commercial">Comercial</option>
            </select>
            
            <select className="border rounded px-3 py-1">
              <option value="all">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="maintenance">Manutenção</option>
            </select>

            <button
              onClick={() => setShowPropertyModal(true)}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Nova Propriedade
            </button>
          </div>

          {/* Properties Grid */}
          <div className="grid gap-6">
            {properties.map(property => (
              <div key={property.id} className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      property.status === 'active' ? 'bg-green-500' : 
                      property.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <h3 className="font-semibold text-lg">{property.name}</h3>
                      <p className="text-gray-600">{property.address}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          property.type === 'airbnb' ? 'bg-red-100 text-red-600' :
                          property.type === 'residential' ? 'bg-blue-100 text-blue-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {property.type}
                        </span>
                        <span className="text-sm text-gray-500">Cliente: {property.client}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {property.revenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Receita do mês</div>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{property.cleaningsThisMonth}</div>
                    <div className="text-xs text-gray-500">Limpezas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600 flex items-center justify-center">
                      <Star className="h-4 w-4 mr-1" />
                      {property.avgRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">Avaliação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{property.assignedTeam.length}</div>
                    <div className="text-xs text-gray-500">Equipe</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-600">{property.lastCleaning}</div>
                    <div className="text-xs text-gray-500">Última</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-600">{property.nextCleaning}</div>
                    <div className="text-xs text-gray-500">Próxima</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      <Eye className="h-4 w-4 inline mr-1" />
                      Detalhes
                    </button>
                    <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
                      <Edit3 className="h-4 w-4 inline mr-1" />
                      Editar
                    </button>
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Agendar
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Equipe: {property.assignedTeam.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {integrations.map(integration => (
              <div key={integration.id} className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">
                      {integrationIcons[integration.name.toLowerCase() as keyof typeof integrationIcons] || '🔗'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{integration.name}</h3>
                      <p className="text-gray-600 capitalize">{integration.type}</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                        integration.status === 'connected' ? 'bg-green-100 text-green-800' :
                        integration.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {integration.status === 'connected' ? <CheckCircle className="h-4 w-4" /> :
                         integration.status === 'error' ? <XCircle className="h-4 w-4" /> :
                         <Clock className="h-4 w-4" />}
                        {integration.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {integration.recordsProcessed.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Registros processados</div>
                    {integration.errorCount > 0 && (
                      <div className="text-sm text-red-600 mt-1">
                        {integration.errorCount} erros
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-600">Última Sincronização:</span>
                    <div className="font-medium">{integration.lastSync}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Frequência:</span>
                    <div className="font-medium">{integration.syncFrequency}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => syncIntegration(integration.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      <RefreshCw className="h-4 w-4 inline mr-2" />
                      Sincronizar
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                      <Settings className="h-4 w-4 inline mr-2" />
                      Configurar
                    </button>
                  </div>
                  
                  {integration.status === 'error' && (
                    <div className="text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Requer atenção
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center py-8">
            <button
              onClick={() => setShowIntegrationModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 inline mr-2" />
              Adicionar Nova Integração
            </button>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Controle de Permissões por Função</h3>
            
            <div className="grid gap-6">
              {[
                { role: 'Equipe', level: 'basic', color: 'blue', permissions: ['Ver agendamentos próprios', 'Enviar fotos', 'Marcar conclusão'] },
                { role: 'Supervisor', level: 'intermediate', color: 'green', permissions: ['Gerenciar equipe', 'Revisar limpezas', 'Aprovar avaliações', 'Acessar relatórios'] },
                { role: 'Gerente', level: 'advanced', color: 'purple', permissions: ['Gerenciar propriedades', 'Controle financeiro', 'Relatórios completos', 'Configurar integrações'] },
                { role: 'Administrador', level: 'full', color: 'red', permissions: ['Acesso total', 'Gerenciar usuários', 'Configurações do sistema', 'Auditoria completa'] }
              ].map(role => (
                <div key={role.role} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${role.color}-500`}></div>
                      <h4 className="font-semibold">{role.role}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full bg-${role.color}-100 text-${role.color}-600`}>
                        {role.level}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {role.permissions.map(permission => (
                      <div key={permission} className="text-sm text-gray-600 flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {permission}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setShowPermissionModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <Shield className="h-4 w-4 inline mr-2" />
                Configurar Permissões
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}