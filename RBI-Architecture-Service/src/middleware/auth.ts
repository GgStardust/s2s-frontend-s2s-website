/**
 * API Key Authentication Middleware
 */

import { Request, Response, NextFunction } from 'express';

const API_KEY_HEADER = 'x-api-key';
const API_KEY = process.env.RBI_API_KEY || process.env.API_KEY;

/**
 * Validate API key from request headers
 */
export function authenticateApiKey(req: Request, res: Response, next: NextFunction) {
  // Skip auth for health check endpoint
  if (req.path === '/health' || req.path === '/field/status') {
    return next();
  }

  // If no API key is configured, allow all requests (development mode)
  if (!API_KEY) {
    console.warn('⚠️  No API key configured - allowing all requests (development mode)');
    return next();
  }

  const providedKey = req.headers[API_KEY_HEADER] || req.headers['authorization']?.replace('Bearer ', '');

  if (!providedKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key required. Provide API key in x-api-key header or Authorization header.'
    });
  }

  if (providedKey !== API_KEY) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid API key'
    });
  }

  next();
}

