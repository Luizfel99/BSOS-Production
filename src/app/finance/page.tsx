'use client';

import React, { useState } from 'react';
import { CreditCard, TrendingUp, DollarSign, FileText, Download, Plus } from 'lucide-react';
import BalanceOverview from '@/components/finance/BalanceOverview';
import InvoiceList from '@/components/finance/InvoiceList';
import TransactionHistory from '@/components/finance/TransactionHistory';
import { useNotifications } from '@/hooks/useNotifications';

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