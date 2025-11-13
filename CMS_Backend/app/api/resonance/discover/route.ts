import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateJaccardSimilarity } from '@/lib/rbi/core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Resonance Kernel Discovery
 * Finds content that resonates with a given content file based on:
 * - Orb associations (Jaccard similarity)
 * - Tags overlap (including snake tags)
 * - Field function alignment
 * - Resonance metrics similarity
 */
interface ResonanceMatch {
  id: string;
  title: string;
  content_type: string;
  orb_associations: number[];
  tags: string[];
  resonance_score: number;
  match_reasons: string[];
  yaml_frontmatter?: any;
}

/**
 * Calculate Orb overlap using RBI kernel Jaccard similarity
 */
function calculateOrbOverlap(orbs1: number[], orbs2: number[]): number {
  return calculateJaccardSimilarity(orbs1, orbs2);
}

/**
 * Calculate tag overlap using RBI kernel Jaccard similarity
 */
function calculateTagOverlap(tags1: string[], tags2: string[]): number {
  // Normalize tags to lowercase for comparison
  const normalized1 = tags1.map(t => t.toLowerCase());
  const normalized2 = tags2.map(t => t.toLowerCase());
  return calculateJaccardSimilarity(normalized1, normalized2);
}

function calculateResonanceMetricsSimilarity(metrics1: any, metrics2: any): number {
  if (!metrics1 || !metrics2) return 0;
  
  const fields = ['strength', 'clarity', 'coherence', 'pattern'];
  let totalDiff = 0;
  let count = 0;
  
  fields.forEach(field => {
    if (metrics1[field] !== undefined && metrics2[field] !== undefined) {
      totalDiff += Math.abs((metrics1[field] - metrics2[field]) / 10);
      count++;
    }
  });
  
  return count > 0 ? 1 - (totalDiff / count) : 0;
}

/**
 * POST /api/resonance/discover
 * Find content that resonates with a given content file
 */
