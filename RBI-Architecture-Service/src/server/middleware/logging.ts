/**
 * Request Logging Middleware
 */
import { Request, Response, NextFunction } from 'express';

export interface RequestLog {
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  clientId?: string;
  error?: string;
}

const logs: RequestLog[] = [];
const MAX_LOGS = 1000;

/**
 * Logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const clientId = req.headers['x-api-key'] || req.ip || 'anonymous';
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const log: RequestLog = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime,
      timestamp: new Date().toISOString(),
      clientId: clientId as string
    };
    
    logs.push(log);
    
    // Keep only recent logs
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }
  });
  
  next();
}

/**
 * Get recent logs
 */
export function getRecentLogs(limit: number = 100): RequestLog[] {
  return logs.slice(-limit);
}

/**
 * Get logs by status code
 */
export function getLogsByStatus(statusCode: number): RequestLog[] {
  return logs.filter(log => log.statusCode === statusCode);
}

/**
 * Get error logs
 */
export function getErrorLogs(): RequestLog[] {
  return logs.filter(log => log.statusCode >= 400);
}

/**
 * Get metrics
 */
export function getMetrics() {
  const totalRequests = logs.length;
  const errorCount = logs.filter(log => log.statusCode >= 400).length;
  const successCount = logs.filter(log => log.statusCode < 400).length;
  const errorRate = totalRequests > 0 ? errorCount / totalRequests : 0;
  const avgResponseTime = logs.length > 0
    ? logs.reduce((sum, log) => sum + log.responseTime, 0) / logs.length
    : 0;
  
  const statusCodes: { [code: number]: number } = {};
  logs.forEach(log => {
    statusCodes[log.statusCode] = (statusCodes[log.statusCode] || 0) + 1;
  });
  
  return {
    totalRequests,
    errorCount,
    successCount,
    errorRate,
    avgResponseTime,
    statusCodes
  };
}

