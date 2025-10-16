/**
 * API Error handling utilities
 * Provides consistent error shapes and try/catch wrapper
 */

import { NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Standard API error response shape
export interface ApiError {
  error: string;
  message: string;
  code?: string;
  details?: unknown;
  timestamp: string;
}

// Standard API success response shape
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

// Helper to create error responses
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: unknown
): NextResponse<ApiError> {
  const error: ApiError = {
    error: getErrorType(statusCode),
    message,
    code,
    details: process.env.NODE_ENV === 'development' ? details : undefined,
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(error, { status: statusCode });
}

// Helper to create success responses
export function createSuccessResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(response, { status: statusCode });
}

// Get error type from status code
function getErrorType(statusCode: number): string {
  switch (statusCode) {
    case 400: return 'Bad Request';
    case 401: return 'Unauthorized';
    case 403: return 'Forbidden';
    case 404: return 'Not Found';
    case 409: return 'Conflict';
    case 422: return 'Validation Error';
    case 429: return 'Rate Limited';
    case 500: return 'Internal Server Error';
    case 503: return 'Service Unavailable';
    default: return 'Unknown Error';
  }
}

// Handle Prisma errors
export function handlePrismaError(error: unknown): NextResponse<ApiError> {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return createErrorResponse(
          'A record with this data already exists',
          409,
          'DUPLICATE_RECORD',
          { field: error.meta?.target }
        );
      case 'P2025':
        return createErrorResponse(
          'Record not found',
          404,
          'RECORD_NOT_FOUND'
        );
      case 'P2003':
        return createErrorResponse(
          'Foreign key constraint failed',
          400,
          'FOREIGN_KEY_CONSTRAINT'
        );
      case 'P2014':
        return createErrorResponse(
          'The change you are trying to make would violate the required relation',
          400,
          'RELATION_VIOLATION'
        );
      default:
        return createErrorResponse(
          'Database operation failed',
          500,
          error.code,
          error.message
        );
    }
  }

  // Generic error handling
  if (error instanceof Error) {
    return createErrorResponse(
      error.message,
      500,
      'UNKNOWN_ERROR',
      error.stack
    );
  }

  return createErrorResponse(
    'An unknown error occurred',
    500,
    'UNKNOWN_ERROR'
  );
}

// API route wrapper with error handling
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Error:', error);
      return handlePrismaError(error);
    }
  };
}

// Validation helper
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): NextResponse<ApiError> | null {
  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null || data[field] === ''
  );

  if (missingFields.length > 0) {
    return createErrorResponse(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      'MISSING_REQUIRED_FIELDS',
      { missingFields }
    );
  }

  return null;
}

// Rate limiting helper (basic implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): NextResponse<ApiError> | null {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean old entries
  for (const [key, value] of requestCounts.entries()) {
    if (value.resetTime < windowStart) {
      requestCounts.delete(key);
    }
  }

  const current = requestCounts.get(identifier) || { count: 0, resetTime: now + windowMs };
  
  if (current.count >= maxRequests && current.resetTime > now) {
    return createErrorResponse(
      'Rate limit exceeded',
      429,
      'RATE_LIMITED',
      { retryAfter: Math.ceil((current.resetTime - now) / 1000) }
    );
  }

  requestCounts.set(identifier, {
    count: current.count + 1,
    resetTime: current.resetTime > now ? current.resetTime : now + windowMs
  });

  return null;
}