export async function POST(request: NextRequest) {
  try {
    const { contentId, limit = 10, minScore = 0.2 } = await request.json();
    
    if (!contentId) {
      return NextResponse.json(
        { error: 'contentId is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the source content file
    const { data: sourceFile, error: sourceError } = await supabase
      .from('content_files')
      .select('*')
      .eq('id', contentId)
      .single();

    if (sourceError || !sourceFile) {
      return NextResponse.json(
        { error: 'Source content not found' },
        { status: 404 }
      );
    }

    // Get all other content files
    const { data: allFiles, error: filesError } = await supabase
      .from('content_files')
      .select('*')
      .neq('id', contentId);

    if (filesError) {
      return NextResponse.json(
        { error: 'Failed to fetch content files' },
        { status: 500 }
      );
    }

    // Calculate resonance scores for each file
    const matches: ResonanceMatch[] = [];

    for (const file of allFiles || []) {
      const matchReasons: string[] = [];
      let totalScore = 0;
      let componentCount = 0;

      // 1. Orb association overlap (40% weight)
      const orbOverlap = calculateOrbOverlap(
        sourceFile.orb_associations || [],
        file.orb_associations || []
      );
      if (orbOverlap > 0) {
        totalScore += orbOverlap * 0.4;
        componentCount += 0.4;
        matchReasons.push(`${Math.round(orbOverlap * 100)}% Orb overlap`);
      }

      // 2. Tag overlap (30% weight)
      const tagOverlap = calculateTagOverlap(
        sourceFile.tags || [],
        file.tags || []
      );
      if (tagOverlap > 0) {
        totalScore += tagOverlap * 0.3;
        componentCount += 0.3;
        matchReasons.push(`${Math.round(tagOverlap * 100)}% Tag overlap`);
      }

      // 3. Resonance metrics similarity (20% weight)
      const metrics1 = sourceFile.resonance_metrics || 
        (typeof sourceFile.yaml_frontmatter === 'object' && sourceFile.yaml_frontmatter?.resonance_metrics) ||
        {};
      const metrics2 = file.resonance_metrics || 
        (typeof file.yaml_frontmatter === 'object' && file.yaml_frontmatter?.resonance_metrics) ||
        {};
      const metricsSimilarity = calculateResonanceMetricsSimilarity(metrics1, metrics2);
      if (metricsSimilarity > 0.1) {
        totalScore += metricsSimilarity * 0.2;
        componentCount += 0.2;
        matchReasons.push(`${Math.round(metricsSimilarity * 100)}% Resonance alignment`);
      }

      // 4. Field function alignment (10% weight) - if content_purpose matches
      const yaml1 = typeof sourceFile.yaml_frontmatter === 'object' ? sourceFile.yaml_frontmatter : {};
      const yaml2 = typeof file.yaml_frontmatter === 'object' ? file.yaml_frontmatter : {};
      const purpose1 = yaml1?.field_function?.content_purpose?.toLowerCase() || '';
      const purpose2 = yaml2?.field_function?.content_purpose?.toLowerCase() || '';
      if (purpose1 && purpose2) {
        const purposeWords1 = new Set(purpose1.split(/\s+/));
        const purposeWords2 = new Set(purpose2.split(/\s+/));
        const purposeIntersection = [...purposeWords1].filter(w => purposeWords2.has(w)).length;
        const purposeUnion = purposeWords1.size + purposeWords2.size - purposeIntersection;
        const purposeSimilarity = purposeUnion > 0 ? purposeIntersection / purposeUnion : 0;
        
        if (purposeSimilarity > 0.1) {
          totalScore += purposeSimilarity * 0.1;
          componentCount += 0.1;
          matchReasons.push('Similar field function');
        }
      }

      // Normalize score by component count
      const finalScore = componentCount > 0 ? totalScore / componentCount : 0;

      if (finalScore >= minScore) {
        matches.push({
          id: file.id,
          title: file.title,
          content_type: file.content_type,
          orb_associations: file.orb_associations || [],
          tags: file.tags || [],
          resonance_score: finalScore,
          match_reasons: matchReasons,
          yaml_frontmatter: file.yaml_frontmatter,
        });
      }
    }

    // Sort by resonance score (descending)
    matches.sort((a, b) => b.resonance_score - a.resonance_score);

    return NextResponse.json({
      source: {
        id: sourceFile.id,
        title: sourceFile.title,
      },
      matches: matches.slice(0, limit),
      total_found: matches.length,
    });
  } catch (error: any) {
    console.error('Resonance discovery error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/resonance/discover
 * Find content by Orb, tag, or concept
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orb = searchParams.get('orb');
    const tag = searchParams.get('tag');
    const concept = searchParams.get('concept');
    const limit = parseInt(searchParams.get('limit') || '20');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase.from('content_files').select('*');

    // Filter by Orb
    if (orb) {
      const orbNum = parseInt(orb);
      if (orbNum >= 1 && orbNum <= 13) {
        // Search for strings containing "Orb {number}:" in the array
        // Use contains with pattern - will match any string starting with "Orb {number}:"
        // Note: This requires exact match, so we'll filter results after fetching
        const orbPattern = `Orb ${orbNum}:`;
        // Fetch all and filter client-side for pattern matching
        // (Can be optimized with a PostgreSQL function later)
      }
    }

    // Filter by tag (case-insensitive)
    if (tag) {
      query = query.contains('tags', [tag]);
    }

    // Filter by concept (searches field_function.content_purpose, title, tags)
    if (concept) {
      const conceptLower = concept.toLowerCase();
      // Note: PostgreSQL text search would be better, but this works for now
      query = query.or(`title.ilike.%${concept}%,tags.cs.{${concept}}`);
    }

    const { data: files, error } = await query.limit(limit * 2); // Fetch more to account for filtering

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch content' },
        { status: 500 }
      );
    }

    // Filter by Orb pattern if specified (client-side filtering for pattern matching)
    let filteredFiles = files || [];
    if (orb) {
      const orbNum = parseInt(orb);
      if (orbNum >= 1 && orbNum <= 13) {
        const orbPattern = new RegExp(`^Orb\\s+${orbNum}:`, 'i');
        filteredFiles = filteredFiles.filter((file: any) => {
          if (!file.orb_associations || !Array.isArray(file.orb_associations)) return false;
          return file.orb_associations.some((orbStr: string) => orbPattern.test(orbStr));
        });
      }
    }

    // Limit results after filtering
    filteredFiles = filteredFiles.slice(0, limit);

    return NextResponse.json({
      matches: filteredFiles,
      total_found: filteredFiles.length,
      filters: { orb, tag, concept },
    });
  } catch (error: any) {
    console.error('Resonance search error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

