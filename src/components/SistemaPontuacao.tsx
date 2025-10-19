/**
 * ⭐ SISTEMA DE PONTUAÇÃO AUTOMÁTICA - Bright & Shine
 * Sistema inteligente de avaliação com bonificação automática
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Award, DollarSign, Calendar, Target, BarChart3, Users, Zap, Gift, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface Rating {
  id: string;
  cleaningId: string;
  employeeId: string;
  employeeName: string;
  propertyName: string;
  date: string;
  
  // Avaliações
  clientRating: number;
  supervisorRating: number;
  finalRating: number;
  
  // Detalhes da avaliação
  clientFeedback: string;
  supervisorFeedback: string;
  criteria: {
    quality: number;
    punctuality: number;
    professionalism: number;
    communication: number;
    efficiency: number;
  };
  
  // Bônus e penalidades
  bonusApplied: number;
  bonusReason: string;
  penalties: number;
  penaltyReason: string;
  
  // Status
  status: 'pending' | 'completed' | 'disputed';
  autoCalculated: boolean;
}

interface BonusRule {
  id: string;
  name: string;
  description: string;
  ratingThreshold: number;
  bonusAmount: number;
  bonusType: 'fixed' | 'percentage';
  active: boolean;
  conditions: string[];
}

interface MonthlyPerformance {
  employeeId: string;
  employeeName: string;
  month: string;
  
  totalRatings: number;
  averageRating: number;
  clientAverage: number;
  supervisorAverage: number;
  
  totalCleanings: number;
  qualityScore: number;
  consistencyScore: number;
  
  bonusEarned: number;
  penaltiesApplied: number;
  netBonus: number;
  
  trend: 'up' | 'down' | 'stable';
  previousMonthRating: number;
  improvement: number;
}

export default function SistemaPontuacao() {
  const { success, error, warning, info } = useNotifications();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [monthlyPerformances, setMonthlyPerformances] = useState<MonthlyPerformance[]>([]);
  const [bonusRules, setBonusRules] = useState<BonusRule[]>([]);
  const [activeTab, setActiveTab] = useState<'ratings' | 'performance' | 'rules' | 'analytics'>('ratings');
  const [selectedMonth, setSelectedMonth] = useState('2024-10'); // Fixed date for SSR
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showProcessModal, setShowProcessModal] = useState(false);

  // Initialize selectedMonth with current date on client side
  useEffect(() => {
    setSelectedMonth(new Date().toISOString().slice(0, 7));
  }, []);

  useEffect(() => {
    fetchRatingsData();
    fetchBonusRules();
  }, [selectedMonth]);

  const fetchRatingsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ratings?month=${selectedMonth}`);
      const data = await response.json();
      setRatings(data.ratings);
      setMonthlyPerformances(data.monthlyPerformances);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBonusRules = async () => {
    try {
      const response = await fetch('/api/ratings/bonus-rules');
      const data = await response.json();
      setBonusRules(data.rules);
    } catch (error) {
      console.error('Erro ao buscar regras de bônus:', error);
    }
  };

  const calculateFinalRating = (clientRating: number, supervisorRating: number) => {
    // Peso: 60% cliente, 40% supervisor
    return (clientRating * 0.6 + supervisorRating * 0.4);
  };

  const getBonusAmount = (rating: number, cleaningType: string = 'standard') => {
    const activeRule = bonusRules.find(rule => 
      rule.active && rating >= rule.ratingThreshold
    );
    
    if (!activeRule) return 0;
    
    if (activeRule.bonusType === 'percentage') {
      const baseAmount = cleaningType === 'premium' ? 200 : 100;
      return (baseAmount * activeRule.bonusAmount) / 100;
    }
    
    return activeRule.bonusAmount;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.8) return 'text-green-600 bg-green-100';
    if (rating >= 4.5) return 'text-blue-600 bg-blue-100';
    if (rating >= 4.0) return 'text-yellow-600 bg-yellow-100';
    if (rating >= 3.5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const handleProcessPayments = () => {
    console.log('💰 Processando pagamentos mensais');
    alert('Processando pagamentos de bônus do mês...');
  };

  const handlePayBonus = (employeeId: string) => {
    console.log('💳 Pagando bônus para funcionário ID:', employeeId);
    alert(`Processando pagamento de bônus para funcionário ID: ${employeeId}`);
  };

  const handleCreateRule = () => {
    console.log('📋 Criando nova regra de bonificação');
    alert('Abrindo formulário para criar nova regra...');
  };

  const handleEditRule = (ruleId: string) => {
    console.log('✏️ Editando regra ID:', ruleId);
    alert(`Editando regra de bonificação ID: ${ruleId}`);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const handleApproveRating = async (ratingId: string) => {
    try {
      await fetch(`/api/ratings/${ratingId}/approve`, { method: 'POST' });
      success('Avaliação aprovada com sucesso!');
      fetchRatingsData();
    } catch (err) {
      console.error('Erro ao aprovar avaliação:', err);
      error('Erro ao aprovar avaliação');
    }
  };

  const handleDisputeRating = async (ratingId: string, reason: string) => {
    try {
      await fetch(`/api/ratings/${ratingId}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      warning('Avaliação contestada. Revisão pendente.');
      fetchRatingsData();
    } catch (err) {
      console.error('Erro ao contestar avaliação:', err);
      error('Erro ao contestar avaliação');
    }
  };

  const filteredRatings = ratings.filter(rating => 
    filterEmployee === 'all' || rating.employeeId === filterEmployee
  );

  const filteredPerformances = monthlyPerformances.filter(perf => 
    filterEmployee === 'all' || perf.employeeId === filterEmployee
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Rating System</h1>
          <p className="text-gray-600">Avaliação automática com bonificação inteligente</p>
        </div>
        
        <div className="flex gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button 
            onClick={() => setShowProcessModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Zap className="h-4 w-4 inline mr-2" />
            Processar Avaliações
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {[
          { id: 'ratings', label: 'Avaliações', icon: Star },
          { id: 'performance', label: 'Performance Mensal', icon: BarChart3 },
          { id: 'rules', label: 'Regras de Bônus', icon: Award },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
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

      {/* Estatísticas do Mês */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{filteredRatings.length}</div>
          <div className="text-blue-100">Total de Avaliações</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">
            {filteredRatings.length > 0 
              ? (filteredRatings.reduce((acc, r) => acc + r.finalRating, 0) / filteredRatings.length).toFixed(1)
              : '0.0'
            }
          </div>
          <div className="text-green-100">Média Geral</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">
            R$ {filteredRatings.reduce((acc, r) => acc + r.bonusApplied, 0)}
          </div>
          <div className="text-purple-100">Bônus Distribuído</div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">
            {filteredRatings.filter(r => r.finalRating >= 4.5).length}
          </div>
          <div className="text-yellow-100">Alta Performance</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Funcionário:</label>
          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="all">Todos</option>
            {/* Opções dinâmicas viriam da API */}
          </select>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'ratings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Avaliações Recentes</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {filteredRatings.filter(r => r.status === 'pending').length} Pendentes
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                {filteredRatings.filter(r => r.status === 'disputed').length} Contestadas
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredRatings.map(rating => (
              <div key={rating.id} className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{rating.employeeName}</h3>
                    <p className="text-gray-600">{rating.propertyName} • {rating.date}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${getRatingColor(rating.finalRating)}`}>
                      <Star className="h-4 w-4 fill-current" />
                      {rating.finalRating.toFixed(1)}
                    </div>
                    {rating.autoCalculated && (
                      <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Automático
                      </div>
                    )}
                  </div>
                </div>

                {/* Breakdown das avaliações */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{rating.clientRating.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">Cliente</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{rating.supervisorRating.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">Supervisor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{rating.criteria.quality}</div>
                    <div className="text-xs text-gray-500">Qualidade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{rating.criteria.punctuality}</div>
                    <div className="text-xs text-gray-500">Pontualidade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{rating.criteria.professionalism}</div>
                    <div className="text-xs text-gray-500">Profissionalismo</div>
                  </div>
                </div>

                {/* Feedback */}
                {(rating.clientFeedback || rating.supervisorFeedback) && (
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {rating.clientFeedback && (
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="font-medium text-blue-800 mb-1">Cliente:</div>
                        <p className="text-sm text-blue-700">"{rating.clientFeedback}"</p>
                      </div>
                    )}
                    {rating.supervisorFeedback && (
                      <div className="bg-purple-50 p-3 rounded">
                        <div className="font-medium text-purple-800 mb-1">Supervisor:</div>
                        <p className="text-sm text-purple-700">"{rating.supervisorFeedback}"</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Bônus e Status */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {rating.bonusApplied > 0 && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Gift className="h-4 w-4" />
                        <span className="font-medium">+R$ {rating.bonusApplied}</span>
                        <span className="text-sm">({rating.bonusReason})</span>
                      </div>
                    )}
                    
                    {rating.penalties > 0 && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">-R$ {rating.penalties}</span>
                        <span className="text-sm">({rating.penaltyReason})</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {rating.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApproveRating(rating.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4 inline mr-1" />
                          Aprovar
                        </button>
                        <button 
                          onClick={() => handleDisputeRating(rating.id, 'Revisão solicitada')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Contestar
                        </button>
                      </>
                    )}
                    
                    {rating.status === 'completed' && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Aprovado
                      </span>
                    )}
                    
                    {rating.status === 'disputed' && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        Em Disputa
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Performance Mensal - {selectedMonth}</h2>
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={handleProcessPayments}
            >
              <DollarSign className="h-4 w-4 inline mr-2" />
              Processar Pagamentos
            </button>
          </div>

          <div className="grid gap-4">
            {filteredPerformances.map(performance => (
              <div key={performance.employeeId} className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{performance.employeeName}</h3>
                    <p className="text-gray-600">{performance.totalCleanings} limpezas realizadas</p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${getRatingColor(performance.averageRating)}`}>
                      <Star className="h-4 w-4 fill-current" />
                      {performance.averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {getTrendIcon(performance.trend)}
                      <span className="text-sm text-gray-600">
                        {performance.improvement > 0 ? '+' : ''}{performance.improvement.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Métricas detalhadas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{performance.clientAverage.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">Clientes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{performance.supervisorAverage.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">Supervisores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{performance.qualityScore}%</div>
                    <div className="text-xs text-gray-500">Qualidade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{performance.consistencyScore}%</div>
                    <div className="text-xs text-gray-500">Consistência</div>
                  </div>
                </div>

                {/* Bônus e Pagamentos */}
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded">
                  <div className="flex gap-6">
                    <div>
                      <div className="text-sm text-gray-600">Bônus Earned:</div>
                      <div className="font-bold text-green-600">R$ {performance.bonusEarned}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Penalidades:</div>
                      <div className="font-bold text-red-600">R$ {performance.penaltiesApplied}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Bônus Líquido:</div>
                      <div className="font-bold text-blue-600">R$ {performance.netBonus}</div>
                    </div>
                  </div>
                  
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => handlePayBonus(performance.employeeId)}
                  >
                    Pagar Bônus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Regras de Bonificação</h2>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleCreateRule}
            >
              <Award className="h-4 w-4 inline mr-2" />
              Nova Regra
            </button>
          </div>

          <div className="grid gap-4">
            {bonusRules.map(rule => (
              <div key={rule.id} className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{rule.name}</h3>
                    <p className="text-gray-600">{rule.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.active ? 'Ativa' : 'Inativa'}
                    </span>
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditRule(rule.id)}
                    >
                      Editar
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Nota Mínima:</div>
                    <div className="font-bold text-blue-600">{rule.ratingThreshold.toFixed(1)}/5</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Bônus:</div>
                    <div className="font-bold text-green-600">
                      {rule.bonusType === 'percentage' ? `${rule.bonusAmount}%` : `R$ ${rule.bonusAmount}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Condições:</div>
                    <div className="text-sm">{rule.conditions.join(', ')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredRatings.length === 0 && activeTab === 'ratings' && (
        <div className="text-center py-12">
          <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma avaliação encontrada</h3>
          <p className="text-gray-600">Selecione um período diferente ou aguarde novas avaliações</p>
        </div>
      )}

      {/* Modal Processar Avaliações */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Processar Avaliações Automáticas</h3>
              <button
                onClick={() => setShowProcessModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                Isso processará todas as avaliações pendentes e calculará automaticamente as bonificações para o mês selecionado.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  Avaliações pendentes para processamento: <strong>12</strong>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowProcessModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Add processing logic here
                  setShowProcessModal(false);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Processar Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}