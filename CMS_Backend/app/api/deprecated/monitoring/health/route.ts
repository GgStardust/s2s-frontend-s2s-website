import { NextRequest, NextResponse } from 'next/server';
import { getSystemHealth } from '@/lib/monitoring/metrics';
import { cache } from '@/lib/cache/redis';
import { getQueueHealth } from '@/lib/queue/bull';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Get system health
    const systemHealth = await getSystemHealth();
    
    // Check cache health
    const cacheHealth = await cache.healthCheck();
    
    // Check queue health
    const queueHealth = await getQueueHealth();
    
    // Calculate response time
    const responseTime = Date.now() - startTime;
    
    const health = {
      ...systemHealth,
      components: {
        ...systemHealth.components,
        cache: cacheHealth,
        queues: queueHealth.every(q => q.isHealthy),
      },
      responseTime,
      queueStatus: queueHealth,
    };
    
    // Determine overall status
    const isHealthy = Object.values(health.components).every(Boolean);
    health.status = isHealthy ? 'healthy' : 'degraded';
    
    return NextResponse.json(health, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      components: {
        api: false,
        database: false,
        cache: false,
        queues: false,
      },
    }, { status: 503 });
  }
}






