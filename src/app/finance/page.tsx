'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
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
            <Button
              onClick={handleCreateInvoice}
              disabled={loading}
              leftIcon={<Plus className="h-5 w-5" />}
              variant="primary"
              size="lg"
            >
              Criar Primera Fatura
            </Button>
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
                  <Button
                    onClick={handleSyncStripe}
                    disabled={loading}
                    variant="secondary"
                    leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
                  >
                    Sync Stripe
                  </Button>
                  
                  <Button
                    onClick={handleCreateInvoice}
                    disabled={loading}
                    variant="primary"
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Nova Fatura
                  </Button>
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
                <div className="bg-bsos-primary/10 p-3 rounded-bsos">
                  <TrendingUp className="h-6 w-6 text-bsos-primary" />
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