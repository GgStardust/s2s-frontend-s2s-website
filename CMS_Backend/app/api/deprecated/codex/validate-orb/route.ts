import { NextRequest, NextResponse } from 'next/server';
import { orbSystemValidator } from '@/lib/codex/orb-system-validator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Orb System Validation API
 * 
 * Provides validation and semantic checking for Orb-related content.
 * Used by the CMS, AI systems, and dashboard for maintaining Codex integrity.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, claimedOrb, action } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required for validation' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'validate_orb_boundaries':
        if (!claimedOrb || typeof claimedOrb !== 'number') {
          return NextResponse.json(
            { error: 'claimedOrb is required for boundary validation' },
            { status: 400 }
          );
        }
        
        const validationResult = await orbSystemValidator.validateContent(content, claimedOrb);
        return NextResponse.json({
          success: true,
          validation: validationResult,
          timestamp: new Date().toISOString()
        });

      case 'find_best_orb':
        const bestOrbMatches = orbSystemValidator.findBestOrbForContent(content);
        return NextResponse.json({
          success: true,
          matches: bestOrbMatches,
          recommended: bestOrbMatches[0] || null,
          timestamp: new Date().toISOString()
        });

      case 'get_orb_definition':
        if (!claimedOrb || typeof claimedOrb !== 'number') {
          return NextResponse.json(
            { error: 'claimedOrb is required for definition retrieval' },
            { status: 400 }
          );
        }
        
        const orbDefinition = orbSystemValidator.getOrbDefinition(claimedOrb);
        if (!orbDefinition) {
          return NextResponse.json(
            { error: `Orb ${claimedOrb} not found` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          orb: orbDefinition,
          timestamp: new Date().toISOString()
        });

      case 'get_all_orb_definitions':
        const allOrbs = orbSystemValidator.getAllOrbDefinitions();
        return NextResponse.json({
          success: true,
          orbs: allOrbs,
          count: allOrbs.length,
          timestamp: new Date().toISOString()
        });

      case 'get_redundancy_patterns':
        const redundancyPatterns = orbSystemValidator.getRedundancyPatterns();
        return NextResponse.json({
          success: true,
          patterns: redundancyPatterns,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: validate_orb_boundaries, find_best_orb, get_orb_definition, get_all_orb_definitions, or get_redundancy_patterns' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Orb validation error:', error);
    return NextResponse.json(
      { 
        error: 'Orb validation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'get_all_orb_definitions';
    const orbNumber = searchParams.get('orb') ? parseInt(searchParams.get('orb')!) : null;

    switch (action) {
      case 'get_all_orb_definitions':
        const allOrbs = orbSystemValidator.getAllOrbDefinitions();
        return NextResponse.json({
          success: true,
          orbs: allOrbs,
          count: allOrbs.length,
          timestamp: new Date().toISOString()
        });

      case 'get_orb_definition':
        if (!orbNumber) {
          return NextResponse.json(
            { error: 'orb parameter is required for definition retrieval' },
            { status: 400 }
          );
        }
        
        const orbDefinition = orbSystemValidator.getOrbDefinition(orbNumber);
        if (!orbDefinition) {
          return NextResponse.json(
            { error: `Orb ${orbNumber} not found` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          orb: orbDefinition,
          timestamp: new Date().toISOString()
        });

      case 'get_redundancy_patterns':
        const redundancyPatterns = orbSystemValidator.getRedundancyPatterns();
        return NextResponse.json({
          success: true,
          patterns: redundancyPatterns,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: get_all_orb_definitions, get_orb_definition, or get_redundancy_patterns' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Orb validation error:', error);
    return NextResponse.json(
      { 
        error: 'Orb validation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


