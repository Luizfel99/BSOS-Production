/**
 * Example Protected Dashboard Page
 * Demonstrates RBAC implementation with different content based on user role
 */

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedComponent, usePermissions } from '@/components/ProtectedComponent';
import RouteGuard from '@/components/RouteGuard';
import MobileNavigation from '@/components/MobileNavigation';
import { useNotifications } from '@/hooks/useNotifications';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  ClipboardList, 
  Home, 
  BarChart3, 
  DollarSign, 
  Settings,
  Shield,
  Bell,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { typographyClasses } from '@/config/theme';

// Quick stats component with role-based visibility
const QuickStats = () => {
  const { user } = useAuth();
  
  const stats = [
    {
      title: 'Tarefas Hoje',
      value: '12',
      icon: ClipboardList,
      color: 'bg-blue-500',
      permission: { module: 'tasks', action: 'view' }
    },
    {
      title: 'Funcionários Ativos',
      value: '8',
      icon: Users,
      color: 'bg-green-500',
      permission: { module: 'employees', action: 'view' }
    },
    {
      title: 'Propriedades',
      value: '25',
      icon: Home,
      color: 'bg-purple-500',
      permission: { module: 'properties', action: 'view' }
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 15.420',
      icon: DollarSign,
      color: 'bg-yellow-500',
      permission: { module: 'finance', action: 'view_finance' }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <ProtectedComponent
          key={index}
          module={stat.permission.module as any}
          action={stat.permission.action as any}
          fallback="none"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className={`${typographyClasses.bodySmall} font-medium text-gray-600`}>{stat.title}</p>
                <p className={`${typographyClasses.h2} text-gray-900`}>{stat.value}</p>
              </div>
            </div>
          </div>
        </ProtectedComponent>
      ))}
    </div>
  );
};

// Role-specific quick actions
const QuickActions = () => {
  const { user } = useAuth();
  const { success } = useNotifications();
  const router = useRouter();
  
  const actions = [
    {
      title: 'Criar Nova Tarefa',
      description: 'Agendar uma nova limpeza',
      icon: ClipboardList,
      color: 'bg-blue-600 hover:bg-blue-700',
      permission: { module: 'tasks', action: 'create' },
      onClick: () => {
        router.push('/tasks');
        success('Redirecionando para gestão de tarefas...');
      }
    },
    {
      title: 'Gerenciar Equipe',
      description: 'Adicionar ou editar funcionários',
      icon: Users,
      color: 'bg-green-600 hover:bg-green-700',
      permission: { module: 'employees', action: 'manage_users' },
      onClick: () => {
        router.push('/team/manage');
        success('Redirecionando para gestão de equipe...');
      }
    },
    {
      title: 'Relatórios',
      description: 'Visualizar relatórios e métricas',
      icon: BarChart3,
      color: 'bg-purple-600 hover:bg-purple-700',
      permission: { module: 'reports', action: 'view' },
      onClick: () => {
        router.push('/analytics');
        success('Redirecionando para analytics...');
      }
    },
    {
      title: 'Configurações',
      description: 'Configurar sistema e integrações',
      icon: Settings,
      color: 'bg-gray-600 hover:bg-gray-700',
      permission: { module: 'settings', action: 'configure' },
      onClick: () => {
        router.push('/settings');
        success('Redirecionando para configurações...');
      }
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className={`${typographyClasses.h4} mb-4`}>Ações Rápidas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <ProtectedComponent
            key={index}
            module={action.permission.module as any}
            action={action.permission.action as any}
            fallback={null}
          >
            <Button
              onClick={action.onClick}
              variant="primary"
              size="lg"
              className={`${action.color} text-white p-4 w-full text-left h-auto flex flex-col items-start`}
            >
              <action.icon className="h-6 w-6 mb-2" />
              <h4 className="font-medium">{action.title}</h4>
              <p className="text-sm opacity-90">{action.description}</p>
            </Button>
          </ProtectedComponent>
        ))}
        
        {/* Show placeholder when no actions are available */}
        {actions.every((action, index) => {
          const hasAccess = user?.role && ['owner', 'manager'].includes(user.role);
          return !hasAccess;
        }) && (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p>Nenhuma ação rápida disponível para o seu nível de acesso.</p>
            <p className="text-sm mt-1">Entre em contato com seu supervisor para mais informações.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Recent activity with role-based filtering
const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'task_completed',
      message: 'Tarefa de limpeza concluída por João Silva',
      time: '5 min atrás',
      icon: ClipboardList,
      permission: { module: 'tasks', action: 'view' }
    },
    {
      id: 2,
      type: 'payment_received',
      message: 'Pagamento de R$ 350 recebido - Apartamento 204',
      time: '1 hora atrás',
      icon: DollarSign,
      permission: { module: 'finance', action: 'view_finance' }
    },
    {
      id: 3,
      type: 'new_employee',
      message: 'Nova funcionária adicionada: Maria Santos',
      time: '2 horas atrás',
      icon: Users,
      permission: { module: 'employees', action: 'view' }
    },
    {
      id: 4,
      type: 'system_alert',
      message: 'Integração com Airbnb sincronizada com sucesso',
      time: '3 horas atrás',
      icon: Bell,
      permission: { module: 'integrations', action: 'view' }
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <ProtectedComponent
            key={activity.id}
            module={activity.permission.module as any}
            action={activity.permission.action as any}
            fallback="none"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <activity.icon className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          </ProtectedComponent>
        ))}
      </div>
    </div>
  );
};

