import { ApiResponse } from '@/lib/handlers';

// Tipos para relatórios
export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  propertyId?: string;
  clientId?: string;
  cleaningType?: string;
  status?: string;
}

export interface ReportData {
  type: 'performance' | 'financial' | 'cleaning' | 'employee' | 'property' | 'client';
  title: string;
  description?: string;
  filters: ReportFilters;
  format: 'pdf' | 'excel' | 'csv';
  scheduledGeneration?: boolean;
  recipients?: string[];
}

/**
 * 📊 SERVIÇOS DE RELATÓRIOS
 * Funções para gerar e gerenciar relatórios
 */

// Gerar relatório
export const generateReport = async (reportData: ReportData): Promise<ApiResponse> => {
  const res = await fetch('/api/reports/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to generate report: ${res.statusText}`);
  }
  
  return res.json();
};

// Exportar relatório
export const exportReport = async (
  reportId: string,
  format: 'pdf' | 'excel' | 'csv'
): Promise<ApiResponse> => {
  const res = await fetch('/api/reports/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportId, format }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to export report: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar relatórios
export const getReports = async (filters?: {
  type?: string;
  status?: string;
  createdBy?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  
  const res = await fetch(`/api/relatorios?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch reports: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar detalhes de um relatório
export const getReportDetails = async (reportId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/relatorios/${reportId}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch report details: ${res.statusText}`);
  }
  
  return res.json();
};

// Relatório de performance de funcionários
export const getEmployeePerformanceReport = async (
  filters: ReportFilters
): Promise<ApiResponse> => {
  return generateReport({
    type: 'performance',
    title: 'Relatório de Performance de Funcionários',
    filters,
    format: 'pdf',
  });
};

// Relatório financeiro
export const getFinancialReport = async (
  filters: ReportFilters
): Promise<ApiResponse> => {
  return generateReport({
    type: 'financial',
    title: 'Relatório Financeiro',
    filters,
    format: 'excel',
  });
};

// Relatório de limpezas
export const getCleaningReport = async (
  filters: ReportFilters
): Promise<ApiResponse> => {
  return generateReport({
    type: 'cleaning',
    title: 'Relatório de Limpezas',
    filters,
    format: 'pdf',
  });
};

// Relatório de propriedades
export const getPropertyReport = async (
  filters: ReportFilters
): Promise<ApiResponse> => {
  return generateReport({
    type: 'property',
    title: 'Relatório de Propriedades',
    filters,
    format: 'pdf',
  });
};

// Relatório de clientes
export const getClientReport = async (
  filters: ReportFilters
): Promise<ApiResponse> => {
  return generateReport({
    type: 'client',
    title: 'Relatório de Clientes',
    filters,
    format: 'pdf',
  });
};

// Dashboard analytics
export const getDashboardAnalytics = async (
  period?: { start: string; end: string }
): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (period) {
    params.append('start', period.start);
    params.append('end', period.end);
  }
  
  const res = await fetch(`/api/dashboard?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard analytics: ${res.statusText}`);
  }
  
  return res.json();
};

// Estatísticas administrativas
export const getAdminStats = async (): Promise<ApiResponse> => {
  const res = await fetch('/api/admin/stats');
  
  if (!res.ok) {
    throw new Error(`Failed to fetch admin stats: ${res.statusText}`);
  }
  
  return res.json();
};

// Relatórios do supervisor
export const getSupervisorReports = async (supervisorId?: string): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (supervisorId) {
    params.append('supervisorId', supervisorId);
  }
  
  const res = await fetch(`/api/supervisor?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch supervisor reports: ${res.statusText}`);
  }
  
  return res.json();
};

// Exportar relatório customizado
export const exportCustomReport = async (
  reportConfig: {
    title: string;
    data: any[];
    columns: Array<{
      key: string;
      label: string;
      type: 'text' | 'number' | 'date' | 'currency';
    }>;
    format: 'pdf' | 'excel' | 'csv';
  }
): Promise<ApiResponse> => {
  const res = await fetch('/api/admin/reports/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportConfig),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to export custom report: ${res.statusText}`);
  }
  
  return res.json();
};