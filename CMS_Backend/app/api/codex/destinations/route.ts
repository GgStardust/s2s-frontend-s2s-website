/**
 * Codex Destinations API
 * 
 * Returns content files organized by integration_points.codex destinations
 */

import { NextRequest, NextResponse } from 'next/server';
import { codexIntegrationRouter } from '@/lib/codex/integration-router';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destinations = searchParams.get('destinations'); // Comma-separated list

    // Load and route content
    const allDestinations = await codexIntegrationRouter.loadAndRoute();

    if (destinations) {
      // Return specific destinations
      const destinationNames = destinations.split(',').map(d => d.trim());
      const requestedDestinations = codexIntegrationRouter.getMultipleDestinations(destinationNames);

      return NextResponse.json({
        success: true,
        data: requestedDestinations,
        metadata: {
          requested: destinationNames,
          found: requestedDestinations.length,
          generated: new Date().toISOString()
        }
      });
    }

    // Return all destinations
    const destinationsArray = Array.from(allDestinations.values());

    return NextResponse.json({
      success: true,
      data: destinationsArray,
      metadata: {
        total_destinations: destinationsArray.length,
        total_content: destinationsArray.reduce((sum, dest) => sum + dest.content.length, 0),
        generated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error loading Codex destinations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load Codex destinations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

