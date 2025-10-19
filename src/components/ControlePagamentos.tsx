/**
 * 💸 CONTROLE DE PAGAMENTOS E BÔNUS - Bright & Shine
 * Sistema automático de gestão financeira para funcionários
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Gift, TrendingUp, Calendar, Download, Filter, Search, Plus, Edit3, Check, X, AlertCircle, Clock, Star, Award, Calculator } from 'lucide-react';

interface Payment {
  id: string;
  employeeId: string;
  employeeName: string;
  employeePhoto?: string;
  propertyName: string;
  cleaningDate: string;
  cleaningType: string;
  period: string;
  baseAmount: number;
  baseSalary: number;
  cleaningBonus: number;
  performanceBonus: number;
  qualityBonus: number;
  punctualityBonus: number;
  clientTip: number;
  extraServices: number;
  tips: number;
  deductions: number;
  penalties: number;
  advances: number;
  totalAmount: number;
  netAmount: number;
  status: 'pending' | 'approved' | 'paid' | 'disputed';
  paymentDate: string | null;
  paidAt?: string;
  createdAt: string;
  paymentMethod: 'bank_transfer' | 'pix' | 'cash' | 'check';
  notes?: string;
  details: {
    cleaningsCompleted: number;
    averageRating: number;
    punctualityBonus: number;
    overtimeHours: number;
    overtimePay: number;
  };
}

interface BonusRule {
  id: string;
  name: string;
  type: 'performance' | 'quality' | 'punctuality' | 'client_satisfaction' | 'special';
  
  trigger: {
    metric: string;
    operator: '>=' | '>' | '<=' | '<' | '=';
    value: number;
  };
  
  bonus: {
    type: 'fixed' | 'percentage' | 'per_rating_point';
    amount: number;
    maxAmount?: number;
  };
  
  conditions: string[];
  active: boolean;
  
  // Estatísticas
  timesApplied: number;
  totalAmountGiven: number;
}

interface EmployeeFinancial {
  employeeId: string;
  employeeName: string;
  employeePhoto: string;
  
  // Período atual
  currentMonth: string;
  totalEarnings: number;
  totalBonuses: number;
  totalDeductions: number;
  netEarnings: number;
  
  // Estatísticas
  cleaningsCompleted: number;
  averageRating: number;
  averageEarningPerCleaning: number;
  
  // Histórico
  monthlyHistory: Array<{
    month: string;
    earnings: number;
    bonuses: number;
    deductions: number;
    net: number;
    cleanings: number;
    averageRating: number;
  }>;
  
  // Pagamentos pendentes
  pendingPayments: number;
  nextPaymentDate: string;
  
  // Metas e incentivos
  monthlyGoal: number;
  goalProgress: number;
  incentiveEligible: boolean;
}

export default function ControlePagamentos() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bonusRules, setBonusRules] = useState<BonusRule[]>([]);
  const [employeeFinancials, setEmployeeFinancials] = useState<EmployeeFinancial[]>([]);
  
  const [activeTab, setActiveTab] = useState<'payments' | 'bonuses' | 'employees' | 'rules' | 'reports'>('payments');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-10'); // Fixed date for SSR
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showBonusCalculator, setShowBonusCalculator] = useState(false);

  // Initialize selectedPeriod with current date on client side
  useEffect(() => {
    setSelectedPeriod(new Date().toISOString().slice(0, 7));
  }, []);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentsData();
    fetchBonusRules();
    fetchEmployeeFinancials();
  }, [selectedPeriod]);

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/payments?period=${selectedPeriod}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBonusRules = async () => {
    try {
      const response = await fetch('/api/payments/bonus-rules');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();
      setBonusRules(data.bonusRules || []);
    } catch (error) {
      console.error('Erro ao buscar regras de bônus:', error);
      setBonusRules([]);
    }
  };

  const fetchEmployeeFinancials = async () => {
    try {
      const response = await fetch(`/api/payments/employees?period=${selectedPeriod}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();
      setEmployeeFinancials(data.employees || []);
    } catch (error) {
      console.error('Erro ao buscar dados financeiros dos funcionários:', error);
      setEmployeeFinancials([]);
    }
  };

  const calculateAutomaticBonus = (payment: Payment) => {
    let totalBonus = 0;
    const appliedBonuses: string[] = [];

    bonusRules.forEach(rule => {
      if (!rule.active) return;
      
      let qualifies = false;
      let bonusAmount = 0;

      // Check qualification based on rule trigger
      switch (rule.trigger.metric) {
        case 'rating':
          qualifies = (payment.details?.averageRating ?? 0) >= rule.trigger.value;
          break;
        case 'cleanings':
          qualifies = (payment.details?.cleaningsCompleted ?? 0) >= rule.trigger.value;
          break;
        default:
          qualifies = false;
      }

      if (qualifies) {
        if (rule.bonus.type === 'fixed') {
          bonusAmount = rule.bonus.amount;
        } else if (rule.bonus.type === 'percentage') {
          bonusAmount = (payment.baseAmount * rule.bonus.amount) / 100;
        } else if (rule.bonus.type === 'per_rating_point') {
          bonusAmount = (payment.details?.averageRating ?? 0) * rule.bonus.amount;
        }

        if (rule.bonus.maxAmount && bonusAmount > rule.bonus.maxAmount) {
          bonusAmount = rule.bonus.maxAmount;
        }

        totalBonus += bonusAmount;
        appliedBonuses.push(rule.name);
      }
    });

    return { totalBonus, appliedBonuses };
  };

  const approvePayment = async (paymentId: string) => {
    try {
      await fetch(`/api/payments/${paymentId}/approve`, {
        method: 'POST'
      });
      fetchPaymentsData();
    } catch (error) {
      console.error('Erro ao aprovar pagamento:', error);
    }
  };

  const processPayment = async (paymentId: string, method: string) => {
    try {
      await fetch(`/api/payments/${paymentId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: method })
      });
      fetchPaymentsData();
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
    }
  };

  const handleExportPayments = async () => {
    try {
      const response = await fetch(`/api/payments/export?period=${selectedPeriod}&status=${filterStatus}&employee=${filterEmployee}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pagamentos-${selectedPeriod}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('Relatório exportado com sucesso!');
      } else {
        throw new Error('Erro ao exportar dados');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao exportar dados. Tente novamente.');
    }
  };

  const handleEditPayment = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      setSelectedPayment(payment);
      setShowPaymentModal(true);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      disputed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      approved: <Check className="h-4 w-4" />,
      paid: <CreditCard className="h-4 w-4" />,
      disputed: <AlertCircle className="h-4 w-4" />
    };
    return icons[status as keyof typeof icons];
  };

  const filteredPayments = payments.filter(payment => {
    if (filterStatus !== 'all' && payment.status !== filterStatus) return false;
    if (filterEmployee !== 'all' && payment.employeeId !== filterEmployee) return false;
    if (searchQuery && !payment.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !payment.propertyName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalPendingAmount = payments
    .filter(p => p.status === 'pending' || p.status === 'approved')
    .reduce((acc, p) => acc + p.netAmount, 0);

  const totalPaidAmount = payments
    .filter(p => p.status === 'paid')
    .reduce((acc, p) => acc + p.netAmount, 0);

  const totalBonusesGiven = payments
    .reduce((acc, p) => acc + p.performanceBonus + p.qualityBonus + p.punctualityBonus, 0);

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
          <h1 className="text-3xl font-bold text-gray-900">💸 Controle de Pagamentos</h1>
          <p className="text-gray-600">Gestão automática de pagamentos e bonificações</p>
        </div>
        
        <div className="flex gap-3">
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={() => setShowBonusCalculator(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Calculator className="h-4 w-4 inline mr-2" />
            Calculadora
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Novo Pagamento
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {[
          { id: 'payments', label: 'Pagamentos', icon: DollarSign },
          { id: 'bonuses', label: 'Bônus', icon: Gift },
          { id: 'employees', label: 'Funcionários', icon: CreditCard },
          { id: 'rules', label: 'Regras', icon: Award },
          { id: 'reports', label: 'Relatórios', icon: TrendingUp }
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

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">R$ {totalPendingAmount.toLocaleString()}</div>
          <div className="text-blue-100">Pagamentos Pendentes</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">R$ {totalPaidAmount.toLocaleString()}</div>
          <div className="text-green-100">Total Pago no Mês</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">R$ {totalBonusesGiven.toLocaleString()}</div>
          <div className="text-purple-100">Bônus Distribuídos</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold">{filteredPayments.length}</div>
          <div className="text-orange-100">Total de Registros</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar funcionário ou propriedade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="approved">Aprovado</option>
            <option value="paid">Pago</option>
            <option value="disputed">Em Disputa</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="all">Todos os Funcionários</option>
            {/* Opções dinâmicas */}
          </select>
        </div>

        <button 
          onClick={handleExportPayments}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          <Download className="h-4 w-4 inline mr-2" />
          Exportar
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {filteredPayments.map(payment => (
            <div key={payment.id} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={payment.employeePhoto || '/default-avatar.png'}
                    alt={payment.employeeName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{payment.employeeName}</h3>
                    <p className="text-gray-600">{payment.propertyName} • {payment.cleaningDate}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {payment.cleaningType}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{payment.details?.averageRating?.toFixed(1) ?? 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    {payment.status}
                  </div>
                  <div className="text-2xl font-bold text-green-600 mt-2">
                    R$ {payment.totalAmount?.toFixed(2) ?? '0.00'}
                  </div>
                </div>
              </div>

              {/* Breakdown dos valores */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">R$ {payment.baseAmount}</div>
                  <div className="text-xs text-gray-500">Base</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    +R$ {(payment.performanceBonus + payment.qualityBonus + payment.punctualityBonus).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Bônus</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">+R$ {payment.clientTip}</div>
                  <div className="text-xs text-gray-500">Gorjeta</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">+R$ {payment.extraServices}</div>
                  <div className="text-xs text-gray-500">Extras</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    -R$ {(payment.penalties + payment.deductions + payment.advances).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Descontos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">R$ {payment.netAmount}</div>
                  <div className="text-xs text-gray-500">Líquido</div>
                </div>
              </div>

              {/* Detalhes dos bônus */}
              {(payment.performanceBonus > 0 || payment.qualityBonus > 0 || payment.punctualityBonus > 0) && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Bônus Aplicados:</h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {payment.performanceBonus > 0 && (
                      <div>
                        <span className="text-green-600">Performance:</span>
                        <span className="font-medium ml-1">R$ {payment.performanceBonus}</span>
                      </div>
                    )}
                    {payment.qualityBonus > 0 && (
                      <div>
                        <span className="text-green-600">Qualidade:</span>
                        <span className="font-medium ml-1">R$ {payment.qualityBonus}</span>
                      </div>
                    )}
                    {payment.punctualityBonus > 0 && (
                      <div>
                        <span className="text-green-600">Pontualidade:</span>
                        <span className="font-medium ml-1">R$ {payment.punctualityBonus}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notas */}
              {payment.notes && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">Observações:</h4>
                  <p className="text-sm text-blue-700">{payment.notes}</p>
                </div>
              )}

              {/* Ações */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {payment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => approvePayment(payment.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        <Check className="h-4 w-4 inline mr-2" />
                        Aprovar
                      </button>
                      <button 
                        onClick={() => handleEditPayment(payment.id)}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                      >
                        <Edit3 className="h-4 w-4 inline mr-2" />
                        Editar
                      </button>
                    </>
                  )}
                  
                  {payment.status === 'approved' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => processPayment(payment.id, 'pix')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Pagar via PIX
                      </button>
                      <button
                        onClick={() => processPayment(payment.id, 'bank_transfer')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Transferência
                      </button>
                      <button
                        onClick={() => processPayment(payment.id, 'cash')}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                      >
                        Dinheiro
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  Criado em: {payment.createdAt}
                  {payment.paidAt && ` • Pago em: ${payment.paidAt}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="grid gap-6">
          {employeeFinancials.map(employee => (
            <div key={employee.employeeId} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={employee.employeePhoto || '/default-avatar.png'}
                    alt={employee.employeeName}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-xl">{employee.employeeName}</h3>
                    <p className="text-gray-600">{employee.cleaningsCompleted} limpezas no mês</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{employee.averageRating?.toFixed(1) ?? 'N/A'} média</span>
                      <span className="text-gray-400">•</span>
                      <span>R$ {employee.averageEarningPerCleaning?.toFixed(2) ?? '0.00'} por limpeza</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    R$ {employee.netEarnings.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">Total Líquido</div>
                  {employee.pendingPayments > 0 && (
                    <div className="text-sm text-orange-600 mt-1">
                      R$ {employee.pendingPayments} pendente
                    </div>
                  )}
                </div>
              </div>

              {/* Breakdown financeiro */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">R$ {employee.totalEarnings}</div>
                  <div className="text-sm text-gray-500">Total Bruto</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">+R$ {employee.totalBonuses}</div>
                  <div className="text-sm text-gray-500">Bônus</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">-R$ {employee.totalDeductions}</div>
                  <div className="text-sm text-gray-500">Descontos</div>
                </div>
              </div>

              {/* Meta do mês */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Meta do Mês (R$ {employee.monthlyGoal})</span>
                  <span>{employee.goalProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      employee.goalProgress >= 100 ? 'bg-green-500' : 
                      employee.goalProgress >= 80 ? 'bg-blue-500' : 
                      'bg-orange-500'
                    }`}
                    style={{ width: `${Math.min(employee.goalProgress, 100)}%` }}
                  ></div>
                </div>
                {employee.incentiveEligible && (
                  <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    Elegível para incentivo adicional
                  </div>
                )}
              </div>

              {/* Histórico resumido */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Últimos 3 Meses</h4>
                <div className="grid grid-cols-3 gap-3">
                  {employee.monthlyHistory.slice(-3).map(month => (
                    <div key={month.month} className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-medium">{month.month}</div>
                      <div className="text-lg font-bold text-green-600">R$ {month.net}</div>
                      <div className="text-xs text-gray-500">
                        {month.cleanings} limpezas • Rating: {month.averageRating?.toFixed(1) ?? 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPayments.length === 0 && activeTab === 'payments' && (
        <div className="text-center py-12">
          <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pagamento encontrado</h3>
          <p className="text-gray-600">Ajuste os filtros ou selecione um período diferente</p>
        </div>
      )}
    </div>
  );
}