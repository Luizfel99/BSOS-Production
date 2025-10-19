/**
 * 👥 PERFIS INDIVIDUAIS - Bright & Shine
 * Sistema completo de gestão de funcionários com avaliações e histórico
 */

'use client';

import React, { useState, useEffect } from 'react';
import { User, Star, Trophy, Calendar, TrendingUp, Camera, Upload, Edit3, Award, Target, BarChart3, Clock, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  role: 'leader' | 'cleaner' | 'supervisor' | 'trainee';
  joinDate: string;
  status: 'active' | 'inactive' | 'vacation' | 'training';
  skills: string[];
  zones: string[];
  
  // Performance metrics
  totalCleanings: number;
  averageRating: number;
  monthlyRating: number;
  clientRatings: number;
  supervisorRatings: number;
  
  // Bonus and payments
  monthlyBonus: number;
  totalEarnings: number;
  lastPayment: string;
  pendingPayments: number;
  
  // Training
  completedTrainings: number;
  certifications: string[];
  trainingProgress: number;
  
  // Recent activity
  recentCleanings: Array<{
    id: string;
    propertyName: string;
    date: string;
    type: string;
    rating: number;
    clientFeedback?: string;
    bonus: number;
  }>;
  
  // Goals and achievements
  monthlyGoal: number;
  currentProgress: number;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    earnedDate: string;
    icon: string;
  }>;
  
  // Communication
  unreadMessages: number;
  lastActivity: string;
}

