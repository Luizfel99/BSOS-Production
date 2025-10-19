/**
 * 🛠️ UTILITÁRIOS DE API
 * Funções auxiliares para lidar com requisições e respostas da API
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Configuração padrão para fetch
export const defaultFetchConfig: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Wrapper para fetch com tratamento de erros
export const apiRequest = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const config = {
      ...defaultFetchConfig,
      ...options,
      headers: {
        ...defaultFetchConfig.headers,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Request Error [${url}]:`, error);
    throw error;
  }
};

// GET request helper
export const apiGet = async <T = any>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const fullUrl = searchParams.toString() 
    ? `${url}?${searchParams.toString()}`
    : url;

  return apiRequest<T>(fullUrl, { method: 'GET' });
};

// POST request helper
export const apiPost = async <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

// PUT request helper
export const apiPut = async <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

// PATCH request helper
export const apiPatch = async <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
};

// DELETE request helper
export const apiDelete = async <T = any>(url: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, { method: 'DELETE' });
};

// Upload helper para arquivos
export const apiUpload = async <T = any>(
  url: string, 
  formData: FormData
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, {
    method: 'POST',
    body: formData,
    headers: {}, // Remove Content-Type para FormData
  });
};

// Retry helper para requisições que podem falhar
export const apiRetry = async <T = any>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Aguardar antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
};

// Batch requests helper
export const apiBatch = async <T = any>(
  requests: Array<() => Promise<ApiResponse<T>>>
): Promise<Array<ApiResponse<T> | Error>> => {
  return Promise.allSettled(
    requests.map(request => request())
  ).then(results => 
    results.map(result => 
      result.status === 'fulfilled' ? result.value : result.reason
    )
  );
};

// Cache helper para requisições
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 5 minutos por padrão
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}

export const apiCache = new ApiCache();

// Cached GET request
export const apiGetCached = async <T = any>(
  url: string, 
  params?: Record<string, any>,
  ttl?: number
): Promise<ApiResponse<T>> => {
  const cacheKey = `${url}${params ? JSON.stringify(params) : ''}`;
  const cached = apiCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const response = await apiGet<T>(url, params);
  
  if (response.success) {
    apiCache.set(cacheKey, response, ttl);
  }

  return response;
};