/**
 * Enhanced Rate Limiting Middleware
 * 
 * Provides per-API-key rate limiting with configurable limits and rate limit headers
 */

import { Request, Response, NextFunction } from 'express';
import { Errors } from './error-handler.js';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    windowStart: number;
  };
}

interface RateLimitConfig {
  limit: number;
  windowMs: number;
  perApiKey?: boolean;
}

const store: RateLimitStore = {};
const ENABLE_RATE_LIMIT = process.env.ENABLE_RATE_LIMIT === 'true'; // Disabled by default
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT || '100', 10); // requests per window
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10); // 1 minute default

// Per-API-key limits (can be configured via environment or database)
const API_KEY_LIMITS: Record<string, RateLimitConfig> = {};

/**
 * Get rate limit configuration for a client
 */
function getRateLimitConfig(clientId: string): RateLimitConfig {
  // Check for per-API-key configuration
  if (API_KEY_LIMITS[clientId]) {
    return API_KEY_LIMITS[clientId];
  }
  
  // Default configuration
  return {
    limit: RATE_LIMIT,
    windowMs: WINDOW_MS,
    perApiKey: false
  };
}

/**
 * Set custom rate limit for an API key
 */
export function setApiKeyLimit(apiKey: string, limit: number, windowMs: number = WINDOW_MS): void {
  API_KEY_LIMITS[apiKey] = {
    limit,
    windowMs,
    perApiKey: true
  };
}

/**
 * Enhanced rate limiting middleware with headers
 */
export function rateLimit(req: Request, res: Response, next: NextFunction): void | Response {
  // Skip rate limiting if disabled
  if (!ENABLE_RATE_LIMIT) {
    return next();
  }
  
  const apiKey = req.headers['x-api-key'];
  const clientId = (Array.isArray(apiKey) ? apiKey[0] : apiKey) || req.ip || 'anonymous';
  const config = getRateLimitConfig(clientId);
  const now = Date.now();
  
  const record = store[clientId];
  
  // Initialize or reset window
  if (!record || now > record.resetTime) {
    store[clientId] = {
      count: 1,
      resetTime: now + config.windowMs,
      windowStart: now
    };
    
    // Set rate limit headers
    res.setHeader('x-ratelimit-limit', config.limit.toString());
    res.setHeader('x-ratelimit-remaining', (config.limit - 1).toString());
    res.setHeader('x-ratelimit-reset', new Date(now + config.windowMs).toISOString());
    
    return next();
  }
  
  // Check if limit exceeded
  if (record.count >= config.limit) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    
    // Set rate limit headers even on rejection
    res.setHeader('x-ratelimit-limit', config.limit.toString());
    res.setHeader('x-ratelimit-remaining', '0');
    res.setHeader('x-ratelimit-reset', new Date(record.resetTime).toISOString());
    res.setHeader('retry-after', retryAfter.toString());
    
    const requestId = req.headers['x-request-id'] as string;
    throw Errors.rateLimitExceeded(
      `Rate limit exceeded. Limit: ${config.limit} requests per ${config.windowMs}ms. Retry after ${retryAfter}s`,
      requestId
    );
  }
  
  // Increment count
  record.count++;
  
  // Set rate limit headers
  res.setHeader('x-ratelimit-limit', config.limit.toString());
  res.setHeader('x-ratelimit-remaining', (config.limit - record.count).toString());
  res.setHeader('x-ratelimit-reset', new Date(record.resetTime).toISOString());
  
  next();
}

/**
 * Clean up expired rate limit records
 */
export function cleanExpiredRateLimits(): number {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [clientId, record] of Object.entries(store)) {
    if (now > record.resetTime) {
      delete store[clientId];
      cleaned++;
    }
  }
  
  return cleaned;
}

/**
 * Get rate limit statistics
 */
export function getRateLimitStats(): {
  activeClients: number;
  totalClients: number;
  customLimits: number;
} {
  const now = Date.now();
  const activeClients = Object.values(store).filter(record => now <= record.resetTime).length;
  
  return {
    activeClients,
    totalClients: Object.keys(store).length,
    customLimits: Object.keys(API_KEY_LIMITS).length
  };
}

// Clean up expired records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cleanExpiredRateLimits();
  }, 5 * 60 * 1000);
}
