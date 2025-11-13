/**
 * RBI Field-Sensing API
 * 
 * Real-time resonance calculations for Console content
 */

import { NextRequest, NextResponse } from 'next/server';
import { fieldSensingService } from '@/lib/rbi/field-sensing';
import { getCorsHeaders } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return NextResponse.json({}, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    
    const body = await request.json();
    const { content_ids } = body;

    if (!content_ids || !Array.isArray(content_ids) || content_ids.length === 0) {
      return NextResponse.json(
        { error: 'content_ids array is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const fieldState = await fieldSensingService.senseField(content_ids);

    return NextResponse.json({
      success: true,
      data: fieldState,
      metadata: {
        content_count: content_ids.length,
        generated: new Date().toISOString()
      }
    }, {
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Error in field sensing:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  const fieldState = fieldSensingService.getFieldState();

  if (!fieldState) {
    return NextResponse.json(
      { error: 'No field state available. Call POST with content_ids first.' },
      { status: 404, headers: corsHeaders }
    );
  }

  return NextResponse.json({
    success: true,
    data: fieldState
  }, {
    headers: corsHeaders,
  });
}

