/**
 * Defensive programming utilities to prevent common runtime errors
 */

// Safe array operations with null/undefined checks
export const safeArray = {
  /**
   * Safe map operation that handles null/undefined arrays
   */
  map: <T, R>(array: T[] | null | undefined, callback: (item: T, index: number) => R): R[] => {
    if (!Array.isArray(array)) {
      console.warn('safeArray.map: Invalid array provided', array);
      return [];
    }
    try {
      return array.map(callback);
    } catch (error) {
      console.error('safeArray.map: Error during mapping', error);
      return [];
    }
  },

  /**
   * Safe filter operation that handles null/undefined arrays
   */
  filter: <T>(array: T[] | null | undefined, callback: (item: T, index: number) => boolean): T[] => {
    if (!Array.isArray(array)) {
      console.warn('safeArray.filter: Invalid array provided', array);
      return [];
    }
    try {
      return array.filter(callback);
    } catch (error) {
      console.error('safeArray.filter: Error during filtering', error);
      return [];
    }
  },

  /**
   * Safe find operation that handles null/undefined arrays
   */
  find: <T>(array: T[] | null | undefined, callback: (item: T, index: number) => boolean): T | undefined => {
    if (!Array.isArray(array)) {
      console.warn('safeArray.find: Invalid array provided', array);
      return undefined;
    }
    try {
      return array.find(callback);
    } catch (error) {
      console.error('safeArray.find: Error during finding', error);
      return undefined;
    }
  },

  /**
   * Safe forEach operation that handles null/undefined arrays
   */
  forEach: <T>(array: T[] | null | undefined, callback: (item: T, index: number) => void): void => {
    if (!Array.isArray(array)) {
      console.warn('safeArray.forEach: Invalid array provided', array);
      return;
    }
    try {
      array.forEach(callback);
    } catch (error) {
      console.error('safeArray.forEach: Error during iteration', error);
    }
  },

  /**
   * Safe reduce operation that handles null/undefined arrays
   */
  reduce: <T, R>(
    array: T[] | null | undefined, 
    callback: (acc: R, item: T, index: number) => R, 
    initialValue: R
  ): R => {
    if (!Array.isArray(array)) {
      console.warn('safeArray.reduce: Invalid array provided', array);
      return initialValue;
    }
    try {
      return array.reduce(callback, initialValue);
    } catch (error) {
      console.error('safeArray.reduce: Error during reduction', error);
      return initialValue;
    }
  }
};

// Safe object property access
export const safeGet = {
  /**
   * Safe nested property access with default value
   */
  property: <T>(obj: any, path: string, defaultValue: T): T => {
    if (!obj || typeof obj !== 'object') {
      return defaultValue;
    }
    
    try {
      const keys = path.split('.');
      let current = obj;
      
      for (const key of keys) {
        if (current === null || current === undefined || !(key in current)) {
          return defaultValue;
        }
        current = current[key];
      }
      
      return current !== undefined ? current : defaultValue;
    } catch (error) {
      console.error('safeGet.property: Error accessing property', error);
      return defaultValue;
    }
  },

  /**
   * Safe number conversion with default value
   */
  number: (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return !isNaN(parsed) ? parsed : defaultValue;
    }
    
    return defaultValue;
  },

  /**
   * Safe string conversion with default value
   */
  string: (value: any, defaultValue: string = ''): string => {
    if (typeof value === 'string') {
      return value;
    }
    
    if (value === null || value === undefined) {
      return defaultValue;
    }
    
    try {
      return String(value);
    } catch (error) {
      console.error('safeGet.string: Error converting to string', error);
      return defaultValue;
    }
  },

  /**
   * Safe array access with default value
   */
  array: <T>(value: any, defaultValue: T[] = []): T[] => {
    return Array.isArray(value) ? value : defaultValue;
  }
};

// Error handling wrapper for async operations
export const safeAsync = {
  /**
   * Wrapper for async operations with error handling
   */
  execute: async <T>(
    operation: () => Promise<T>,
    fallbackValue: T,
    errorHandler?: (error: Error) => void
  ): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('safeAsync.execute: Operation failed', err);
      
      if (errorHandler) {
        errorHandler(err);
      }
      
      // Report to Sentry if available
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(err);
      }
      
      return fallbackValue;
    }
  }
};

// Safe DOM operations
export const safeDom = {
  /**
   * Safe querySelector with null check
   */
  querySelector: (selector: string): Element | null => {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.error('safeDom.querySelector: Error selecting element', error);
      return null;
    }
  },

  /**
   * Safe event listener removal
   */
  removeEventListener: (
    element: Element | null, 
    event: string, 
    handler: EventListener
  ): void => {
    try {
      if (element && typeof element.removeEventListener === 'function') {
        element.removeEventListener(event, handler);
      }
    } catch (error) {
      console.error('safeDom.removeEventListener: Error removing listener', error);
    }
  }
};

// Safe math operations
export const safeMath = {
  /**
   * Safe division with zero check
   */
  divide: (a: number, b: number, defaultValue: number = 0): number => {
    if (b === 0) {
      console.warn('safeMath.divide: Division by zero attempted');
      return defaultValue;
    }
    return a / b;
  },

  /**
   * Safe percentage calculation
   */
  percentage: (value: number, total: number, defaultValue: number = 0): number => {
    if (total === 0) {
      return defaultValue;
    }
    return Math.round((value / total) * 100);
  }
};

// Higher-order function to add error handling to any function
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  fallbackValue: ReturnType<T>,
  errorHandler?: (error: Error) => void
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    try {
      return fn(...args);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('withErrorHandling: Function execution failed', err);
      
      if (errorHandler) {
        errorHandler(err);
      }
      
      return fallbackValue;
    }
  }) as T;
}

// React hook for safe state updates
export function useSafeState<T>(initialValue: T): [T, (newValue: T | ((prev: T) => T)) => void] {
  const [state, setState] = React.useState<T>(initialValue);
  
  const safeSetState = React.useCallback((newValue: T | ((prev: T) => T)) => {
    try {
      setState(newValue);
    } catch (error) {
      console.error('useSafeState: Error updating state', error);
      
      // Report to Sentry if available
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error);
      }
    }
  }, []);
  
  return [state, safeSetState];
}

// Import React for the hook
import React from 'react';