export default function PerfisIndividuais() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'payments' | 'training' | 'communication'>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'cleanings' | 'earnings'>('rating');
  const [loading, setLoading] = useState(true);
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employees/profiles');
      const data = await response.json();
      setEmployees(data.employees);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBonusColor = (rating: number) => {
    if (rating >= 4.8) return 'text-green-600 bg-green-100';
    if (rating >= 4.5) return 'text-blue-600 bg-blue-100';
    if (rating >= 4.0) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getBonusAmount = (rating: number) => {
    if (rating >= 4.8) return 200;
    if (rating >= 4.5) return 150;
    if (rating >= 4.0) return 100;
    return 0;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      vacation: 'bg-blue-100 text-blue-800',
      training: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      leader: '👑',
      cleaner: '',
      supervisor: '',
      trainee: '🎓'
    };
    return icons[role as keyof typeof icons] || '👤';
  };

  const filteredEmployees = employees
    .filter(emp => filterRole === 'all' || emp.role === filterRole)
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'cleanings':
          return b.totalCleanings - a.totalCleanings;
        case 'earnings':
          return b.totalEarnings - a.totalEarnings;
        default:
          return 0;
      }
    });

  const renderEmployeeCard = (employee: Employee) => (
    <div 
      key={employee.id}
      onClick={() => setSelectedEmployee(employee)}
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer p-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <img
            src={employee.photo || '/default-avatar.png'}
            alt={employee.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <span className="absolute -bottom-1 -right-1 text-lg">
            {getRoleIcon(employee.role)}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{employee.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
              {employee.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm capitalize">{employee.role}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium">{employee.averageRating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({employee.totalCleanings} limpezas)</span>
          </div>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{employee.monthlyRating.toFixed(1)}</div>
          <div className="text-xs text-gray-500">Nota Mensal</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">R$ {employee.monthlyBonus}</div>
          <div className="text-xs text-gray-500">Bônus</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{employee.currentProgress}%</div>
          <div className="text-xs text-gray-500">Meta</div>
        </div>
      </div>

      {/* Progresso da meta mensal */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Meta Mensal</span>
          <span>{employee.currentProgress}/{employee.monthlyGoal}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${Math.min((employee.currentProgress / employee.monthlyGoal) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Última atividade */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Última atividade: {employee.lastActivity}</span>
        {employee.unreadMessages > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {employee.unreadMessages} nova(s)
          </span>
        )}
      </div>
    </div>
  );

  const renderEmployeeDetails = () => {
    if (!selectedEmployee) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedEmployee.photo || '/default-avatar.png'}
                  alt={selectedEmployee.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white"
                />
                <div>
                  <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                  <p className="opacity-90 capitalize">{selectedEmployee.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-5 w-5 text-yellow-300 fill-current" />
                    <span className="font-semibold">{selectedEmployee.averageRating.toFixed(1)}</span>
                    <span className="opacity-75">• {selectedEmployee.totalCleanings} limpezas</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-3 rounded-full touch-target"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {[
              { id: 'overview', label: 'Visão Geral', icon: User },
              { id: 'performance', label: 'Performance', icon: BarChart3 },
              { id: 'payments', label: 'Pagamentos', icon: Trophy },
              { id: 'training', label: 'Treinamento', icon: Target },
              { id: 'communication', label: 'Comunicação', icon: MessageSquare }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-4 sm:px-6 sm:py-3 font-medium transition-colors touch-target ${
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

          {/* Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Estatísticas */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedEmployee.totalCleanings}</div>
                      <div className="text-sm text-blue-800">Total de Limpezas</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedEmployee.averageRating.toFixed(1)}</div>
                      <div className="text-sm text-green-800">Nota Média</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">R$ {selectedEmployee.totalEarnings}</div>
                      <div className="text-sm text-purple-800">Total Ganho</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{selectedEmployee.achievements.length}</div>
                      <div className="text-sm text-yellow-800">Conquistas</div>
                    </div>
                  </div>

                  {/* Limpezas Recentes */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Limpezas Recentes</h3>
                    <div className="space-y-3">
                      {selectedEmployee.recentCleanings.map(cleaning => (
                        <div key={cleaning.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{cleaning.propertyName}</h4>
                              <p className="text-sm text-gray-600">{cleaning.type} • {cleaning.date}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{cleaning.rating}</span>
                              </div>
                              {cleaning.bonus > 0 && (
                                <div className="text-sm text-green-600">+R$ {cleaning.bonus}</div>
                              )}
                            </div>
                          </div>
                          {cleaning.clientFeedback && (
                            <p className="text-sm text-gray-700 italic">"{cleaning.clientFeedback}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Informações Pessoais */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Informações</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Email:</strong> {selectedEmployee.email}</div>
                      <div><strong>Telefone:</strong> {selectedEmployee.phone}</div>
                      <div><strong>Entrada:</strong> {selectedEmployee.joinDate}</div>
                      <div><strong>Zonas:</strong> {selectedEmployee.zones.join(', ')}</div>
                    </div>
                  </div>

                  {/* Habilidades */}
                  <div>
                    <h3 className="font-semibold mb-3">Habilidades</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills.map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Conquistas */}
                  <div>
                    <h3 className="font-semibold mb-3">Conquistas Recentes</h3>
                    <div className="space-y-2">
                      {selectedEmployee.achievements.slice(0, 3).map(achievement => (
                        <div key={achievement.id} className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                          <span className="text-lg">{achievement.icon}</span>
                          <div>
                            <div className="font-medium text-sm">{achievement.title}</div>
                            <div className="text-xs text-gray-600">{achievement.earnedDate}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                {/* Performance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                    <div className="text-2xl font-bold">{selectedEmployee.monthlyRating.toFixed(1)}</div>
                    <div className="text-blue-100">Nota Mensal</div>
                    <div className={`mt-2 px-2 py-1 rounded text-xs ${calculateBonusColor(selectedEmployee.monthlyRating)}`}>
                      Bônus: R$ {getBonusAmount(selectedEmployee.monthlyRating)}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                    <div className="text-2xl font-bold">{selectedEmployee.clientRatings.toFixed(1)}</div>
                    <div className="text-green-100">Avaliação Clientes</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                    <div className="text-2xl font-bold">{selectedEmployee.supervisorRatings.toFixed(1)}</div>
                    <div className="text-purple-100">Avaliação Supervisores</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
                    <div className="text-2xl font-bold">{selectedEmployee.currentProgress}%</div>
                    <div className="text-orange-100">Meta do Mês</div>
                  </div>
                </div>

                {/* Gráfico de Performance (Placeholder) */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Evolução das Notas</h3>
                  <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                      <p>Gráfico de performance dos últimos 6 meses</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Outros tabs seriam implementados aqui */}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Individual Profiles</h1>
          <p className="text-gray-600">Gestão completa da equipe com avaliações e performance</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowNewEmployeeModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <User className="h-4 w-4 inline mr-2" />
            Novo Funcionário
          </button>
        </div>
      </div>

      {/* Filtros e Controles */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Função:</label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="all">Todas</option>
            <option value="leader">Líderes</option>
            <option value="cleaner">Faxineiros</option>
            <option value="supervisor">Supervisores</option>
            <option value="trainee">Trainee</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border rounded px-3 py-1"
          >
            <option value="rating">Nota</option>
            <option value="cleanings">Limpezas</option>
            <option value="earnings">Ganhos</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Lista
          </button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
          <div className="text-sm text-gray-600">Total de Funcionários</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {employees.filter(e => e.averageRating >= 4.5).length}
          </div>
          <div className="text-sm text-gray-600">Com Alta Performance</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            R$ {employees.reduce((acc, e) => acc + e.monthlyBonus, 0)}
          </div>
          <div className="text-sm text-gray-600">Bônus Total Mensal</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-orange-600">
            {employees.filter(e => e.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Funcionários Ativos</div>
        </div>
      </div>

      {/* Lista de Funcionários */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredEmployees.map(renderEmployeeCard)}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum funcionário encontrado</h3>
          <p className="text-gray-600">Ajuste os filtros ou adicione novos funcionários</p>
        </div>
      )}

      {/* Modal Novo Funcionário */}
      {showNewEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Novo Funcionário</h3>
              <button
                onClick={() => setShowNewEmployeeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Add employee creation logic here
              setShowNewEmployeeModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm touch-target" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full border border-gray-300 rounded px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm touch-target" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input type="tel" className="w-full border border-gray-300 rounded px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm touch-target" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm touch-target" required>
                    <option value="">Selecione...</option>
                    <option value="Faxineiro">Faxineiro</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Coordenador">Coordenador</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewEmployeeModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-4 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-50 touch-target"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-4 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 touch-target"
                >
                  Criar Funcionário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedEmployee && renderEmployeeDetails()}
    </div>
  );
}