import { ApiResponse } from '@/lib/handlers';

// Tipos para pagamentos
export interface PaymentData {
  amount: number;
  type: 'salary' | 'bonus' | 'commission' | 'overtime' | 'refund';
  employeeId?: string;
  cleaningId?: string;
  description: string;
  dueDate?: string;
  method?: 'bank_transfer' | 'cash' | 'pix' | 'check';
}

export interface InvoiceData {
  clientId: string;
  cleaningId?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  dueDate: string;
  notes?: string;
}

/**
 * 💰 SERVIÇOS FINANCEIROS
 * Funções para gerenciar pagamentos, salários e invoices
 */

// Criar novo pagamento
export const createPayment = async (data: PaymentData): Promise<ApiResponse> => {
  const res = await fetch('/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create payment: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar pagamentos
export const getPayments = async (filters?: {
  employeeId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  
  const res = await fetch(`/api/payments?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch payments: ${res.statusText}`);
  }
  
  return res.json();
};

// Aprovar pagamento
export const approvePayment = async (paymentId: string): Promise<ApiResponse> => {
  const res = await fetch('/api/payments/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to approve payment: ${res.statusText}`);
  }
  
  return res.json();
};

// Processar reembolso
export const processRefund = async (
  paymentId: string,
  amount?: number,
  reason?: string
): Promise<ApiResponse> => {
  const res = await fetch('/api/payments/refund', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, amount, reason }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to process refund: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar pagamentos de funcionários
export const getEmployeePayments = async (filters?: {
  employeeId?: string;
  month?: string;
  year?: string;
}): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  
  const res = await fetch(`/api/payments/employees?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch employee payments: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar regras de bônus
export const getBonusRules = async (): Promise<ApiResponse> => {
  const res = await fetch('/api/payments/bonus-rules');
  
  if (!res.ok) {
    throw new Error(`Failed to fetch bonus rules: ${res.statusText}`);
  }
  
  return res.json();
};

// Atualizar regras de bônus
export const updateBonusRules = async (rules: any): Promise<ApiResponse> => {
  const res = await fetch('/api/payments/bonus-rules', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rules),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update bonus rules: ${res.statusText}`);
  }
  
  return res.json();
};

// Criar invoice
export const createInvoice = async (data: InvoiceData): Promise<ApiResponse> => {
  const res = await fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create invoice: ${res.statusText}`);
  }
  
  return res.json();
};

// Gerar invoice automaticamente
export const generateInvoice = async (data: {
  clientId: string;
  cleaningId?: string;
  template?: string;
}): Promise<ApiResponse> => {
  const res = await fetch('/api/invoices/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to generate invoice: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar invoices
export const getInvoices = async (filters?: {
  clientId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  
  const res = await fetch(`/api/invoices?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch invoices: ${res.statusText}`);
  }
  
  return res.json();
};