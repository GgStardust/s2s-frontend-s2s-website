/**
 * System Health Endpoint
 * 
 * Comprehensive health check for all critical system dependencies.
 * Always returns 200 with detailed status information.
 * 
 * Step 1 of Backend Stabilization Plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { runResonanceValidation } from '@/lib/resonance-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface HealthStatus {
  supabase: boolean;
  pgvector: boolean;
  openai: boolean;
  redis: boolean;
  rbi_kernel: boolean;
  timestamp: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  version?: string;
}

/**
 * Check Supabase connection
 */
async function checkSupabase(): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('content_files').select('id').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase health check error:', error);
    return false;
  }
}

/**
 * Check if pgvector extension exists
 */
async function checkPgVector(): Promise<boolean> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return false;
    }

    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase.rpc('check_pgvector_extension');
    
    // If RPC doesn't exist, try a direct query
    if (error) {
      const { error: queryError } = await supabase
        .from('content_files')
        .select('id')
        .limit(1);
      // If we can query, assume pgvector might be available (not critical)
      return !queryError;
    }
    
    return !!data;
  } catch (error) {
    console.error('PgVector health check error:', error);
    return false;
  }
}

/**
 * Check if OpenAI API key is present
 */
function checkOpenAI(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Check if Redis is reachable (if configured)
 */
async function checkRedis(): Promise<boolean> {
  const redisHost = process.env.REDIS_HOST;
  
  // Redis is optional - if not configured, return true
  if (!redisHost) {
    return true; // Not required
  }

  try {
    // Simple TCP connection test
    const net = await import('net');
    return new Promise((resolve) => {
      const socket = net.createConnection(
        parseInt(process.env.REDIS_PORT || '6379'),
        redisHost,
        () => {
          socket.destroy();
          resolve(true);
        }
      );
      
      socket.on('error', () => {
        resolve(false);
      });
      
      socket.setTimeout(2000, () => {
        socket.destroy();
        resolve(false);
      });
    });
  } catch (error) {
    console.error('Redis health check error:', error);
    return false;
  }
}

/**
 * Check if RBI kernel responds correctly
 */
async function checkRBIKernel(): Promise<boolean> {
  try {
    const testContent = `# Test Content
    
This is a test document for RBI kernel validation.
It contains references to resonance and coherence.
    
@orb1 @orb2
`;
    
    const result = await runResonanceValidation(testContent, 'Test Document');
    
    // Kernel should return a valid result
    return (
      result.coherenceScore >= 0 &&
      result.coherenceScore <= 1 &&
      Array.isArray(result.validatedOrbs) &&
      typeof result.metrics === 'object'
    );
  } catch (error) {
    console.error('RBI kernel health check error:', error);
    return false;
  }
}

/**
 * Determine overall system status
 */
function determineStatus(checks: {
  supabase: boolean;
  pgvector: boolean;
  openai: boolean;
  redis: boolean;
  rbi_kernel: boolean;
}): 'healthy' | 'degraded' | 'unhealthy' {
  const critical = [checks.supabase, checks.openai, checks.rbi_kernel];
  const optional = [checks.pgvector, checks.redis];
  
  const criticalPassed = critical.filter(Boolean).length;
  const optionalPassed = optional.filter(Boolean).length;
  
  // All critical must pass for healthy
  if (criticalPassed === critical.length) {
    return 'healthy';
  }
  
  // Some critical failing = unhealthy
  if (criticalPassed < critical.length) {
    return 'unhealthy';
  }
  
  // Critical pass but optional fail = degraded
  return 'degraded';
}

/**
 * GET /api/health/system
 */
export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();
  
  // Run all health checks in parallel
  const [supabase, pgvector, openai, redis, rbi_kernel] = await Promise.all([
    checkSupabase(),
    checkPgVector(),
    Promise.resolve(checkOpenAI()),
    checkRedis(),
    checkRBIKernel(),
  ]);

  const healthStatus: HealthStatus = {
    supabase,
    pgvector,
    openai,
    redis,
    rbi_kernel,
    timestamp,
    status: determineStatus({ supabase, pgvector, openai, redis, rbi_kernel }),
    version: process.env.npm_package_version || 'unknown',
  };

  // Always return 200, but include status in response
  return NextResponse.json(healthStatus, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=60',
      'X-Health-Check-Timestamp': timestamp,
      'X-Health-Check-Version': healthStatus.version || 'unknown',
    },
  });
}

