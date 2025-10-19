import { ApiResponse } from '@/lib/handlers';

// Tipos para tarefas
export interface TaskData {
  title: string;
  description?: string;
  type: 'cleaning' | 'maintenance' | 'inspection' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  propertyId?: string;
  dueDate?: Date;
  estimatedDuration?: number;
  materials?: string;
  instructions?: string;
  checklist?: string[];
  requiredTools?: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'cleaning' | 'maintenance' | 'inspection' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  assignedToName?: string;
  propertyId?: string;
  propertyName?: string;
  dueDate?: string;
  estimatedDuration?: number;
  materials?: string;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  propertyId?: string;
  page?: number;
  limit?: number;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  type?: 'cleaning' | 'maintenance' | 'inspection' | 'other';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  propertyId?: string;
  dueDate?: Date;
  estimatedDuration?: number;
  materials?: string;
  instructions?: string;
  notes?: string;
  completedAt?: string;
}

/**
 * ✅ SERVIÇOS DE TAREFAS
 * Funções para gerenciar tarefas e atividades
 */

// Criar nova tarefa
export const createTask = async (data: TaskData): Promise<ApiResponse> => {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create task: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar tarefas
export const getTasks = async (filters?: {
  assignedTo?: string;
  propertyId?: string;
  status?: string;
  priority?: string;
  type?: string;
  dueDate?: string;
}): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  
  const res = await fetch(`/api/tasks?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar detalhes de uma tarefa
export const getTaskDetails = async (taskId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/tasks/${taskId}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch task details: ${res.statusText}`);
  }
  
  return res.json();
};

// Atualizar tarefa
export const updateTask = async (
  taskId: string, 
  data: TaskUpdate
): Promise<ApiResponse> => {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update task: ${res.statusText}`);
  }
  
  return res.json();
};

// Iniciar tarefa
export const startTask = async (taskId: string, employeeId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/tasks/${taskId}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to start task: ${res.statusText}`);
  }
  
  return res.json();
};

// Completar tarefa
export const completeTask = async (
  taskId: string,
  data: {
    notes?: string;
    photos?: string[];
    timeSpent?: number;
    quality?: number;
  }
): Promise<ApiResponse> => {
  const res = await fetch(`/api/tasks/${taskId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to complete task: ${res.statusText}`);
  }
  
  return res.json();
};

// Cancelar tarefa
export const cancelTask = async (taskId: string, reason: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/tasks/${taskId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to cancel task: ${res.statusText}`);
  }
  
  return res.json();
};

// Atribuir tarefa a funcionário
export const assignTask = async (
  taskId: string, 
  employeeId: string,
  notes?: string
): Promise<ApiResponse> => {
  const res = await fetch(`/api/tasks/${taskId}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, notes }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to assign task: ${res.statusText}`);
  }
  
  return res.json();
};

// Listar tarefas com filtros e paginação
export const listTasks = async (filters?: TaskFilters): Promise<ApiResponse<TaskListResponse>> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const res = await fetch(`/api/tasks?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.statusText}`);
  }
  
  return res.json();
};

// Excluir tarefa
export const deleteTask = async (taskId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to delete task: ${res.statusText}`);
  }
  
  return res.json();
};



