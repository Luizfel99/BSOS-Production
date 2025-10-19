import { ApiResponse } from '@/lib/handlers';

// Tipos para funcionários
export interface EmployeeData {
  name: string;
  email: string;
  phone: string;
  role: 'cleaner' | 'supervisor' | 'manager' | 'admin';
  skillLevel: 'junior' | 'mid' | 'senior' | 'expert';
  specialties?: string[];
  availableHours?: {
    start: string;
    end: string;
    days: string[];
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents?: {
    cpf?: string;
    rg?: string;
    address?: string;
  };
}

export interface EmployeeUpdate {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'cleaner' | 'supervisor' | 'manager' | 'admin';
  skillLevel?: 'junior' | 'mid' | 'senior' | 'expert';
  specialties?: string[];
  status?: 'active' | 'inactive' | 'vacation' | 'sick';
  availableHours?: {
    start: string;
    end: string;
    days: string[];
  };
}

export interface PerformanceData {
  tasksCompleted: number;
  averageRating: number;
  punctuality: number;
  efficiency: number;
  clientSatisfaction: number;
  period: {
    start: string;
    end: string;
  };
}

/**
 * 👥 SERVIÇOS DE FUNCIONÁRIOS
 * Funções para gerenciar funcionários e performance
 */

// Criar novo funcionário
export const createEmployee = async (data: EmployeeData): Promise<ApiResponse> => {
  const res = await fetch('/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create employee: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar funcionários
export const getEmployees = async (filters?: {
  role?: string;
  skillLevel?: string;
  status?: string;
  specialty?: string;
}): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  
  const res = await fetch(`/api/employees?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch employees: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar perfis de funcionários
export const getEmployeeProfiles = async (): Promise<ApiResponse> => {
  const res = await fetch('/api/employees/profiles');
  
  if (!res.ok) {
    throw new Error(`Failed to fetch employee profiles: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar detalhes de um funcionário
export const getEmployeeDetails = async (employeeId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/employees/${employeeId}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch employee details: ${res.statusText}`);
  }
  
  return res.json();
};

// Atualizar funcionário
export const updateEmployee = async (
  employeeId: string, 
  data: EmployeeUpdate
): Promise<ApiResponse> => {
  const res = await fetch(`/api/employees/${employeeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update employee: ${res.statusText}`);
  }
  
  return res.json();
};

// Check-in de funcionário
export const employeeCheckin = async (
  employeeId: string,
  data: {
    location?: { lat: number; lng: number };
    propertyId?: string;
    notes?: string;
  }
): Promise<ApiResponse> => {
  const res = await fetch(`/api/employees/${employeeId}/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to check-in employee: ${res.statusText}`);
  }
  
  return res.json();
};

// Check-out de funcionário
export const employeeCheckout = async (
  employeeId: string,
  data: {
    location?: { lat: number; lng: number };
    completed_tasks?: string[];
    notes?: string;
    rating_request?: boolean;
  }
): Promise<ApiResponse> => {
  const res = await fetch(`/api/employees/${employeeId}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to check-out employee: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar performance do funcionário
export const getEmployeePerformance = async (
  employeeId: string,
  period?: {
    start: string;
    end: string;
  }
): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (period) {
    params.append('start', period.start);
    params.append('end', period.end);
  }
  
  const res = await fetch(`/api/employees/${employeeId}/performance?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch employee performance: ${res.statusText}`);
  }
  
  return res.json();
};

// Atualizar performance do funcionário
export const updateEmployeePerformance = async (
  employeeId: string,
  performanceData: Partial<PerformanceData>
): Promise<ApiResponse> => {
  const res = await fetch(`/api/employees/${employeeId}/performance`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(performanceData),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update employee performance: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar agenda do funcionário
export const getEmployeeSchedule = async (
  employeeId: string,
  date?: string
): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (date) {
    params.append('date', date);
  }
  
  const res = await fetch(`/api/employees/${employeeId}/schedule?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch employee schedule: ${res.statusText}`);
  }
  
  return res.json();
};

// Deletar funcionário
export const deleteEmployee = async (employeeId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/employees/${employeeId}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to delete employee: ${res.statusText}`);
  }
  
  return res.json();
};