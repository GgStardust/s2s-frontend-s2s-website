import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/console/v3/practices/sequence
 * Get practice sequence for a layer or map Orbs to practices
 * Query params: 
 *   - layer: 'foundational', 'functional', 'advanced'
 *   - orb_cluster: JSON array of orb numbers [1, 2, 3, ...]
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const layer = searchParams.get('layer');
    const orbClusterParam = searchParams.get('orb_cluster');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // If layer is specified, return practices for that layer
    if (layer && ['foundational', 'functional', 'advanced'].includes(layer)) {
      const { data: practices, error } = await supabase
        .from('practices')
        .select('*')
        .eq('layer', layer)
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching practices by layer:', error);
        return NextResponse.json(
          { error: 'Failed to fetch practices', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ practices: practices || [], layer });
    }

    // If orb_cluster is specified, map Orbs to practices
    if (orbClusterParam) {
      let orbCluster: number[];
      try {
        orbCluster = JSON.parse(orbClusterParam);
        if (!Array.isArray(orbCluster)) {
          throw new Error('orb_cluster must be an array');
        }
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid orb_cluster format. Must be JSON array of numbers' },
          { status: 400 }
        );
      }

      // Get practices that map to these Orbs
      const { data: mappings, error: mappingsError } = await supabase
        .from('practice_orb_mappings')
        .select('practice_id, orb_number, relationship_type, weight')
        .in('orb_number', orbCluster);

      if (mappingsError) {
        console.error('Error fetching practice-orb mappings:', mappingsError);
        return NextResponse.json(
          { error: 'Failed to map Orbs to practices', details: mappingsError.message },
          { status: 500 }
        );
      }

      // Group by practice and calculate relevance scores
      const practiceScores: Record<number, number> = {};
      for (const mapping of mappings || []) {
        const practiceId = mapping.practice_id;
        const weight = mapping.weight || 1.0;
        const relationshipWeight = mapping.relationship_type === 'primary' ? 1.0 : 
                                   mapping.relationship_type === 'secondary' ? 0.7 : 0.5;
        
        practiceScores[practiceId] = (practiceScores[practiceId] || 0) + (weight * relationshipWeight);
      }

      // Get practice details for matched practices
      const practiceIds = Object.keys(practiceScores).map(Number);
      if (practiceIds.length === 0) {
        return NextResponse.json({ practices: [], orb_cluster: orbCluster });
      }

      const { data: practices, error: practicesError } = await supabase
        .from('practices')
        .select('*')
        .in('id', practiceIds)
        .order('id', { ascending: true });

      if (practicesError) {
        console.error('Error fetching practices:', practicesError);
        return NextResponse.json(
          { error: 'Failed to fetch practices', details: practicesError.message },
          { status: 500 }
        );
      }

      // Add relevance scores to practices
      const practicesWithScores = (practices || []).map(practice => ({
        ...practice,
        relevance_score: practiceScores[practice.id] || 0,
      }));

      // Sort by relevance score (descending)
      practicesWithScores.sort((a, b) => b.relevance_score - a.relevance_score);

      return NextResponse.json({
        practices: practicesWithScores,
        orb_cluster: orbCluster,
        mappings: mappings || [],
      });
    }

    // If neither layer nor orb_cluster specified, return all practices
    const { data: practices, error } = await supabase
      .from('practices')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching practices:', error);
      return NextResponse.json(
        { error: 'Failed to fetch practices', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ practices: practices || [] });
  } catch (err: any) {
    console.error('Unexpected error in GET /api/console/v3/practices/sequence:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}

