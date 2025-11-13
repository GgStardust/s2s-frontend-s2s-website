/**
 * CONCEPT_MAP API Endpoint
 * 
 * Serves CONCEPT_MAP data for Console and other consumers
 * Returns Orb relationships, axes, pairings, satellites, and domains
 */

import { NextRequest, NextResponse } from 'next/server';
import { referenceLoaders } from '@/lib/orbital/reference-loaders';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const conceptMap = await referenceLoaders.loadConceptMap();
    const relationships = await referenceLoaders.getOrbRelationships();

    return NextResponse.json({
      success: true,
      data: {
        primaryAxes: conceptMap.primaryAxes,
        secondaryPairings: conceptMap.secondaryPairings,
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
        generated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error loading CONCEPT_MAP:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load CONCEPT_MAP',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

