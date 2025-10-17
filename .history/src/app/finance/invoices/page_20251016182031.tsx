'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FileText, Plus, Eye, Download, AlertCircle } from 'lucide-react';
import { ProtectedComponent } from '@/components/ProtectedComponent';

interface Invoice {
  id: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  clientName: string;
  clientEmail: string;
  description: string;
  dueDate: string;
  createdAt: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/finance/invoices');
      
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.data || []);
      } else {
        toast.error('Erro ao carregar faturas');
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error('Erro ao carregar faturas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'draft': 'Rascunho',
      'sent': 'Enviada',
      'paid': 'Paga',
      'overdue': 'Vencida'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <ProtectedComponent>
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
                  <FileText className="h-8 w-8 mr-3 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Faturas</h1>
                    <p className="text-gray-600">Gerencie todas as faturas e pagamentos</p>
                  </div>
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 flex items-center gap-2 transition-colors">
                  <Plus className="h-4 w-4" />
                  Nova Fatura
                </button>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-sm border p-8 text-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando faturas...</p>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && invoices.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border p-12 text-center"
            >
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma fatura disponível
              </h3>
              <p className="text-gray-600 mb-6">
                No invoices yet. Comece criando sua primeira fatura.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-3 flex items-center gap-2 mx-auto transition-colors">
                <Plus className="h-5 w-5" />
                Criar Primera Fatura
              </button>
            </motion.div>
          )}

          {/* Invoices List */}
          {!loading && invoices.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              <div className="overflow-x-auto">
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
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{invoice.id.slice(-6)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.clientName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.clientEmail}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {getStatusLabel(invoice.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Development Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  Integração Stripe
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Esta página está conectada com a API Stripe para gerenciamento de faturas.
                  Dados em tempo real serão exibidos quando a integração estiver ativa.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedComponent>
  );
}