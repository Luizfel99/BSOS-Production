'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

// Interfaces para o sistema financeiro
interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  propertyId: string;
  propertyName: string;
  serviceDate: string;
  dueDate: string;
  issueDate: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: 'stripe' | 'paypal' | 'bank_transfer' | 'quickbooks';
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  notes?: string;
  pdfUrl?: string;
}

interface Payment {
  id: string;
  type: 'client_payment' | 'employee_salary' | 'commission' | 'bonus' | 'expense';
  recipientId: string;
  recipientName: string;
  amount: number;
  date: string;
  dueDate?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  method: 'stripe' | 'paypal' | 'bank_transfer' | 'quickbooks' | 'cash';
  description: string;
  category: string;
  invoiceId?: string;
  reference?: string;
}

interface PropertyFinancials {
  propertyId: string;
  propertyName: string;
  monthlyRevenue: number;
  totalCosts: number;
  laborCosts: number;
  supplyCosts: number;
  marginPercent: number;
  profitAmount: number;
  servicesCount: number;
  averageServiceValue: number;
  lastServiceDate: string;
}

interface CommissionRule {
  id: string;
  employeeId: string;
  employeeName: string;
  role: 'cleaner' | 'supervisor' | 'manager';
  baseCommission: number;
  performanceBonus: number;
  qualityBonus: number;
  punctualityBonus: number;
  totalEarned: number;
  period: string;
  services: number;
  rating: number;
}

interface BankIntegration {
  id: string;
  provider: 'stripe' | 'paypal' | 'quickbooks';
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  accountId: string;
  balance: number;
  lastSync: string;
  monthlyVolume: number;
  fees: number;
}

// Mock data para demonstração
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001',
    clientId: 'client1',
    clientName: 'João Silva',
    propertyId: 'prop1',
    propertyName: 'Apt Copacabana Premium',
    serviceDate: '2025-01-08T10:00:00',
    dueDate: '2025-01-15T23:59:59',
    issueDate: '2025-01-08T18:00:00',
    amount: 180,
    tax: 18,
    total: 198,
    status: 'paid',
    paymentMethod: 'stripe',
    items: [
      { description: 'Limpeza Normal - 2h30min', quantity: 1, unitPrice: 150, total: 150 },
      { description: 'Produtos Especiais', quantity: 1, unitPrice: 30, total: 30 }
    ],
    notes: 'Serviço executado com excelência',
    pdfUrl: '/invoices/INV-2025-001.pdf'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-002',
    clientId: 'client2',
    clientName: 'Maria Costa',
    propertyId: 'prop2',
    propertyName: 'Casa Barra da Tijuca',
    serviceDate: '2025-01-10T09:00:00',
    dueDate: '2025-01-17T23:59:59',
    issueDate: '2025-01-10T16:00:00',
    amount: 350,
    tax: 35,
    total: 385,
    status: 'sent',
    items: [
      { description: 'Limpeza Profunda - 4h', quantity: 1, unitPrice: 300, total: 300 },
      { description: 'Taxa de Deslocamento', quantity: 1, unitPrice: 50, total: 50 }
    ]
  }
];

const mockPayments: Payment[] = [
  {
    id: '1',
    type: 'client_payment',
    recipientId: 'client1',
    recipientName: 'João Silva',
    amount: 198,
    date: '2025-01-09T14:30:00',
    status: 'completed',
    method: 'stripe',
    description: 'Pagamento INV-2025-001',
    category: 'Revenue',
    invoiceId: '1',
    reference: 'pi_1234567890'
  },
  {
    id: '2',
    type: 'employee_salary',
    recipientId: 'emp1',
    recipientName: 'Maria Silva',
    amount: 2500,
    date: '2025-01-05T10:00:00',
    dueDate: '2025-01-05T23:59:59',
    status: 'completed',
    method: 'bank_transfer',
    description: 'Salário Janeiro 2025',
    category: 'Salary'
  },
  {
    id: '3',
    type: 'commission',
    recipientId: 'emp2',
    recipientName: 'João Santos',
    amount: 450,
    date: '2025-01-10T16:00:00',
    status: 'pending',
    method: 'bank_transfer',
    description: 'Comissão por performance',
    category: 'Commission'
  }
];

