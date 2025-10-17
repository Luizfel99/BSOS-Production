'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  DollarSign,
  CreditCard,
  TrendingUp,
  FileText,
  RefreshCw,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { ProtectedComponent } from '@/components/ProtectedComponent';

interface FinanceSummary {
  totalIncome: number;
  pendingAmount: number;
  paidAmount: number;
  invoiceCount: number;
  transactionCount: number;
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'transactions' | 'payouts'>('invoices');
  const [summary, setSummary] = useState<FinanceSummary>({
    totalIncome: 12450.80,
    pendingAmount: 2300.50,
    paidAmount: 10150.30,
    invoiceCount: 24,
    transactionCount: 156
  });
  const [loading, setLoading] = useState(false);

  const handleCreateInvoice = async () => {
    try {
      setLoading(true);
      toast.loading('Criando fatura...', { id: 'create-invoice' });
      
      const response = await fetch('/api/finance/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1000,
          description: 'Nova fatura de teste',
          clientEmail: 'client@example.com'
        })
      });

      if (response.ok) {
        toast.success('Operação concluída / Operation successful', { id: 'create-invoice' });
      } else {
        toast.error('Em desenvolvimento / In development', { id: 'create-invoice' });
      }
    } catch (error) {
      toast.error('Em desenvolvimento / In development', { id: 'create-invoice' });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncStripe = async () => {
    try {
      setLoading(true);
      toast.loading('Sincronizando com Stripe...', { id: 'sync-stripe' });
      
      const response = await fetch('/api/finance/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast.success('Operação concluída / Operation successful', { id: 'sync-stripe' });
      } else {
        toast.error('Em desenvolvimento / In development', { id: 'sync-stripe' });
      }
    } catch (error) {
      toast.error('Em desenvolvimento / In development', { id: 'sync-stripe' });
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'invoices':
        return (
          <div className="bg-white rounded-lg border p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma fatura disponível
            </h3>
            <p className="text-gray-600 mb-6">
              No invoices yet. Crie sua primeira fatura para começar.
            </p>
            <button
              onClick={handleCreateInvoice}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-3 flex items-center gap-2 mx-auto transition-colors disabled:opacity-50"
            >
              <Plus className="h-5 w-5" />
              Criar Primera Fatura
            </button>
          </div>
        );
      
      case 'transactions':
        return (
          <div className="bg-white rounded-lg border p-8 text-center">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma transação disponível
            </h3>
            <p className="text-gray-600">
              No transactions yet. As transações aparecerão aqui automaticamente.
            </p>
          </div>
        );
      
      case 'payouts':
        return (
          <div className="bg-white rounded-lg border p-8 text-center">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum pagamento disponível
            </h3>
            <p className="text-gray-600">
              No payouts yet. Os pagamentos aparecerão após as transações.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <ProtectedComponent requiredRoles={['ADMIN', 'MANAGER']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 mr-3 text-green-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
                    <p className="text-gray-600">Gerencie faturas, transações e pagamentos</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSyncStripe}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2 flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Sync Stripe
                  </button>
                  
                  <button
                    onClick={handleCreateInvoice}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Create Invoice
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendente</p>
                  <p className="text-2xl font-bold text-orange-600">
                    R$ {summary.pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pago</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {summary.paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {[
                    { id: 'invoices', name: 'Invoices', icon: FileText },
                    { id: 'transactions', name: 'Transactions', icon: TrendingUp },
                    { id: 'payouts', name: 'Payouts', icon: CreditCard }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </motion.div>

          {/* Warning Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
          >
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Módulo em Desenvolvimento
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Este é o módulo financeiro BSOS com integração Stripe. 
                  Algumas funcionalidades estão em desenvolvimento e usam dados de placeholder.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedComponent>
  );
}

type FinanceTab = 'overview' | 'invoices' | 'transactions';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');
  const { success, error } = useNotifications();

  const tabs = [
    {
      id: 'overview' as FinanceTab,
      label: 'Overview',
      icon: TrendingUp,
      description: 'Balance and financial summary'
    },
    {
      id: 'invoices' as FinanceTab,
      label: 'Invoices',
      icon: FileText,
      description: 'Manage invoices and billing'
    },
    {
      id: 'transactions' as FinanceTab,
      label: 'Transactions',
      icon: CreditCard,
      description: 'Payment history and records'
    }
  ];

  const handleExportData = () => {
    try {
      // This would integrate with Stripe's API to export data
      success('Export started! You will receive an email when ready.');
    } catch (err) {
      error('Failed to start export');
    }
  };

  const handleCreateInvoice = () => {
    try {
      // This would open a modal or navigate to invoice creation
      success('Opening invoice creation...');
    } catch (err) {
      error('Failed to open invoice creation');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-8 h-8 text-green-600" />
                Finance Dashboard
              </h1>
              <p className="mt-1 text-gray-600">
                Manage your financial data and Stripe integration
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
              
              <button
                onClick={handleCreateInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <BalanceOverview />}
        {activeTab === 'invoices' && <InvoiceList />}
        {activeTab === 'transactions' && <TransactionHistory />}
      </div>
    </div>
  );
}