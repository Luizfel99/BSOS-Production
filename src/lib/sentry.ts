import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      
      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Error Filtering
      beforeSend(event) {
        // Filter out development errors in production
        if (process.env.NODE_ENV === 'production') {
          // Filter out common non-critical errors
          if (event.exception?.values?.[0]?.type === 'ChunkLoadError') {
            return null;
          }
          
          // Filter out network errors
          if (event.exception?.values?.[0]?.value?.includes('Failed to fetch')) {
            return null;
          }
        }
        
        return event;
      },
      
      // Debug mode for development
      debug: process.env.NODE_ENV === 'development',
      
      // Release tracking
      release: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    });
  }
}

// Error capture utilities
export function captureError(error: Error, context?: Record<string, any>) {
  console.error('Captured error:', error);
  
  if (SENTRY_DSN) {
    Sentry.captureException(error, {
      contexts: {
        additional: context,
      },
    });
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  console.log(`[${level.toUpperCase()}] ${message}`);
  
  if (SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  }
}

export function setUserContext(user: { id: string; email?: string; role?: string }) {
  if (SENTRY_DSN) {
    Sentry.setUser(user);
  }
}

export function addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error') {
  if (SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message,
      category: category || 'user-action',
      level: level || 'info',
      timestamp: Date.now() / 1000,
    });
  }
}

// Performance monitoring
export function withSentryTransaction<T>(
  name: string, 
  operation: string, 
  fn: () => T
): T {
  if (SENTRY_DSN) {
    return Sentry.withActiveSpan(Sentry.startInactiveSpan({ name, op: operation }), fn);
  }
  return fn();
}

export { Sentry };