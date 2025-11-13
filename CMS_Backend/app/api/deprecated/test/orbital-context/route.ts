import { NextRequest, NextResponse } from 'next/server';
import { orbitalContextService } from '@/lib/orbital-context';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Test API endpoint for Sprint 7: API Load & Model Autonomy
 * Tests caching, retry logic, and local computation fallback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title, useLocal = false, testMode = 'normal' } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    let result;
    const startTime = Date.now();

    switch (testMode) {
      case 'local':
        result = await orbitalContextService.getOrbitalContextLocal(content, title);
        break;
      case 'cache_stats':
        const stats = await orbitalContextService.getCacheStats();
        return NextResponse.json({
          success: true,
          cacheStats: stats,
          timestamp: new Date().toISOString()
        });
      case 'clear_cache':
        await orbitalContextService.clearCache();
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully',
          timestamp: new Date().toISOString()
        });
      case 'retry_config':
        const newConfig = { maxRetries: 5, baseDelay: 2000 };
        orbitalContextService.updateRetryConfig(newConfig);
        return NextResponse.json({
          success: true,
          message: 'Retry configuration updated',
          config: newConfig,
          timestamp: new Date().toISOString()
        });
      default:
        result = await orbitalContextService.getOrbitalContext(content, title, useLocal);
    }

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    return NextResponse.json({
      success: true,
      result,
      processingTimeMs: processingTime,
      testMode,
      useLocal,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Orbital context test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test orbital context',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for cache statistics and health check
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = await orbitalContextService.getCacheStats();
        return NextResponse.json({
          success: true,
          cacheStats: stats,
          timestamp: new Date().toISOString()
        });
      
      case 'health':
        return NextResponse.json({
          success: true,
          status: 'healthy',
          service: 'orbital-context-service',
          timestamp: new Date().toISOString()
        });
      
      default:
        return NextResponse.json({
          success: true,
          message: 'Orbital Context Test API',
          endpoints: {
            POST: 'Test orbital context analysis with various modes',
            'GET ?action=stats': 'Get cache statistics',
            'GET ?action=health': 'Health check'
          },
          timestamp: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Orbital context test GET error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

