/**
 * Console Concept Map API
 * 
 * Serves concept map data specifically formatted for Console consumption
 * Includes orb relationships, axes, and visualization data
 */

import { NextRequest, NextResponse } from 'next/server';
import { referenceLoaders } from '@/lib/orbital/reference-loaders';
import { getCorsHeaders } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return NextResponse.json({}, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    
    const conceptMap = await referenceLoaders.loadConceptMap();
    const relationships = await referenceLoaders.getOrbRelationships();

    // Format for Console visualization
    return NextResponse.json({
      success: true,
      data: {
        primaryAxes: conceptMap.primaryAxes.map(axis => ({
          orb1: axis.orb1,
          orb2: axis.orb2,
          description: axis.description,
          type: 'primary_axis'
        })),
        secondaryPairings: conceptMap.secondaryPairings.map(pairing => ({
          orb1: pairing.orb1,
          orb2: pairing.orb2,
          description: pairing.description,
          type: 'secondary_pairing'
        })),
        orb0Expressions: conceptMap.orb0Expressions,
        orbDetails: conceptMap.orbDetails,
        satellites: conceptMap.satellites,
        domains: conceptMap.domains,
        relationships: {
          axes: relationships.axes,
          pairings: relationships.pairings
        }
      },
      metadata: {
        source: 'CONCEPT_MAP.md',
        generated: new Date().toISOString(),
        format: 'console_optimized'
      }
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error loading concept map for Console:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load concept map',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

