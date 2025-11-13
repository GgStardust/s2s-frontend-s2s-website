/**
 * Orb Personalities API Endpoint
 * 
 * Serves Orb personality data for Book Compiler, Console, and other consumers
 * Returns personality profiles for all 13 Orbs
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
    
    const { searchParams } = new URL(request.url);
    const orbNumber = searchParams.get('orb');

    if (orbNumber) {
      // Get specific Orb personality
      const orbNum = parseInt(orbNumber);
      if (isNaN(orbNum) || orbNum < 1 || orbNum > 13) {
        return NextResponse.json(
          { success: false, error: 'Invalid orb number. Must be 1-13.' },
          { status: 400, headers: corsHeaders }
        );
      }

      const personality = await referenceLoaders.getOrbPersonality(orbNum);
      if (!personality) {
        return NextResponse.json(
          { success: false, error: `Orb ${orbNum} personality not found` },
          { status: 404, headers: corsHeaders }
        );
      }

      return NextResponse.json({
        success: true,
        data: personality,
        metadata: {
          source: 'ORB_PERSONALITY_SYSTEMV2.md',
          generated: new Date().toISOString()
        }
      }, {
        headers: corsHeaders,
      });
    }

    // Get all Orb personalities
    const personalities = await referenceLoaders.loadOrbPersonalities();

    return NextResponse.json({
      success: true,
      data: personalities,
      metadata: {
        source: 'ORB_PERSONALITY_SYSTEMV2.md',
        generated: new Date().toISOString(),
        count: personalities.personalities.length
      }
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error loading Orb personalities:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load Orb personalities',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

