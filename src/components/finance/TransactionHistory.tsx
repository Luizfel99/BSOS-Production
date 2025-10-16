'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  RefreshCw,
  Download,
  ChevronRight
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getPaymentMethodDisplay } from '@/lib/stripe';
import { useNotifications } from '@/hooks/useNotifications';

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'payout' | 'adjustment';
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'canceled';
  created: number;
  description: string;
  customer?: {
    name: string;
    email: string;
  };
  payment_method?: {
    type: string;
    last4?: string;
    brand?: string;
  };
  invoice_id?: string;
  receipt_url?: string;
  fee?: number;
  net?: number;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { success, error } = useNotifications();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        type: typeFilter,
        status: statusFilter,
        date_range: dateRange,
        sort_order: sortOrder,
      });

      const response = await fetch(`/api/finance/transactions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (err) {
      error('Failed to load transactions');
      console.error('Transaction fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportTransactions = async () => {
    try {
      const params = new URLSearchParams({
        type: typeFilter,
        status: statusFilter,
        date_range: dateRange,
        format: 'csv'
      });

      const response = await fetch(`/api/finance/transactions/export?${params}`);
      if (!response.ok) throw new Error('Failed to export transactions');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      success('Transaction export started');
    } catch (err) {
      error('Failed to export transactions');
    }
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.type === 'payment') {
      return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
    } else if (transaction.type === 'refund') {
      return <ArrowUpRight className="w-5 h-5 text-red-600" />;
    } else if (transaction.type === 'payout') {
      return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
    }
    return <CreditCard className="w-5 h-5 text-gray-600" />;
  };

  const getAmountDisplay = (transaction: Transaction) => {
    const isOutgoing = transaction.type === 'refund' || transaction.type === 'payout';
    const sign = isOutgoing ? '-' : '+';
    const colorClass = isOutgoing ? 'text-red-600' : 'text-green-600';
    
    return (
      <span className={`font-medium ${colorClass}`}>
        {sign}{formatCurrency(Math.abs(transaction.amount), transaction.currency)}
      </span>
    );
  };

  useEffect(() => {
    fetchTransactions();
  }, [searchTerm, typeFilter, statusFilter, dateRange, sortOrder]);

  const filteredTransactions = transactions.filter(transaction => {
    if (typeFilter !== 'all' && transaction.type !== typeFilter) return false;
    if (statusFilter !== 'all' && transaction.status !== statusFilter) return false;
    if (searchTerm && 
        !transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transaction.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transaction.customer?.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transaction.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="payment">Payments</option>
            <option value="refund">Refunds</option>
            <option value="payout">Payouts</option>
            <option value="adjustment">Adjustments</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="canceled">Canceled</option>
          </select>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
            <option value="all">All time</option>
          </select>
          
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
          
          <button
            onClick={handleExportTransactions}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Total Received</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(
                  filteredTransactions
                    .filter(t => t.type === 'payment' && t.status === 'succeeded')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Total Refunded</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(
                  filteredTransactions
                    .filter(t => t.type === 'refund' && t.status === 'succeeded')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-lg font-semibold text-gray-900">
                {filteredTransactions.length.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Avg. Transaction</p>
              <p className="text-lg font-semibold text-gray-900">
                {filteredTransactions.length > 0 
                  ? formatCurrency(
                      filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / filteredTransactions.length
                    )
                  : '$0.00'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-gray-600">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Loading transactions...
          </div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-600">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Transactions will appear here once you start processing payments'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {getTransactionIcon(transaction)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {transaction.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.customer ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.customer.email}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.payment_method ? (
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {getPaymentMethodDisplay(transaction.payment_method.type)}
                            </div>
                            {transaction.payment_method.last4 && (
                              <div className="text-xs text-gray-500">
                                •••• {transaction.payment_method.last4}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {getAmountDisplay(transaction)}
                        {transaction.fee && (
                          <div className="text-xs text-gray-500">
                            Fee: {formatCurrency(transaction.fee, transaction.currency)}
                          </div>
                        )}
                        {transaction.net && (
                          <div className="text-xs text-gray-600 font-medium">
                            Net: {formatCurrency(transaction.net, transaction.currency)}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(transaction.created)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end">
                        {transaction.receipt_url && (
                          <a
                            href={transaction.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 mr-2"
                            title="View Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 bg-white hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center flex-1">
                    <div className="flex-shrink-0 mr-3">
                      {getTransactionIcon(transaction)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {transaction.description}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusColor(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {transaction.customer && (
                    <div>
                      <span className="text-xs font-medium text-gray-700">Cliente:</span>
                      <p className="text-sm text-gray-900">{transaction.customer.name}</p>
                      <p className="text-xs text-gray-500">{transaction.customer.email}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs font-medium text-gray-700">Valor:</span>
                      <div className="text-sm">
                        {getAmountDisplay(transaction)}
                        {transaction.net && (
                          <div className="text-xs text-gray-600 font-medium">
                            Net: {formatCurrency(transaction.net, transaction.currency)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs font-medium text-gray-700">Data:</span>
                      <p className="text-sm text-gray-900">
                        {formatDate(transaction.created)}
                      </p>
                    </div>
                  </div>

                  {transaction.payment_method && (
                    <div>
                      <span className="text-xs font-medium text-gray-700">Pagamento:</span>
                      <div className="flex items-center mt-1">
                        <CreditCard className="w-3 h-3 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {getPaymentMethodDisplay(transaction.payment_method.type)}
                        </span>
                        {transaction.payment_method.last4 && (
                          <span className="text-xs text-gray-500 ml-1">
                            •••• {transaction.payment_method.last4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">ID: {transaction.id}</span>
                  <div className="flex items-center gap-2">
                    {transaction.receipt_url && (
                      <a
                        href={transaction.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 p-1.5 touch-target"
                        title="View Receipt"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 p-1.5 touch-target">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}