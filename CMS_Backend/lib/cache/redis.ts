import Redis from 'ioredis';

// Redis client configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
};

// Create Redis client
let redis: Redis | null = null;
let redisAvailable = false;

export function getRedisClient(): Redis | null {
  // Redis disabled for now - return null to disable caching
  return null;
}

// Cache utility functions
export class CacheManager {
  private redis: Redis | null;
  
  constructor() {
    this.redis = getRedisClient();
  }
  
  // Set cache with TTL
  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    if (!this.redis || !redisAvailable) {
      console.log('Cache disabled - Redis not available');
      return;
    }
    
    try {
      const serialized = JSON.stringify(value);
      await this.redis.setex(key, ttlSeconds, serialized);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
  
  // Get cache
  async get<T>(key: string): Promise<T | null> {
    if (!this.redis || !redisAvailable) {
      return null;
    }
    
    try {
      const cached = await this.redis.get(key);
      if (!cached) return null;
      return JSON.parse(cached);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  // Delete cache
  async del(key: string): Promise<void> {
    if (!this.redis || !redisAvailable) {
      return;
    }
    
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
  
  // Invalidate cache by pattern
  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.redis || !redisAvailable) {
      return;
    }
    
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }
  
  // Health check
  async healthCheck(): Promise<boolean> {
    if (!this.redis || !redisAvailable) {
      return false;
    }
    
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }
}

// Cache key generators
export const CacheKeys = {
  // Content files
  contentFiles: (filters?: any) => {
    const filterStr = filters ? JSON.stringify(filters) : 'all';
    return `content_files:${filterStr}`;
  },
  
  // Books
  books: (filters?: any) => {
    const filterStr = filters ? JSON.stringify(filters) : 'all';
    return `books:${filterStr}`;
  },
  
  // Chapters
  chapters: (bookId?: string) => {
    return bookId ? `chapters:book:${bookId}` : 'chapters:all';
  },
  
  // Orbs
  orbs: () => 'orbs:all',
  
  // Resonance feed
  resonanceFeed: (params?: any) => {
    const paramStr = params ? JSON.stringify(params) : 'default';
    return `resonance_feed:${paramStr}`;
  },
  
  // Field service
  fieldService: (params?: any) => {
    const paramStr = params ? JSON.stringify(params) : 'default';
    return `field_service:${paramStr}`;
  },
  
  // AI responses (for expensive operations)
  aiResponse: (prompt: string) => {
    const hash = Buffer.from(prompt).toString('base64').slice(0, 32);
    return `ai_response:${hash}`;
  }
};

// Cache TTL constants (in seconds)
export const CacheTTL = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 1800,    // 30 minutes
  LONG: 3600,      // 1 hour
  VERY_LONG: 7200, // 2 hours
  AI_RESPONSE: 86400, // 24 hours
};

// Singleton cache manager
export const cache = new CacheManager();
