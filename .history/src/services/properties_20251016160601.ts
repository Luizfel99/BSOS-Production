import { toast } from 'react-hot-toast';

export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'COMMERCIAL';
  size?: string;
  clientName?: string;
  contactEmail?: string;
  cleaningFrequency?: string;
  platform?: string;
  platformId?: string;
  ownerId?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyData {
  name: string;
  address: string;
  type: 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'COMMERCIAL';
  size?: string;
  clientName?: string;
  contactEmail?: string;
  cleaningFrequency?: string;
  platform?: string;
  platformId?: string;
  ownerId?: string;
  active?: boolean;
}

export interface UpdatePropertyData {
  name?: string;
  address?: string;
  type?: 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'COMMERCIAL';
  size?: string;
  clientName?: string;
  contactEmail?: string;
  cleaningFrequency?: string;
  platform?: string;
  platformId?: string;
  ownerId?: string;
  active?: boolean;
}

export interface PropertyFilters {
  search?: string;
  type?: string;
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

/**
 * 🏠 PROPERTIES SERVICE
 * Functions for managing properties with full CRUD operations
 */

// Create new property
export const createProperty = async (data: CreatePropertyData): Promise<ApiResponse<Property>> => {
  try {
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create property');
    }

    toast.success('Property created successfully!');
    return result;
  } catch (error: any) {
    toast.error(error.message || 'Failed to create property');
    throw error;
  }
};

// Get all properties with filters
export const getProperties = async (filters?: PropertyFilters): Promise<ApiResponse<Property[]>> => {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`/api/properties?${params.toString()}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch properties');
    }

    return result;
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch properties');
    throw error;
  }
};

// Get property by ID
export const getProperty = async (propertyId: string): Promise<ApiResponse<Property>> => {
  try {
    const response = await fetch(`/api/properties/${propertyId}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch property');
    }

    return result;
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch property');
    throw error;
  }
};

// Update property
export const updateProperty = async (
  propertyId: string, 
  data: UpdatePropertyData
): Promise<ApiResponse<Property>> => {
  try {
    const response = await fetch(`/api/properties/${propertyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update property');
    }

    toast.success('Property updated successfully!');
    return result;
  } catch (error: any) {
    toast.error(error.message || 'Failed to update property');
    throw error;
  }
};

// Delete property
export const deleteProperty = async (propertyId: string): Promise<ApiResponse<{ deleted: boolean }>> => {
  try {
    const response = await fetch(`/api/properties/${propertyId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete property');
    }

    toast.success('Property deleted successfully!');
    return result;
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete property');
    throw error;
  }
};

// Toggle property active status
export const togglePropertyStatus = async (propertyId: string): Promise<ApiResponse<Property>> => {
  try {
    const propertyResponse = await getProperty(propertyId);
    const currentProperty = propertyResponse.data;
    
    return await updateProperty(propertyId, { 
      active: !currentProperty.active 
    });
  } catch (error: any) {
    toast.error(error.message || 'Failed to toggle property status');
    throw error;
  }
};

// Utility functions
export const getPropertyTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    'APARTMENT': 'Apartment',
    'HOUSE': 'House', 
    'STUDIO': 'Studio'
  };
  return typeLabels[type] || type;
};

export const getPropertyStatusLabel = (active: boolean): string => {
  return active ? 'Active' : 'Inactive';
};

export const getPropertyStatusBadgeColor = (active: boolean): string => {
  return active 
    ? 'bg-green-100 text-green-800 border-green-200' 
    : 'bg-gray-100 text-gray-800 border-gray-200';
};