/**
 * Request Logging Middleware
 */

import { Request, Response, NextFunction } from 'express';

interface RequestLog {
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  clientId?: string;
  error?: string;
}

const logs: RequestLog[] = [];
const MAX_LOGS = 1000; // Keep last 1000 requests in memory

/**
 * Logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const clientId = req.headers['x-api-key'] as string || 
                     req.headers['authorization']?.replace('Bearer ', '') || 
                     req.ip || 
                     'unknown';

  // Override res.json to capture response
  const originalJson = res.json.bind(res);
  res.json = function(body: any) {
    const responseTime = Date.now() - startTime;
    
    const log: RequestLog = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime,
      timestamp: new Date().toISOString(),
      clientId: clientId.substring(0, 20) // Truncate for privacy
    };

    if (res.statusCode >= 400) {
      log.error = body.error || body.message || 'Unknown error';
    }

    // Add to logs (keep only last MAX_LOGS)
    logs.push(log);
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }

    // Console log for development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${log.method}] ${log.path} - ${log.statusCode} (${log.responseTime}ms)`);
    }

    return originalJson(body);
  };

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
    errorRate: totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0,
    avgResponseTime: Math.round(avgResponseTime),
    statusCodes
  };
}

