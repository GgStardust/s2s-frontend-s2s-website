/**
 * API Key Authentication Middleware
 */
import { Request, Response, NextFunction } from 'express';

/**
 * Validate API key from request headers
 * Optional authentication - can be disabled by not setting RBI_API_KEY env var
 */
export function authenticateApiKey(req: Request, res: Response, next: NextFunction): void | Response {
  const apiKey = process.env.RBI_API_KEY;
  
  // If no API key is configured, skip authentication
  if (!apiKey) {
    return next();
  }
  
  const providedKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!providedKey || providedKey !== apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing API key'
    });
  }
  
  next();
}

