import { toast } from 'react-hot-toast';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'MANAGER' | 'CLEANER' | 'CLIENT';
  active: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface CreateTeamMemberData {
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'MANAGER' | 'CLEANER' | 'CLIENT';
  active?: boolean;
}

export interface UpdateTeamMemberData {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'ADMIN' | 'MANAGER' | 'CLEANER' | 'CLIENT';
  active?: boolean;
}

export interface TeamFilters {
  search?: string;
  role?: string;
  active?: boolean;
}

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

interface ApiError {
  error: string;
  details?: any;
}

// Get all team members
export async function getTeamMembers(filters?: TeamFilters): Promise<TeamMember[]> {
  try {
    const params = new URLSearchParams();
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.role) {
      params.append('role', filters.role);
    }
    if (filters?.active !== undefined) {
      params.append('active', filters.active.toString());
    }

    const queryString = params.toString();
    const url = `/api/team${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || 'Falha ao carregar membros da equipe');
    }

    const result: ApiResponse<TeamMember[]> = await response.json();
    return result.data;

  } catch (error) {
    console.error('Error fetching team members:', error);
    toast.error(error instanceof Error ? error.message : 'Erro ao carregar membros da equipe');
    throw error;
  }
}

// Get single team member
export async function getTeamMember(id: string): Promise<TeamMember> {
  try {
    const response = await fetch(`/api/team/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || 'Falha ao carregar membro da equipe');
    }

    const result: ApiResponse<TeamMember> = await response.json();
    return result.data;

  } catch (error) {
    console.error('Error fetching team member:', error);
    toast.error(error instanceof Error ? error.message : 'Erro ao carregar membro da equipe');
    throw error;
  }
}

// Create new team member
export async function createTeamMember(data: CreateTeamMemberData): Promise<TeamMember> {
  try {
    const response = await fetch('/api/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || 'Falha ao criar membro da equipe');
    }

    const result: ApiResponse<TeamMember> = await response.json();
    toast.success(result.message || 'Membro da equipe criado com sucesso');
    return result.data;

  } catch (error) {
    console.error('Error creating team member:', error);
    toast.error(error instanceof Error ? error.message : 'Erro ao criar membro da equipe');
    throw error;
  }
}

// Update team member
export async function updateTeamMember(id: string, data: UpdateTeamMemberData): Promise<TeamMember> {
  try {
    const response = await fetch(`/api/team/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || 'Falha ao atualizar membro da equipe');
    }

    const result: ApiResponse<TeamMember> = await response.json();
    toast.success(result.message || 'Membro da equipe atualizado com sucesso');
    return result.data;

  } catch (error) {
    console.error('Error updating team member:', error);
    toast.error(error instanceof Error ? error.message : 'Erro ao atualizar membro da equipe');
    throw error;
  }
}

// Delete team member (soft delete)
export async function deleteTeamMember(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/team/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || 'Falha ao remover membro da equipe');
    }

    const result: ApiResponse<null> = await response.json();
    toast.success(result.message || 'Membro da equipe removido com sucesso');

  } catch (error) {
    console.error('Error deleting team member:', error);
    toast.error(error instanceof Error ? error.message : 'Erro ao remover membro da equipe');
    throw error;
  }
}

// Role utility functions
export function getRoleDisplayName(role: TeamMember['role']): string {
  const roleNames = {
    ADMIN: 'Administrador',
    MANAGER: 'Gerente',
    CLEANER: 'Faxineiro(a)',
    CLIENT: 'Cliente'
  };
  
  return roleNames[role] || role;
}

export function getRoleColor(role: TeamMember['role']): string {
  const roleColors = {
    ADMIN: 'bg-purple-100 text-purple-800',
    MANAGER: 'bg-blue-100 text-blue-800',
    CLEANER: 'bg-green-100 text-green-800',
    CLIENT: 'bg-orange-100 text-orange-800'
  };
  
  return roleColors[role] || 'bg-gray-100 text-gray-800';
}

export function getStatusColor(active: boolean): string {
  return active 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
}

export function getStatusDisplayName(active: boolean): string {
  return active ? 'Ativo' : 'Inativo';
}

// Export all functions and types
export default {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getRoleDisplayName,
  getRoleColor,
  getStatusColor,
  getStatusDisplayName
};