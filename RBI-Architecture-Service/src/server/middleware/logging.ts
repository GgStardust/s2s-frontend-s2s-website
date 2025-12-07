/**
 * Structured JSON Logging Middleware
 * 
 * Provides structured logging with log levels, request ID tracking, and performance metrics
 */

import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface StructuredLog {
  level: LogLevel;
  timestamp: string;
  message: string;
  requestId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  responseTime?: number;
  clientId?: string;
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };
  metadata?: Record<string, any>;
}

const logs: StructuredLog[] = [];
const MAX_LOGS = 1000;
const LOG_LEVEL = (process.env.LOG_LEVEL || 'info').toLowerCase() as LogLevel;

/**
 * Check if log level should be logged
 */
function shouldLog(level: LogLevel): boolean {
  const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
  const currentLevelIndex = levels.indexOf(LOG_LEVEL);
  const messageLevelIndex = levels.indexOf(level);
  return messageLevelIndex >= currentLevelIndex;
}

/**
 * Generate or retrieve request ID
 */
function getRequestId(req: Request): string {
  let requestId = req.headers['x-request-id'] as string;
  if (!requestId) {
    requestId = randomUUID();
    req.headers['x-request-id'] = requestId;
  }
  return requestId;
}

/**
 * Structured logger
 */
export class Logger {
  private static log(level: LogLevel, message: string, metadata?: Record<string, any>, req?: Request): void {
    if (!shouldLog(level)) return;

    const log: StructuredLog = {
      level,
      timestamp: new Date().toISOString(),
      message,
      ...(req && {
        requestId: getRequestId(req),
        method: req.method,
        path: req.path
      }),
      ...(metadata && { metadata })
    };

    // Output as JSON for structured logging
    const output = JSON.stringify(log);
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.DEBUG:
        console.debug(output);
        break;
      default:
        console.log(output);
    }

    // Store in memory for metrics
    logs.push(log);
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }
  }

  static debug(message: string, metadata?: Record<string, any>, req?: Request): void {
    this.log(LogLevel.DEBUG, message, metadata, req);
  }

  static info(message: string, metadata?: Record<string, any>, req?: Request): void {
    this.log(LogLevel.INFO, message, metadata, req);
  }

  static warn(message: string, metadata?: Record<string, any>, req?: Request): void {
    this.log(LogLevel.WARN, message, metadata, req);
  }

  static error(message: string, error?: Error, metadata?: Record<string, any>, req?: Request): void {
    const errorMetadata = {
      ...metadata,
      ...(error && {
        error: {
          message: error.message,
          ...(error.stack && { stack: error.stack }),
          ...('code' in error && { code: (error as any).code })
        }
      })
    };
    this.log(LogLevel.ERROR, message, errorMetadata, req);
  }
}

/**
 * Request logging middleware with request ID tracking
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const requestId = getRequestId(req);
  const apiKey = req.headers['x-api-key'];
  const clientId = (Array.isArray(apiKey) ? apiKey[0] : apiKey) || req.ip || 'anonymous';
  
  // Set request ID in response header
  res.setHeader('x-request-id', requestId);
  
  Logger.debug('Request started', {
    method: req.method,
    path: req.path,
    clientId
  }, req);
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const logLevel = res.statusCode >= 500 ? LogLevel.ERROR :
                     res.statusCode >= 400 ? LogLevel.WARN :
                     LogLevel.INFO;
    
    // Use appropriate log method based on level
    if (logLevel === LogLevel.ERROR) {
      Logger.error('Request completed', undefined, {
        statusCode: res.statusCode,
        responseTime,
        clientId
      }, req);
    } else if (logLevel === LogLevel.WARN) {
      Logger.warn('Request completed', {
        statusCode: res.statusCode,
        responseTime,
        clientId
      }, req);
    } else {
      Logger.info('Request completed', {
        statusCode: res.statusCode,
        responseTime,
        clientId
      }, req);
    }
  });
  
  next();
}

/**
 * Get recent logs
 */
export function getRecentLogs(limit: number = 100): StructuredLog[] {
  return logs.slice(-limit);
}

/**
 * Get logs by level
 */
export function getLogsByLevel(level: LogLevel): StructuredLog[] {
  return logs.filter(log => log.level === level);
}

/**
 * Get logs by status code
 */
export function getLogsByStatus(statusCode: number): StructuredLog[] {
  return logs.filter(log => log.statusCode === statusCode);
}

/**
 * Get error logs
 */
export function getErrorLogs(): StructuredLog[] {
  return logs.filter(log => log.level === LogLevel.ERROR || (log.statusCode && log.statusCode >= 500));
}

/**
 * Get metrics with enhanced statistics
 */
export function getMetrics() {
  const totalRequests = logs.length;
  const errorCount = logs.filter(log => log.level === LogLevel.ERROR || (log.statusCode && log.statusCode >= 500)).length;
  const warnCount = logs.filter(log => log.level === LogLevel.WARN || (log.statusCode && log.statusCode >= 400 && log.statusCode < 500)).length;
  const successCount = logs.filter(log => log.statusCode && log.statusCode < 400).length;
  const errorRate = totalRequests > 0 ? errorCount / totalRequests : 0;
  
  const responseTimes = logs
    .filter(log => log.responseTime !== undefined)
    .map(log => log.responseTime!);
  
  const avgResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    : 0;
  
  const p50 = responseTimes.length > 0
    ? responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.5)]
    : 0;
  
  const p95 = responseTimes.length > 0
    ? responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)]
    : 0;
  
  const p99 = responseTimes.length > 0
    ? responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.99)]
    : 0;
  
  const statusCodes: { [code: number]: number } = {};
  logs.forEach(log => {
    if (log.statusCode) {
      statusCodes[log.statusCode] = (statusCodes[log.statusCode] || 0) + 1;
    }
  });
  
  return {
    totalRequests,
    errorCount,
    warnCount,
    successCount,
    errorRate,
    avgResponseTime,
    p50,
    p95,
    p99,
    statusCodes
  };
}
