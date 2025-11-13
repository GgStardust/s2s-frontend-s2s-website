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

// Configuration
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'); // 1 minute default
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'); // 100 requests per window

/**
 * Get client identifier from request
 */
function getClientId(req: Request): string {
  // Use API key if available, otherwise use IP address
  const apiKey = req.headers['x-api-key'] as string || 
                 req.headers['authorization']?.replace('Bearer ', '') || 
                 req.ip || 
                 'unknown';
  return apiKey;
}

/**
 * Rate limiting middleware
 */
export function rateLimit(req: Request, res: Response, next: NextFunction) {
  // Skip rate limiting for health check endpoints
  if (req.path === '/health' || req.path === '/field/status') {
    return next();
  }

  const clientId = getClientId(req);
  const now = Date.now();

  // Clean up expired entries
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });

  // Get or create client record
  let clientRecord = store[clientId];

  if (!clientRecord || clientRecord.resetTime < now) {
    // New window
    clientRecord = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    };
    store[clientId] = clientRecord;
  }

  // Increment count
  clientRecord.count++;

  // Check limit
  if (clientRecord.count > RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((clientRecord.resetTime - now) / 1000);
    
    res.setHeader('Retry-After', retryAfter.toString());
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', new Date(clientRecord.resetTime).toISOString());

    return res.status(429).json({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Maximum ${RATE_LIMIT_MAX_REQUESTS} requests per ${RATE_LIMIT_WINDOW_MS / 1000} seconds.`,
      retryAfter
    });
  }

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
  res.setHeader('X-RateLimit-Remaining', (RATE_LIMIT_MAX_REQUESTS - clientRecord.count).toString());
  res.setHeader('X-RateLimit-Reset', new Date(clientRecord.resetTime).toISOString());

  next();
}

