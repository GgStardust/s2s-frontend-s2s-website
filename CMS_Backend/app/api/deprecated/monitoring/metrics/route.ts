import { NextRequest, NextResponse } from 'next/server';
import { register } from '@/lib/monitoring/metrics';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get Prometheus metrics
    const metrics = await register.metrics();
    
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('Metrics collection error:', error);
    
    return NextResponse.json({
      error: 'Failed to collect metrics',
      message: error.message,
    }, { status: 500 });
  }
}






