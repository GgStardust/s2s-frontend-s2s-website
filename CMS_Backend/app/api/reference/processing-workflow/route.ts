/**
 * Processing Workflow API Endpoint
 * 
 * Serves PROCESSING_WORKFLOW data for Console and other consumers
 */

import { NextRequest, NextResponse } from 'next/server';
import { referenceLoaders } from '@/lib/orbital/reference-loaders';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const workflow = await referenceLoaders.loadProcessingWorkflow();

    return NextResponse.json({
      success: true,
      data: workflow,
      metadata: {
        source: 'PROCESSING_WORKFLOW.md',
        generated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error loading processing workflow:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load processing workflow',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

