/**
 * CORS Configuration
 * 
 * Allows S2S_Console (localhost:5001) to call CMS_Backend APIs
 */

export function getCorsHeaders(origin?: string | null): Record<string, string> {
  // Allow requests from S2S_Console and common development ports
  const allowedOrigins = [
    // Development
    'http://localhost:5001',
    'http://localhost:3001',
    'http://localhost:3002', // Legacy console port
    'http://localhost:3000', // Next.js default
    'http://127.0.0.1:5001',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:3000',
    // Production - from environment variable
    process.env.NEXT_PUBLIC_CONSOLE_URL,
    // Common Vercel patterns
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    // Allow any Vercel preview/deployment URL (for Console)
    // This is safe because Console is read-only presentation layer
    origin && origin.includes('.vercel.app') ? origin : null,
  ].filter((url): url is string => Boolean(url)); // Remove null/undefined

  // In development, allow any localhost origin
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = origin && (
    origin.startsWith('http://localhost:') || 
    origin.startsWith('http://127.0.0.1:')
  );

  // Check if origin is allowed
  const isAllowed = origin && (
    allowedOrigins.includes(origin) || 
    (isDevelopment && isLocalhost)
  );

  const allowedOrigin = isAllowed 
    ? origin! 
    : (isDevelopment && isLocalhost && origin) 
      ? origin 
      : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function handleCorsPreflight(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin');
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(origin),
    });
  }
  return null;
}

