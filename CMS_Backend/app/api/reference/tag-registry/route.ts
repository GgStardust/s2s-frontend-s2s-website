/**
 * Tag Registry API Endpoint
 * 
 * Serves TAG_REGISTRY data for Console and other consumers
 */

import { NextRequest, NextResponse } from 'next/server';
import { referenceLoaders } from '@/lib/orbital/reference-loaders';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const tagRegistry = await referenceLoaders.loadTagRegistry();

    return NextResponse.json({
      success: true,
      data: tagRegistry,
      metadata: {
        source: 'TAG_REGISTRY.md',
        generated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error loading tag registry:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load tag registry',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

