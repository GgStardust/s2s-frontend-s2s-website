/**
 * Enhanced Error Handling Middleware
 * 
 * Provides structured error types and consistent error response format
 */

import { Request, Response, NextFunction } from 'express';

export enum ErrorCode {
  // Client Errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  
  // RBI-Specific Errors
  FIELD_COMPUTATION_ERROR = 'FIELD_COMPUTATION_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  COHERENCE_ERROR = 'COHERENCE_ERROR'
}

export interface AppError extends Error {
  statusCode: number;
  code: ErrorCode;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
}

export class ApiError extends Error implements AppError {
  statusCode: number;
  code: ErrorCode;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
    
    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create standardized error responses
 */
export function createErrorResponse(
  error: AppError | Error,
  req?: Request
): {
  error: string;
  code: string;
  statusCode: number;
  timestamp: string;
  requestId?: string;
  details?: Record<string, any>;
  stack?: string;
} {
  const isAppError = 'statusCode' in error && 'code' in error;
  const appError = isAppError ? error as AppError : null;
  
  const requestId = appError?.requestId || 
                   (req && (req.headers['x-request-id'] as string)) ||
                   undefined;

  return {
    error: error.message || 'Internal Server Error',
    code: appError?.code || ErrorCode.INTERNAL_SERVER_ERROR,
    statusCode: appError?.statusCode || 500,
    timestamp: appError?.timestamp || new Date().toISOString(),
    ...(requestId && { requestId }),
    ...(appError?.details && { details: appError.details }),
    ...(process.env.NODE_ENV === 'development' && error.stack && { stack: error.stack })
  };
}

/**
 * Async handler wrapper with error tracking
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Attach request ID if available
      if (error instanceof ApiError && !error.requestId) {
        const requestId = req.headers['x-request-id'] as string;
        if (requestId) {
          error.requestId = requestId;
        }
      }
      next(error);
    });
  };
}

/**
 * Enhanced error handler middleware
 */
export function errorHandler(
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errorResponse = createErrorResponse(err, req);
  
  // Log error with structured format
  const logData = {
    error: {
      message: err.message,
      code: errorResponse.code,
      statusCode: errorResponse.statusCode,
      path: req.path,
      method: req.method,
      requestId: errorResponse.requestId,
      ...(errorResponse.details && { details: errorResponse.details })
    },
    ...(process.env.NODE_ENV === 'development' && err.stack && { stack: err.stack })
  };
  
  if (errorResponse.statusCode >= 500) {
    console.error('Server Error:', JSON.stringify(logData, null, 2));
  } else {
    console.warn('Client Error:', JSON.stringify(logData, null, 2));
  }
  
  res.status(errorResponse.statusCode).json(errorResponse);
}

/**
 * Helper functions to create common errors
 */
export const Errors = {
  badRequest: (message: string, details?: Record<string, any>, requestId?: string) =>
    new ApiError(message, 400, ErrorCode.BAD_REQUEST, details, requestId),
  
  unauthorized: (message: string = 'Unauthorized', requestId?: string) =>
    new ApiError(message, 401, ErrorCode.UNAUTHORIZED, undefined, requestId),
  
  forbidden: (message: string = 'Forbidden', requestId?: string) =>
    new ApiError(message, 403, ErrorCode.FORBIDDEN, undefined, requestId),
  
  notFound: (message: string = 'Resource not found', requestId?: string) =>
    new ApiError(message, 404, ErrorCode.NOT_FOUND, undefined, requestId),
  
  rateLimitExceeded: (message: string = 'Rate limit exceeded', requestId?: string) =>
    new ApiError(message, 429, ErrorCode.RATE_LIMIT_EXCEEDED, undefined, requestId),
  
  validationError: (message: string, details?: Record<string, any>, requestId?: string) =>
    new ApiError(message, 400, ErrorCode.VALIDATION_ERROR, details, requestId),
  
  internalError: (message: string = 'Internal server error', details?: Record<string, any>, requestId?: string) =>
    new ApiError(message, 500, ErrorCode.INTERNAL_SERVER_ERROR, details, requestId),
  
  fieldComputationError: (message: string, details?: Record<string, any>, requestId?: string) =>
    new ApiError(message, 500, ErrorCode.FIELD_COMPUTATION_ERROR, details, requestId),
  
  validationFailed: (message: string, details?: Record<string, any>, requestId?: string) =>
    new ApiError(message, 422, ErrorCode.VALIDATION_FAILED, details, requestId)
};