const mockPropertyFinancials: PropertyFinancials[] = [
  {
    propertyId: 'prop1',
    propertyName: 'Apt Copacabana Premium',
    monthlyRevenue: 720,
    totalCosts: 480,
    laborCosts: 360,
    supplyCosts: 120,
    marginPercent: 33.3,
    profitAmount: 240,
    servicesCount: 4,
    averageServiceValue: 180,
    lastServiceDate: '2025-01-08T10:00:00'
  },
  {
    propertyId: 'prop2',
    propertyName: 'Casa Barra da Tijuca',
    monthlyRevenue: 1400,
    totalCosts: 900,
    laborCosts: 700,
    supplyCosts: 200,
    marginPercent: 35.7,
    profitAmount: 500,
    servicesCount: 4,
    averageServiceValue: 350,
    lastServiceDate: '2025-01-05T09:00:00'
  }
];

const mockCommissions: CommissionRule[] = [
  {
    id: '1',
    employeeId: 'emp1',
    employeeName: 'Maria Silva',
    role: 'cleaner',
    baseCommission: 300,
    performanceBonus: 150,
    qualityBonus: 100,
    punctualityBonus: 50,
    totalEarned: 600,
    period: 'Janeiro 2025',
    services: 12,
    rating: 4.8
  },
  {
    id: '2',
    employeeId: 'emp2',
    employeeName: 'João Santos',
    role: 'supervisor',
    baseCommission: 800,
    performanceBonus: 200,
    qualityBonus: 150,
    punctualityBonus: 100,
    totalEarned: 1250,
    period: 'Janeiro 2025',
    services: 20,
    rating: 4.9
  }
];

const mockBankIntegrations: BankIntegration[] = [
  {
    id: '1',
    provider: 'stripe',
    status: 'connected',
    accountId: 'acct_1234567890',
    balance: 15420.50,
    lastSync: '2025-01-10T18:00:00',
    monthlyVolume: 8950.00,
    fees: 267.85
  },
  {
    id: '2',
    provider: 'paypal',
    status: 'connected',
    accountId: 'paypal_business_account',
    balance: 3240.80,
    lastSync: '2025-01-10T17:45:00',
    monthlyVolume: 2100.00,
    fees: 84.00
  },
  {
    id: '3',
    provider: 'quickbooks',
    status: 'pending',
    accountId: 'qb_pending_setup',
    balance: 0,
    lastSync: '',
    monthlyVolume: 0,
    fees: 0
  }
];

