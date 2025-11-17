/**
 * Rate Limiting Middleware
 */
import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT || '100', 10); // requests per window
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10); // 1 minute default

/**
 * Rate limiting middleware
 */
export function rateLimit(req: Request, res: Response, next: NextFunction): void | Response {
  const clientId = req.headers['x-api-key'] || req.ip || 'anonymous';
  const now = Date.now();
  
  const record = store[clientId];
  
  if (!record || now > record.resetTime) {
    // New window
    store[clientId] = {
      count: 1,
      resetTime: now + WINDOW_MS
    };
    return next();
  }
  
  if (record.count >= RATE_LIMIT) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Limit: ${RATE_LIMIT} requests per ${WINDOW_MS}ms`
    });
  }
  
  record.count++;
  next();
}

