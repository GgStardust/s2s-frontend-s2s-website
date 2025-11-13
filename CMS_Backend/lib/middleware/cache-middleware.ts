import { NextRequest, NextResponse } from 'next/server';
import { cache, CacheKeys, CacheTTL } from '@/lib/cache/redis';
import { recordApiRequest, recordCacheHit, recordCacheMiss } from '@/lib/monitoring/metrics';

export interface CacheMiddlewareOptions {
  ttl?: number;
  keyGenerator?: (request: NextRequest) => string;
  skipCache?: (request: NextRequest) => boolean;
}

export function withCache(options: CacheMiddlewareOptions = {}) {
  return function cacheMiddleware(
    handler: (request: NextRequest) => Promise<NextResponse>
  ) {
    return async function cachedHandler(request: NextRequest): Promise<NextResponse> {
      const startTime = Date.now();
      const method = request.method;
      const url = new URL(request.url);
      const endpoint = url.pathname;
      
      // Skip cache for non-GET requests or if skipCache returns true
      if (method !== 'GET' || (options.skipCache && options.skipCache(request))) {
        const response = await handler(request);
        const duration = (Date.now() - startTime) / 1000;
        recordApiRequest(method, endpoint, response.status, duration);
        return response;
      }
      
      // Generate cache key
      const cacheKey = options.keyGenerator 
        ? options.keyGenerator(request)
        : `${endpoint}:${url.searchParams.toString()}`;
      
      try {
        // Try to get from cache
        const cached = await cache.get(cacheKey);
        
        if (cached) {
          // Cache hit
          recordCacheHit(cacheKey);
          const duration = (Date.now() - startTime) / 1000;
          recordApiRequest(method, endpoint, 200, duration);
          
          return NextResponse.json(cached, {
            headers: {
              'X-Cache': 'HIT',
              'X-Cache-Key': cacheKey,
            },
          });
        }
        
        // Cache miss - execute handler
        recordCacheMiss(cacheKey);
        const response = await handler(request);
        
        // Only cache successful responses
        if (response.status === 200) {
          const responseData = await response.json();
          const ttl = options.ttl || CacheTTL.MEDIUM;
          
          await cache.set(cacheKey, responseData, ttl);
          
          const duration = (Date.now() - startTime) / 1000;
          recordApiRequest(method, endpoint, response.status, duration);
          
          return NextResponse.json(responseData, {
            status: response.status,
            headers: {
              'X-Cache': 'MISS',
              'X-Cache-Key': cacheKey,
            },
          });
        }
        
        const duration = (Date.now() - startTime) / 1000;
        recordApiRequest(method, endpoint, response.status, duration);
        
        return response;
        
      } catch (error) {
        console.error('Cache middleware error:', error);
        
        // Fallback to handler without cache
        const response = await handler(request);
        const duration = (Date.now() - startTime) / 1000;
        recordApiRequest(method, endpoint, response.status, duration);
        
        return response;
      }
    };
  };
}

// Predefined cache configurations for common endpoints
export const cacheConfigs = {
  // Content files - cache for 30 minutes
  contentFiles: {
    ttl: CacheTTL.MEDIUM,
    keyGenerator: (request: NextRequest) => {
      const url = new URL(request.url);
      const filters = {
        status: url.searchParams.get('status'),
        type: url.searchParams.get('type'),
      };
      return CacheKeys.contentFiles(filters);
    },
  },
  
  // Books - cache for 1 hour
  books: {
    ttl: CacheTTL.LONG,
    keyGenerator: (request: NextRequest) => {
      const url = new URL(request.url);
      const filters = {
        status: url.searchParams.get('status'),
        type: url.searchParams.get('type'),
      };
      return CacheKeys.books(filters);
    },
  },
  
  // Chapters - cache for 1 hour
  chapters: {
    ttl: CacheTTL.LONG,
    keyGenerator: (request: NextRequest) => {
      const url = new URL(request.url);
      const bookId = url.searchParams.get('book_id');
      return CacheKeys.chapters(bookId || undefined);
    },
  },
  
  // Orbs - cache for 2 hours (rarely changes)
  orbs: {
    ttl: CacheTTL.VERY_LONG,
    keyGenerator: () => CacheKeys.orbs(),
  },
  
  // Resonance feed - cache for 5 minutes (frequently updated)
  resonanceFeed: {
    ttl: CacheTTL.SHORT,
    keyGenerator: (request: NextRequest) => {
      const url = new URL(request.url);
      const params = {
        limit: url.searchParams.get('limit'),
        type: url.searchParams.get('type'),
        min_priority: url.searchParams.get('min_priority'),
      };
      return CacheKeys.resonanceFeed(params);
    },
  },
  
  // Field service - cache for 5 minutes
  fieldService: {
    ttl: CacheTTL.SHORT,
    keyGenerator: (request: NextRequest) => {
      const url = new URL(request.url);
      const params = {
        limit: url.searchParams.get('limit'),
        type: url.searchParams.get('type'),
        orb_number: url.searchParams.get('orb_number'),
      };
      return CacheKeys.fieldService(params);
    },
  },
};