// Role-specific welcome message
const WelcomeMessage = () => {
  const { user } = useAuth();
  
  const roleMessages = {
    owner: {
      title: 'Bem-vindo, Proprietário!',
      subtitle: 'Você tem acesso completo ao sistema',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200'
    },
    manager: {
      title: 'Bem-vindo, Gerente!',
      subtitle: 'Gerencie operações e equipe',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    supervisor: {
      title: 'Bem-vindo, Supervisor!',
      subtitle: 'Supervisione tarefas e qualidade',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200'
    },
    cleaner: {
      title: 'Bem-vindo, Profissional!',
      subtitle: 'Visualize e execute suas tarefas',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200'
    },
    client: {
      title: 'Bem-vindo, Cliente!',
      subtitle: 'Acompanhe seus serviços',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-200'
    }
  };

  const roleInfo = roleMessages[user?.role as keyof typeof roleMessages] || roleMessages.cleaner;

  return (
    <div className={`${roleInfo.bgColor} border rounded-lg p-6 mb-8`}>
      <div className="flex items-center">
        <Shield className={`h-8 w-8 ${roleInfo.color} mr-3`} />
        <div>
          <h2 className={`text-xl font-bold ${roleInfo.color}`}>
            {roleInfo.title}
          </h2>
          <p className="text-gray-600">{roleInfo.subtitle}</p>
          {user?.name && (
            <p className="text-sm text-gray-500 mt-1">
              Logado como: {user.name} ({user.role})
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProtectedDashboardExample() {
  const { user, authChecked } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeNavItem, setActiveNavItem] = useState('dashboard');

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Custom navigation items for the dashboard
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tarefas', icon: ClipboardList },
    { id: 'team', label: 'Equipe', icon: Users },
    { id: 'properties', label: 'Propriedades', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleNavItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
    // In a real app, you would handle routing here
    console.log(`Navigate to: ${itemId}`);
  };

  // This component itself is protected by RouteGuard
  return (
    <RouteGuard>
      <ProtectedComponent
        module="dashboard"
        action="access"
        fallback="detailed"
      >
        <MobileNavigation
          activeItem={activeNavItem}
          onItemClick={handleNavItemClick}
          items={navigationItems}
          user={user}
        >
          {/* Dashboard Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                  <div>
                    <h1 className={typographyClasses.h2}>Dashboard</h1>
                    <p className="text-gray-600">Sistema de Gestão de Limpeza B.S.O.S.</p>
                  </div>
                  
                  {/* Role indicator - Hidden on mobile as it's in navigation */}
                  <div className="hidden sm:flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Welcome Message */}
              <div className="mb-8">
                <ProtectedComponent
                  module="dashboard"
                  action="view"
                  fallback={
                    <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg p-6 text-white">
                      <h2 className="text-xl font-semibold mb-2">
                        Bem-vindo ao Sistema!
                      </h2>
                      <p className="opacity-90">
                        Você tem acesso limitado ao dashboard. Entre em contato com seu supervisor para mais informações.
                      </p>
                    </div>
                  }
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                    <h2 className="text-xl font-semibold mb-2">
                      Bem-vindo, {user?.name}!
                    </h2>
                    <p className="opacity-90">
                      Você está logado como <span className="font-medium capitalize">{user?.role}</span>.
                      {user?.role === 'owner' && ' Você tem acesso completo ao sistema.'}
                      {user?.role === 'supervisor' && ' Gerencie sua equipe e monitore as operações.'}
                      {user?.role === 'cleaner' && ' Veja suas tarefas e atualize o progresso.'}
                      {user?.role === 'client' && ' Gerencie suas propriedades e agendamentos.'}
                      {user?.role === 'client' && ' Acompanhe seus serviços e faça novos agendamentos.'}
                    </p>
                  </div>
                </ProtectedComponent>
              </div>

              {/* Quick Stats */}
              <QuickStats />

              {/* Quick Actions */}
              <QuickActions />

              {/* Role-specific content sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Recent Activities */}
                <ProtectedComponent
                  module="dashboard"
                  action="view"
                  fallback={
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
                      <div className="text-center py-8 text-gray-500">
                        <p>Acesso restrito às atividades recentes.</p>
                        <p className="text-sm mt-1">Consulte seu supervisor para mais informações.</p>
                      </div>
                    </div>
                  }
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-bsos-primary rounded-full"></div>
                        <p className="text-sm text-gray-600">Limpeza concluída - Apt 301</p>
                        <span className="text-xs text-gray-400 ml-auto">2h atrás</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm text-gray-600">Nova tarefa atribuída</p>
                        <span className="text-xs text-gray-400 ml-auto">4h atrás</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p className="text-sm text-gray-600">Agendamento alterado</p>
                        <span className="text-xs text-gray-400 ml-auto">6h atrás</span>
                      </div>
                    </div>
                  </div>
                </ProtectedComponent>

                {/* Performance Metrics */}
                <ProtectedComponent
                  module="analytics"
                  action="view"
                  fallback={
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Performance</h3>
                      <div className="text-center py-8 text-gray-500">
                        <p>Acesso restrito às métricas de performance.</p>
                        <p className="text-sm mt-1">Este recurso requer permissões especiais.</p>
                      </div>
                    </div>
                  }
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Performance</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taxa de Conclusão</span>
                        <span className="text-sm font-medium text-green-600">94%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Eficiência Operacional</span>
                        <span className="text-sm font-medium text-blue-600">87%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Crescimento Mensal</span>
                        <span className="text-sm font-medium text-purple-600">+12%</span>
                      </div>
                    </div>
                  </div>
                </ProtectedComponent>
              </div>
            </div>
          </div>
        </MobileNavigation>
      </ProtectedComponent>
    </RouteGuard>
  );
}