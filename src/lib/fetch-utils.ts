/**
 * Safe JSON fetch utility to prevent "Unexpected token '<'" errors
 */
export async function safeFetch(url: string, options?: RequestInit): Promise<any> {
  try {
    const response = await fetch(url, options);
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response has JSON content
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Response is not JSON:', text);
      throw new Error('Response is not JSON');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

/**
 * Safe JSON fetch with default error handling
 */
export async function safeFetchWithDefaults(url: string, options?: RequestInit, defaultValue: any = null): Promise<any> {
  try {
    return await safeFetch(url, options);
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    return defaultValue;
  }
}