export default function BSOSFinance() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const handleCreateInvoice = () => {
    console.log('📄 Criando nova invoice');
    alert('Abrindo formulário para criar nova invoice...');
  };

  const handleViewInvoice = (invoiceId: string) => {
    console.log('👀 Visualizando invoice ID:', invoiceId);
    alert(`Abrindo invoice ID: ${invoiceId}`);
  };

  const handleSendInvoice = (invoiceId: string) => {
    console.log('📧 Enviando invoice ID:', invoiceId);
    alert(`Enviando invoice ID: ${invoiceId} por email...`);
  };

  const handleMarkPaid = (invoiceId: string) => {
    console.log('✅ Marcando invoice como paga ID:', invoiceId);
    alert(`Marcando invoice ID: ${invoiceId} como paga...`);
  };

  const handleProcessPayment = (paymentId: string) => {
    console.log('💳 Processando pagamento ID:', paymentId);
    alert(`Processando pagamento ID: ${paymentId}...`);
  };

  const handleCancelPayment = (paymentId: string) => {
    console.log('❌ Cancelando pagamento ID:', paymentId);
    alert(`Cancelando pagamento ID: ${paymentId}...`);
  };

  const handleCreateReport = () => {
    console.log('📊 Criando relatório financeiro');
    alert('Gerando relatório financeiro completo...');
  };

  const handleExportData = () => {
    console.log('📤 Exportando dados financeiros');
    alert('Exportando dados financeiros para Excel...');
  };

  // New handlers for wired buttons
  const handleViewInvoicePDF = (invoiceId: string) => {
    console.log('📄 Abrindo PDF da invoice ID:', invoiceId);
    window.open(`/api/finance/invoices/${invoiceId}/pdf`, '_blank');
  };

  const handleResendInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/finance/invoices/${invoiceId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        alert('Invoice reenviada com sucesso!');
      } else {
        throw new Error('Erro ao reenviar invoice');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao reenviar invoice. Tente novamente.');
    }
  };

  const handleGeneratePaymentLink = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/finance/invoices/${invoiceId}/payment-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (response.ok && data.paymentUrl) {
        navigator.clipboard.writeText(data.paymentUrl);
        alert('Link de pagamento copiado para a área de transferência!');
      } else {
        throw new Error('Erro ao gerar link de pagamento');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar link de pagamento. Tente novamente.');
    }
  };

  const handleCreatePayment = () => {
    console.log('💳 Criando novo pagamento');
    alert('Abrindo formulário para criar novo pagamento...');
  };

  const handlePayNow = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        alert('Pagamento processado com sucesso!');
      } else {
        throw new Error('Erro ao processar pagamento');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    }
  };

  const handleSchedulePayment = (paymentId: string) => {
    console.log('📅 Agendando pagamento ID:', paymentId);
    alert('Abrindo calendário para agendar pagamento...');
  };

  // Dashboard Financeiro Principal
  const FinancialDashboard = () => (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
              <p className="text-2xl font-semibold text-gray-900">R$ 12.450</p>
              <p className="text-sm text-green-600">+15% vs mês anterior</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Margem de Lucro</p>
              <p className="text-2xl font-semibold text-gray-900">34.5%</p>
              <p className="text-sm text-blue-600">R$ 4.295 lucro</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Invoices Pendentes</p>
              <p className="text-2xl font-semibold text-gray-900">R$ 2.340</p>
              <p className="text-sm text-yellow-600">6 faturas em aberto</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                💳
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Saldo Disponível</p>
              <p className="text-2xl font-semibold text-gray-900">R$ 18.661</p>
              <p className="text-sm text-purple-600">Stripe + PayPal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Receita e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Revenue vs Costs (12 months)</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((month, index) => {
                // Dados fixos para evitar problemas de hidratação
                const revenues = [8500, 9200, 10100, 10800, 11500, 12200];
                const revenue = revenues[index] || 8500;
                const costs = revenue * 0.65;
                return (
                  <div key={month} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">{month}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full"
                            style={{ width: `${(revenue / 15000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          R$ {revenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-400 h-2 rounded-full"
                            style={{ width: `${(costs / 15000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          R$ {costs.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">🔔 Alertas Financeiros</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900">Pagamento em Atraso</h4>
                    <p className="text-red-700 text-sm">INV-2025-002 - R$ 385 venceu há 2 dias</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    ⚠️
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-900">Pagamento Pendente</h4>
                    <p className="text-yellow-700 text-sm">Comissão João Santos - R$ 450</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">Oportunidade</h4>
                    <p className="text-blue-700 text-sm">Meta mensal 85% atingida - faltam R$ 1.825</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900">Pagamento Recebido</h4>
                    <p className="text-green-700 text-sm">R$ 198 via Stripe - João Silva</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Propriedades por Rentabilidade */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Properties by Profitability</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockPropertyFinancials.map((property, index) => (
              <div key={property.propertyId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{property.propertyName}</h4>
                    <p className="text-sm text-gray-600">{property.servicesCount} serviços este mês</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        R$ {property.monthlyRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </div>
                      <div className="text-xs text-gray-500">Receita</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{property.marginPercent}%</div>
                      <div className="text-xs text-gray-500">Margem</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        R$ {property.profitAmount.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">Lucro</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Gestão de Invoices
  const InvoiceManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Invoice Management</h3>
          <p className="text-sm text-gray-600">Criação e controle automático de faturas</p>
        </div>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          onClick={handleCreateInvoice}
        >
          + Nova Invoice
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Invoices Recentes</h4>
            <div className="flex space-x-2">
              <select className="text-sm border border-gray-300 rounded px-3 py-1">
                <option>Todos os Status</option>
                <option>Rascunho</option>
                <option>Enviado</option>
                <option>Pago</option>
                <option>Vencido</option>
              </select>
              <select className="text-sm border border-gray-300 rounded px-3 py-1">
                <option>Este Mês</option>
                <option>Último Mês</option>
                <option>Últimos 3 Meses</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockInvoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Paid' :
                         invoice.status === 'sent' ? 'Sent' :
                         invoice.status === 'overdue' ? 'Overdue' :
                         invoice.status === 'draft' ? 'Draft' : 'Cancelled'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{invoice.clientName} - {invoice.propertyName}</p>
                    <p className="text-gray-500 text-xs">
                      Serviço: {new Date(invoice.serviceDate).toLocaleDateString('pt-BR')} | 
                      Vencimento: {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      R$ {invoice.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </div>
                    <div className="text-sm text-gray-500">
                      Base: R$ {invoice.amount} + Taxa: R$ {invoice.tax}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h5 className="font-medium text-gray-900 mb-2">Itens da Fatura:</h5>
                  <div className="space-y-1">
                    {invoice.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.description} ({item.quantity}x)
                        </span>
                        <span className="font-medium">R$ {item.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewInvoicePDF(invoice.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      📄 Ver PDF
                    </button>
                    <button 
                      onClick={() => handleResendInvoice(invoice.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      📧 Reenviar
                    </button>
                    {invoice.status === 'sent' && (
                      <button 
                        onClick={() => handleGeneratePaymentLink(invoice.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                      >
                        💳 Link Pagamento
                      </button>
                    )}
                  </div>
                  {invoice.paymentMethod && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <span>💳</span>
                      <span className="capitalize">{invoice.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Controle de Pagamentos
  const PaymentControl = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">💳 Controle de Pagamentos</h3>
          <p className="text-sm text-gray-600">Gestão de pagamentos para clientes e equipe</p>
        </div>
        <button 
          onClick={handleCreatePayment}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Novo Pagamento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pagamentos Recebidos */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Payments Received</h4>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockPayments.filter(p => p.type === 'client_payment').map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{payment.recipientName}</h5>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        R$ {payment.amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {payment.status === 'completed' ? 'Received' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(payment.date).toLocaleDateString('pt-BR')}</span>
                    <span className="capitalize">{payment.method}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagamentos a Fazer */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">💸 Pagamentos a Fazer</h4>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockPayments.filter(p => p.type !== 'client_payment').map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{payment.recipientName}</h5>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        R$ {payment.amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {payment.status === 'completed' ? 'Paid' :
                         payment.status === 'pending' ? 'Pending' : 'Processing'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {payment.type === 'employee_salary' ? '💼 Salário' :
                       payment.type === 'commission' ? '🎯 Comissão' :
                       payment.type === 'bonus' ? 'Bonus' : 'Expense'}
                    </span>
                    <span>{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('pt-BR') : 'Sem prazo'}</span>
                  </div>
                  {payment.status === 'pending' && (
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => handlePayNow(payment.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Pagar Agora
                      </button>
                      <button 
                        onClick={() => handleSchedulePayment(payment.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Agendar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Rentabilidade por Propriedade
  const PropertyProfitability = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Property Profitability</h3>
        <p className="text-sm text-gray-600">Análise detalhada de custos, margem e lucro</p>
      </div>

      <div className="space-y-6">
        {mockPropertyFinancials.map((property) => (
          <div key={property.propertyId} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{property.propertyName}</h4>
                  <p className="text-sm text-gray-600">
                    {property.servicesCount} serviços • Último: {new Date(property.lastServiceDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    R$ {property.profitAmount.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-500">Lucro Mensal</div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    R$ {property.monthlyRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </div>
                  <div className="text-sm text-gray-600">Receita Mensal</div>
                  <div className="text-xs text-green-600 mt-1">
                    Média: R$ {property.averageServiceValue}/serviço
                  </div>
                </div>

                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    R$ {property.totalCosts.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </div>
                  <div className="text-sm text-gray-600">Custos Totais</div>
                  <div className="text-xs text-red-600 mt-1">
                    {((property.totalCosts / property.monthlyRevenue) * 100).toFixed(1)}% da receita
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{property.marginPercent}%</div>
                  <div className="text-sm text-gray-600">Margem Bruta</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Acima da média (30%)
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    R$ {property.profitAmount.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Lucro Líquido</div>
                  <div className="text-xs text-purple-600 mt-1">
                    R$ {(property.profitAmount / property.servicesCount).toFixed(0)}/serviço
                  </div>
                </div>
              </div>

              {/* Breakdown de Custos */}
              <div className="border-t pt-6">
                <h5 className="font-medium text-gray-900 mb-4">Cost Breakdown</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-3">Distribuição de Custos</h6>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="text-sm">Mão de Obra</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">R$ {property.laborCosts}</div>
                          <div className="text-xs text-gray-500">
                            {((property.laborCosts / property.totalCosts) * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                          <span className="text-sm">Materiais/Produtos</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">R$ {property.supplyCosts}</div>
                          <div className="text-xs text-gray-500">
                            {((property.supplyCosts / property.totalCosts) * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-3">Indicadores de Performance</h6>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">ROI Mensal</span>
                        <span className="font-medium text-green-600">
                          {((property.profitAmount / property.totalCosts) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Eficiência Operacional</span>
                        <span className="font-medium text-blue-600">
                          {(100 - ((property.totalCosts / property.monthlyRevenue) * 100)).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Valor por Hora</span>
                        <span className="font-medium text-purple-600">
                          R$ {(property.averageServiceValue / 2.5).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Integração Bancária
  const BankingIntegration = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">🏦 Integração Bancária</h3>
        <p className="text-sm text-gray-600">Conexões com Stripe, PayPal e QuickBooks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockBankIntegrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    integration.provider === 'stripe' ? 'bg-purple-100' :
                    integration.provider === 'paypal' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {integration.provider === 'stripe' ? 'ST' :
                     integration.provider === 'paypal' ? 'PP' : 'INV'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{integration.provider}</h4>
                    <p className="text-sm text-gray-600">{integration.accountId}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  integration.status === 'connected' ? 'bg-green-100 text-green-800' :
                  integration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  integration.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {integration.status === 'connected' ? 'Connected' :
                   integration.status === 'pending' ? 'Pending' :
                   integration.status === 'error' ? 'Error' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="p-6">
              {integration.status === 'connected' ? (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {integration.balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </div>
                    <div className="text-sm text-gray-600">Saldo Disponível</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-600">
                        R$ {integration.monthlyVolume.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </div>
                      <div className="text-xs text-gray-600">Volume Mensal</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-lg font-bold text-red-600">
                        R$ {integration.fees.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-600">Taxas</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 text-center">
                    Última sincronização: {new Date(integration.lastSync).toLocaleString('pt-BR')}
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm">
                      Sync
                    </button>
                    <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">
                      ⚙️ Configurar
                    </button>
                  </div>
                </div>
              ) : integration.status === 'pending' ? (
                <div className="text-center space-y-4">
                  <div className="text-yellow-600">
                    <div className="text-4xl mb-2">⏳</div>
                    <p className="text-sm">Configuração pendente</p>
                  </div>
                  <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
                    Completar Configuração
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-gray-400">
                    <div className="text-4xl mb-2">🔌</div>
                    <p className="text-sm">Não conectado</p>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Conectar {integration.provider.charAt(0).toUpperCase() + integration.provider.slice(1)}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Resumo de Transações */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Transaction Summary (30 days)</h4>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">R$ 11.050</div>
              <div className="text-sm text-gray-600 mt-1">Total Recebido</div>
              <div className="text-xs text-green-600 mt-2">47 transações</div>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">R$ 351.85</div>
              <div className="text-sm text-gray-600 mt-1">Total em Taxas</div>
              <div className="text-xs text-red-600 mt-2">3.18% do volume</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">R$ 10.698</div>
              <div className="text-sm text-gray-600 mt-1">Líquido Recebido</div>
              <div className="text-xs text-blue-600 mt-2">96.82% do volume</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Comissões e Bonificações
  const CommissionsReports = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">🎯 Comissões e Bonificações</h3>
        <p className="text-sm text-gray-600">Relatórios automáticos de pagamentos para equipe</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Janeiro 2025 - Relatório de Comissões</h4>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
              📄 Exportar PDF
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {mockCommissions.map((commission) => (
              <div key={commission.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{commission.employeeName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        commission.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                        commission.role === 'supervisor' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {commission.role === 'manager' ? '👔 Gerente' :
                         commission.role === 'supervisor' ? 'Supervisor' : 'Professional'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{commission.services} services</span>
                      <span>Rating: {commission.rating}</span>
                      <span>Period: {commission.period}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {commission.totalEarned.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </div>
                    <div className="text-sm text-gray-500">Total a Receber</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">R$ {commission.baseCommission}</div>
                    <div className="text-xs text-gray-600">Comissão Base</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">R$ {commission.performanceBonus}</div>
                    <div className="text-xs text-gray-600">Bônus Performance</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-lg font-bold text-purple-600">R$ {commission.qualityBonus}</div>
                    <div className="text-xs text-gray-600">Bônus Qualidade</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <div className="text-lg font-bold text-yellow-600">R$ {commission.punctualityBonus}</div>
                    <div className="text-xs text-gray-600">Bônus Pontualidade</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Bonus Criteria</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h6 className="font-medium text-gray-700 mb-2">Performance</h6>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Meta de serviços:</span>
                          <span className="text-green-600">✓ {commission.services}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Eficiência:</span>
                          <span className="text-green-600">✓ 95%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-700 mb-2">Qualidade</h6>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Avaliação média:</span>
                          <span className="text-green-600">✓ {commission.rating}/5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reclamações:</span>
                          <span className="text-green-600">✅ 0</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-700 mb-2">Pontualidade</h6>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Atrasos:</span>
                          <span className="text-green-600">✅ 0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frequência:</span>
                          <span className="text-green-600">✅ 100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Próximo pagamento: 5º dia útil do mês
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                      📄 Detalhes
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                      💳 Pagar Agora
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', name: 'Dashboard Financeiro', icon: '📊' },
    { id: 'invoices', name: 'Invoices', icon: '🧾' },
    { id: 'payments', name: 'Pagamentos', icon: '💳' },
    { id: 'profitability', name: 'Rentabilidade', icon: '🏠' },
    { id: 'banking', name: 'Integração Bancária', icon: '🏦' },
    { id: 'commissions', name: 'Comissões', icon: '🎯' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">💰 BSOS Finance - Financial Management</h1>
            <p className="text-green-100">
              Gestão financeira completa e automatizada para sua empresa de limpeza
            </p>
            <div className="mt-4 flex items-center space-x-6 text-green-100">
              <span>💰 R$ 12.450 receita mensal</span>
              <span>📊 34.5% margem de lucro</span>
              <span>🧾 R$ 2.340 pendente</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">R$ 18.661</div>
            <div className="text-green-100">Saldo Total Disponível</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && <FinancialDashboard />}
          {activeTab === 'invoices' && <InvoiceManagement />}
          {activeTab === 'payments' && <PaymentControl />}
          {activeTab === 'profitability' && <PropertyProfitability />}
          {activeTab === 'banking' && <BankingIntegration />}
          {activeTab === 'commissions' && <CommissionsReports />}
        </div>
      </div>
    </div>
  );
}
