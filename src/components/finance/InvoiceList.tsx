'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  Send, 
  MoreVertical, 
  Search,
  Filter,
  Calendar,
  DollarSign,
  RefreshCw 
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/stripe';
import { useNotifications } from '@/hooks/useNotifications';

interface Invoice {
  id: string;
  number: string;
  customer_name: string;
  customer_email: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  created: number;
  due_date: number;
  description?: string;
  hosted_invoice_url?: string;
  invoice_pdf?: string;
}

// Animation variants
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  }
};

const buttonVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'created' | 'due_date' | 'amount'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { success, error } = useNotifications();

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        status: statusFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      const response = await fetch(`/api/finance/invoices?${params}`);
      if (!response.ok) throw new Error('Failed to fetch invoices');
      
      const data = await response.json();
      setInvoices(data.invoices);
    } catch (err) {
      error('Failed to load invoices');
      console.error('Invoice fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    if (invoice.hosted_invoice_url) {
      window.open(invoice.hosted_invoice_url, '_blank');
    } else {
      error('Invoice URL not available');
    }
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      if (invoice.invoice_pdf) {
        const link = document.createElement('a');
        link.href = invoice.invoice_pdf;
        link.download = `invoice-${invoice.number}.pdf`;
        link.click();
        success('Invoice download started');
      } else {
        error('PDF not available for this invoice');
      }
    } catch (err) {
      error('Failed to download invoice');
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/finance/invoices/${invoiceId}/send`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to send invoice');
      
      success('Invoice sent successfully');
      fetchInvoices(); // Refresh list
    } catch (err) {
      error('Failed to send invoice');
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  const filteredInvoices = invoices.filter(invoice => {
    if (statusFilter !== 'all' && invoice.status !== statusFilter) return false;
    if (searchTerm && !invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !invoice.customer_email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <motion.div 
      className="space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="paid">Paid</option>
            <option value="void">Void</option>
            <option value="uncollectible">Uncollectible</option>
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as typeof sortBy);
              setSortOrder(order as typeof sortOrder);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="created-desc">Newest First</option>
            <option value="created-asc">Oldest First</option>
            <option value="due_date-desc">Due Date (Latest)</option>
            <option value="due_date-asc">Due Date (Earliest)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
          
          <motion.button
            onClick={fetchInvoices}
            disabled={loading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Invoice List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-gray-600">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Loading invoices...
          </div>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Create your first invoice to get started'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-400 text-6xl mb-4">📄</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma fatura encontrada</h3>
                      <p className="text-gray-500">
                        {invoices.length === 0 
                          ? "Não há faturas cadastradas no sistema."
                          : "Nenhuma fatura corresponde aos filtros aplicados."
                        }
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice, index) => (
                  <motion.tr 
                    key={invoice.id} 
                    className="hover:bg-gray-50"
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(invoice.created)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.customer_email}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(invoice.amount_due, invoice.currency)}
                        </span>
                      </div>
                      {invoice.amount_paid > 0 && (
                        <div className="text-xs text-green-600">
                          {formatCurrency(invoice.amount_paid, invoice.currency)} paid
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {formatDate(invoice.due_date)}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => handleViewInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Invoice"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Download PDF"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                        
                        {invoice.status === 'open' && (
                          <motion.button
                            onClick={() => handleSendInvoice(invoice.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Send Invoice"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Send className="w-4 h-4" />
                          </motion.button>
                        )}
                        
                        <motion.button 
                          className="text-gray-400 hover:text-gray-600 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredInvoices.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📄</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma fatura encontrada</h3>
                <p className="text-gray-500">
                  {invoices.length === 0 
                    ? "Não há faturas cadastradas no sistema."
                    : "Nenhuma fatura corresponde aos filtros aplicados."
                  }
                </p>
              </div>
            ) : (
              filteredInvoices.map((invoice, index) => (
              <motion.div 
                key={invoice.id} 
                className="p-4 bg-white hover:bg-gray-50"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.number}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(invoice.created)}
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.customer_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {invoice.customer_email}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(invoice.amount_due, invoice.currency)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(invoice.due_date)}
                    </div>
                  </div>

                  {invoice.amount_paid > 0 && (
                    <div className="text-xs text-green-600">
                      {formatCurrency(invoice.amount_paid, invoice.currency)} paid
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <motion.button
                    onClick={() => handleViewInvoice(invoice)}
                    className="text-blue-600 hover:text-blue-900 p-1.5 touch-target"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleDownloadInvoice(invoice)}
                    className="text-gray-600 hover:text-gray-900 p-1.5 touch-target"
                    title="Download PDF"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  
                  {invoice.status === 'open' && (
                    <motion.button
                      onClick={() => handleSendInvoice(invoice.id)}
                      className="text-green-600 hover:text-green-900 p-1.5 touch-target"
                      title="Send Invoice"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  )}
                  
                  <motion.button 
                    className="text-gray-400 hover:text-gray-600 p-1.5 touch-target"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}