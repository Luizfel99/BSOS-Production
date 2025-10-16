'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ControlePagamentos from '../ControlePagamentos';
import RelatoriosAutomaticos from '../RelatoriosAutomaticos';

// Component Icons
const MoneyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const InvoiceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ReportIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CalculatorIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export default function BSOSFinance() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    {
      id: 'dashboard',
      name: 'Dashboard Financeiro',
      icon: MoneyIcon,
      component: null
    },
    {
      id: 'payments',
      name: 'Pagamentos',
      icon: MoneyIcon,
      component: ControlePagamentos
    },
    {
      id: 'invoices',
      name: 'Faturas & Invoices',
      icon: InvoiceIcon,
      component: null
    },
    {
      id: 'reports',
      name: 'Relatórios Financeiros',
      icon: ReportIcon,
      component: RelatoriosAutomaticos
    }
  ];

  const InvoicesComponent = () => (
    <div className="space-y-6">
      {/* Invoice Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Gestão de Faturas</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Nova Fatura
        </button>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fatura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              {
                id: 'INV-2025-001',
                client: 'João Silva',
                amount: 'R$ 2.450,00',
                status: 'Paga',
                dueDate: '2025-01-15',
                statusColor: 'green'
              },
              {
                id: 'INV-2025-002',
                client: 'Maria Santos',
                amount: 'R$ 3.200,00',
                status: 'Pendente',
                dueDate: '2025-01-20',
                statusColor: 'yellow'
              },
              {
                id: 'INV-2025-003',
                client: 'Pedro Costa',
                amount: 'R$ 1.800,00',
                status: 'Vencida',
                dueDate: '2025-01-05',
                statusColor: 'red'
              }
            ].map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {invoice.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    invoice.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                    invoice.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.dueDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                  <button className="text-green-600 hover:text-green-900 mr-3">Editar</button>
                  <button className="text-red-600 hover:text-red-900">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const FinanceDashboard = () => (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <MoneyIcon />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
              <p className="text-2xl font-semibold text-gray-900">R$ 45.680</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-green-600 text-sm">+12% vs mês anterior</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <InvoiceIcon />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Faturas Pendentes</p>
              <p className="text-2xl font-semibold text-gray-900">R$ 8.450</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-blue-600 text-sm">5 faturas em aberto</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CalculatorIcon />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Custos Operacionais</p>
              <p className="text-2xl font-semibold text-gray-900">R$ 18.230</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-yellow-600 text-sm">-3% vs mês anterior</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ReportIcon />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
              <p className="text-2xl font-semibold text-gray-900">R$ 27.450</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-purple-600 text-sm">Margem: 60.1%</span>
          </div>
        </div>
      </div>

      {/* Financial Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Receita vs Custos (Últimos 6 meses)</h3>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-end justify-between space-x-2">
              {[
                { month: 'Jul', revenue: 38000, cost: 15000 },
                { month: 'Ago', revenue: 42000, cost: 16500 },
                { month: 'Set', revenue: 35000, cost: 14200 },
                { month: 'Out', revenue: 48000, cost: 18800 },
                { month: 'Nov', revenue: 41000, cost: 17100 },
                { month: 'Dez', revenue: 45680, cost: 18230 }
              ].map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex flex-col space-y-1">
                    <div 
                      className="bg-green-500 rounded-t" 
                      style={{ height: `${(data.revenue / 50000) * 200}px` }}
                    ></div>
                    <div 
                      className="bg-red-500 rounded-b" 
                      style={{ height: `${(data.cost / 50000) * 200}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Receita</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Custos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Distribuição de Custos</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { category: 'Salários e Benefícios', amount: 12500, percentage: 68.5 },
                { category: 'Produtos de Limpeza', amount: 3200, percentage: 17.5 },
                { category: 'Transporte', amount: 1800, percentage: 9.9 },
                { category: 'Equipamentos', amount: 730, percentage: 4.1 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm text-gray-500">R$ {item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-4 text-sm text-gray-500">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Financial Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Ações Rápidas</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
              <InvoiceIcon />
              <span className="ml-2 text-sm font-medium">Gerar Fatura</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
              <MoneyIcon />
              <span className="ml-2 text-sm font-medium">Processar Pagamento</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
              <ReportIcon />
              <span className="ml-2 text-sm font-medium">Relatório Mensal</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
              <CalculatorIcon />
              <span className="ml-2 text-sm font-medium">Calcular Impostos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Transações Recentes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { type: 'Receita', description: 'Pagamento Casa #123', amount: '+R$ 450,00', time: '2h atrás' },
              { type: 'Custo', description: 'Compra produtos limpeza', amount: '-R$ 120,00', time: '4h atrás' },
              { type: 'Receita', description: 'Pagamento Apartamento #456', amount: '+R$ 380,00', time: '6h atrás' },
              { type: 'Custo', description: 'Combustível equipe', amount: '-R$ 85,00', time: '1 dia atrás' }
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'Receita' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.time}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  transaction.type === 'Receita' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BSOS Finance - Controle Financeiro</h1>
            <p className="text-gray-600">Pagamentos, invoices e relatórios financeiros para administração</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Contas em dia</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeSection === section.id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeSection === 'dashboard' && <FinanceDashboard />}
          {activeSection === 'invoices' && <InvoicesComponent />}
          {sections.map((section) => {
            if (section.component && activeSection === section.id) {
              const Component = section.component;
              return <Component key={section.id} />;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
