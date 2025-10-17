// Finance Service for BSOS Platform
// Handles all financial operations with Stripe integration

interface CreateInvoiceData {
  amount: number;
  description: string;
  clientEmail: string;
  clientName?: string;
  dueDate?: string;
  metadata?: Record<string, any>;
}

interface FinanceSummary {
  totalIncome: number;
  pendingAmount: number;
  paidAmount: number;
  invoiceCount: number;
  transactionCount: number;
  lastUpdated: string;
}

export async function getFinanceSummary(): Promise<FinanceSummary> {
  try {
    const res = await fetch('/api/finance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Finance API error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching finance summary:', error);
    throw error;
  }
}

export async function createInvoice(data: CreateInvoiceData) {
  try {
    const res = await fetch('/api/finance/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error(`Invoice creation error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

export async function syncStripeData() {
  try {
    const res = await fetch('/api/finance/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Stripe sync error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error syncing Stripe data:', error);
    throw error;
  }
}

export async function getInvoices(filters?: { status?: string; limit?: number }) {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const res = await fetch(`/api/finance/invoices?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Invoices fetch error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

export async function getTransactions(filters?: { limit?: number; offset?: number }) {
  try {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    const res = await fetch(`/api/finance/transactions?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Transactions fetch error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

// Role-based access helper
export function hasFinanceAccess(userRole: string): boolean {
  return ['ADMIN', 'MANAGER'].includes(userRole);
}

export function hasFinanceViewAccess(userRole: string): boolean {
  return ['ADMIN', 'MANAGER', 'SUPERVISOR'].includes(userRole);
}

export function isFinanceHidden(userRole: string): boolean {
  return ['CLEANER', 'CLIENT'].includes(userRole);
}