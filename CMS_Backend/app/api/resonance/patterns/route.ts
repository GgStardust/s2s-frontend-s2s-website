/**
 * Resonance Patterns API - Pattern analysis and detection
 * Created: 2025-01-23
 * Purpose: Backend completion for S2S System Plan v4.0
 * Status: Core API Implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';

/**
 * GET /api/resonance/patterns - Get resonance patterns
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    const tenant_id = searchParams.get('tenant_id') || '00000000-0000-0000-0000-000000000000';
    const pattern_type = searchParams.get('pattern_type');
    const time_range = searchParams.get('time_range') || '7d';
    const min_strength = parseFloat(searchParams.get('min_strength') || '0.5');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (time_range) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    let query = supabase
      .from('resonance_patterns')
      .select('*')
      .eq('tenant_id', tenant_id)
      .gte('detected_at', startDate.toISOString())
      .gte('strength', min_strength)
      .order('strength', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by pattern type if specified
    if (pattern_type) {
      query = query.eq('pattern_type', pattern_type);
    }

    const { data: patterns, error } = await query;

    if (error) {
      console.error('Resonance patterns fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch resonance patterns' },
        { status: 500 }
      );
    }

    // Calculate field coherence for the tenant
    const { data: coherenceData, error: coherenceError } = await supabase
      .rpc('calculate_field_coherence', { tenant_uuid: tenant_id });

    if (coherenceError) {
      console.error('Field coherence calculation error:', coherenceError);
    }

    // Calculate pattern frequency
    const patternFrequency = patterns?.reduce((acc: Record<string, number>, pattern: any) => {
      acc[pattern.pattern_type] = (acc[pattern.pattern_type] || 0) + 1;
      return acc;
    }, {}) || {};

    // Calculate sovereignty alignment
    const sovereigntyAlignment = patterns?.reduce((acc: number, pattern: any) => {
      return acc + (pattern.pattern_data?.sovereignty_impact || 0);
    }, 0) / (patterns?.length || 1);

    return NextResponse.json({
      patterns: patterns || [],
      total_count: patterns?.length || 0,
      field_coherence: coherenceData || 0.5,
      pattern_frequency: patternFrequency,
      sovereignty_alignment: sovereigntyAlignment,
      filters: {
        tenant_id,
        pattern_type: pattern_type || null,
        time_range,
        min_strength,
        limit,
        offset
      },
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Resonance patterns API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resonance/patterns - Analyze and detect new patterns
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();
    
    const {
      tenant_id = '00000000-0000-0000-0000-000000000000',
      content_ids = [],
      analysis_depth = 'standard',
      pattern_types = ['harmonic_sequence', 'orb_cascade', 'field_coherence'],
      min_coherence_threshold = 0.6
    } = body;

    // Get recent resonance scores for pattern analysis
    const { data: resonanceScores, error: scoresError } = await supabase
      .from('resonance_scores')
      .select('*')
      .eq('tenant_id', tenant_id)
      .gte('computed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('computed_at', { ascending: false });

    if (scoresError) {
      console.error('Resonance scores fetch error:', scoresError);
      return NextResponse.json(
        { error: 'Failed to fetch resonance scores for pattern analysis' },
        { status: 500 }
      );
    }

    if (!resonanceScores || resonanceScores.length === 0) {
      return NextResponse.json({
        patterns: [],
        analysis_complete: true,
        message: 'No recent resonance scores found for pattern analysis',
        generated_at: new Date().toISOString()
      });
    }

    // Analyze patterns based on resonance scores
    const detectedPatterns = await analyzeResonancePatterns(
      resonanceScores,
      pattern_types,
      min_coherence_threshold,
      analysis_depth
    );

    // Store detected patterns in database
    if (detectedPatterns.length > 0) {
      const { error: insertError } = await supabase
        .from('resonance_patterns')
        .insert(detectedPatterns.map(pattern => ({
          ...pattern,
          tenant_id,
          detected_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        })));

      if (insertError) {
        console.error('Pattern insertion error:', insertError);
        return NextResponse.json(
          { error: 'Failed to store detected patterns' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      patterns: detectedPatterns,
      analysis_complete: true,
      total_patterns_detected: detectedPatterns.length,
      analysis_depth,
      pattern_types_analyzed: pattern_types,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Resonance pattern analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Analyze resonance scores to detect patterns
 */
async function analyzeResonancePatterns(
  resonanceScores: any[],
  patternTypes: string[],
  minCoherenceThreshold: number,
  analysisDepth: string
): Promise<any[]> {
  const detectedPatterns: any[] = [];
  
  // Group scores by Orb associations
  const orbGroups = resonanceScores.reduce((acc: Record<string, any[]>, score: any) => {
    score.orb_associations?.forEach((orb: number) => {
      if (!acc[orb]) acc[orb] = [];
      acc[orb].push(score);
    });
    return acc;
  }, {});

  // Detect harmonic sequences
  if (patternTypes.includes('harmonic_sequence')) {
    const harmonicPatterns = detectHarmonicSequences(resonanceScores, minCoherenceThreshold);
    detectedPatterns.push(...harmonicPatterns);
  }

  // Detect Orb cascades
  if (patternTypes.includes('orb_cascade')) {
    const cascadePatterns = detectOrbCascades(orbGroups, minCoherenceThreshold);
    detectedPatterns.push(...cascadePatterns);
  }

  // Detect field coherence patterns
  if (patternTypes.includes('field_coherence')) {
    const coherencePatterns = detectFieldCoherence(resonanceScores, minCoherenceThreshold);
    detectedPatterns.push(...coherencePatterns);
  }

  // Detect temporal resonance patterns
  if (patternTypes.includes('temporal_resonance')) {
    const temporalPatterns = detectTemporalResonance(resonanceScores, minCoherenceThreshold);
    detectedPatterns.push(...temporalPatterns);
  }

  // Detect cross-dimensional patterns
  if (patternTypes.includes('cross_dimensional')) {
    const crossDimensionalPatterns = detectCrossDimensional(resonanceScores, minCoherenceThreshold);
    detectedPatterns.push(...crossDimensionalPatterns);
  }

  // Detect sovereign alignment patterns
  if (patternTypes.includes('sovereign_alignment')) {
    const sovereignPatterns = detectSovereignAlignment(resonanceScores, minCoherenceThreshold);
    detectedPatterns.push(...sovereignPatterns);
  }

  return detectedPatterns;
}

/**
 * Detect harmonic sequences in resonance scores
 */
function detectHarmonicSequences(scores: any[], threshold: number): any[] {
  const patterns: any[] = [];
  
  // Sort scores by computed_at
  const sortedScores = scores.sort((a, b) => 
    new Date(a.computed_at).getTime() - new Date(b.computed_at).getTime()
  );

  // Look for harmonic progressions (increasing coherence over time)
  for (let i = 0; i < sortedScores.length - 2; i++) {
    const sequence = sortedScores.slice(i, i + 3);
    const coherenceValues = sequence.map(s => s.coherence);
    
    if (coherenceValues[0] < coherenceValues[1] && coherenceValues[1] < coherenceValues[2]) {
      const averageCoherence = coherenceValues.reduce((a, b) => a + b, 0) / coherenceValues.length;
      
      if (averageCoherence >= threshold) {
        patterns.push({
          pattern_type: 'harmonic_sequence',
          pattern_data: {
            sequence_length: 3,
            coherence_progression: coherenceValues,
            harmonic_ratio: coherenceValues[2] / coherenceValues[0],
            sovereignty_impact: averageCoherence * 0.8
          },
          strength: averageCoherence,
          frequency: 440 * (1 + averageCoherence), // Base frequency with coherence modulation
          amplitude: averageCoherence * 0.9,
          phase_shift: Math.PI * averageCoherence,
          coherence_score: averageCoherence,
          source_content_ids: sequence.map(s => s.content_id),
          orb_threads_affected: Array.from(new Set(sequence.flatMap(s => s.orb_associations || [])))
        });
      }
    }
  }

  return patterns;
}

/**
 * Detect Orb cascades (resonance flowing between Orbs)
 */
function detectOrbCascades(orbGroups: Record<string, any[]>, threshold: number): any[] {
  const patterns: any[] = [];
  
  const orbNumbers = Object.keys(orbGroups).map(Number).sort((a, b) => a - b);
  
  for (let i = 0; i < orbNumbers.length - 1; i++) {
    const currentOrb = orbNumbers[i];
    const nextOrb = orbNumbers[i + 1];
    
    const currentScores = orbGroups[currentOrb] || [];
    const nextScores = orbGroups[nextOrb] || [];
    
    if (currentScores.length > 0 && nextScores.length > 0) {
      const currentAvgResonance = currentScores.reduce((sum, s) => sum + s.overall_score, 0) / currentScores.length;
      const nextAvgResonance = nextScores.reduce((sum, s) => sum + s.overall_score, 0) / nextScores.length;
      
      const cascadeStrength = Math.min(currentAvgResonance, nextAvgResonance);
      
      if (cascadeStrength >= threshold) {
        patterns.push({
          pattern_type: 'orb_cascade',
          pattern_data: {
            cascade_sequence: [currentOrb, nextOrb],
            resonance_flow: [currentAvgResonance, nextAvgResonance],
            cascade_strength: cascadeStrength,
            sovereignty_impact: cascadeStrength * 0.7
          },
          strength: cascadeStrength,
          frequency: 440 * (1 + cascadeStrength * 0.5),
          amplitude: cascadeStrength * 0.8,
          phase_shift: Math.PI * cascadeStrength * 0.5,
          coherence_score: cascadeStrength,
          source_content_ids: [...currentScores, ...nextScores].map(s => s.content_id),
          orb_threads_affected: [currentOrb, nextOrb]
        });
      }
    }
  }

  return patterns;
}

/**
 * Detect field coherence patterns
 */
function detectFieldCoherence(scores: any[], threshold: number): any[] {
  const patterns: any[] = [];
  
  const averageCoherence = scores.reduce((sum, s) => sum + s.coherence, 0) / scores.length;
  const coherenceVariance = scores.reduce((sum, s) => sum + Math.pow(s.coherence - averageCoherence, 2), 0) / scores.length;
  const coherenceStability = 1 - Math.sqrt(coherenceVariance);
  
  if (coherenceStability >= threshold) {
    patterns.push({
      pattern_type: 'field_coherence',
      pattern_data: {
        average_coherence: averageCoherence,
        coherence_stability: coherenceStability,
        field_unity: coherenceStability * averageCoherence,
        sovereignty_impact: coherenceStability * 0.9
      },
      strength: coherenceStability,
      frequency: 440 * (1 + coherenceStability * 0.3),
      amplitude: coherenceStability * 0.7,
      phase_shift: Math.PI * coherenceStability * 0.3,
      coherence_score: coherenceStability,
      source_content_ids: scores.map(s => s.content_id),
      orb_threads_affected: Array.from(new Set(scores.flatMap(s => s.orb_associations || [])))
    });
  }

  return patterns;
}

/**
 * Detect temporal resonance patterns
 */
function detectTemporalResonance(scores: any[], threshold: number): any[] {
  const patterns: any[] = [];
  
  // Sort by time
  const sortedScores = scores.sort((a, b) => 
    new Date(a.computed_at).getTime() - new Date(b.computed_at).getTime()
  );
  
  // Look for temporal resonance (resonance scores following a time-based pattern)
  const timeIntervals = [];
  for (let i = 1; i < sortedScores.length; i++) {
    const interval = new Date(sortedScores[i].computed_at).getTime() - 
                    new Date(sortedScores[i-1].computed_at).getTime();
    timeIntervals.push(interval);
  }
  
  if (timeIntervals.length > 1) {
    const avgInterval = timeIntervals.reduce((sum, interval) => sum + interval, 0) / timeIntervals.length;
    const intervalVariance = timeIntervals.reduce((sum, interval) => 
      sum + Math.pow(interval - avgInterval, 2), 0) / timeIntervals.length;
    const temporalStability = 1 - Math.sqrt(intervalVariance) / avgInterval;
    
    if (temporalStability >= threshold) {
      patterns.push({
        pattern_type: 'temporal_resonance',
        pattern_data: {
          temporal_stability: temporalStability,
          average_interval: avgInterval,
          resonance_rhythm: temporalStability * 0.8,
          sovereignty_impact: temporalStability * 0.6
        },
        strength: temporalStability,
        frequency: 440 * (1 + temporalStability * 0.4),
        amplitude: temporalStability * 0.6,
        phase_shift: Math.PI * temporalStability * 0.4,
        coherence_score: temporalStability,
        source_content_ids: sortedScores.map(s => s.content_id),
        orb_threads_affected: Array.from(new Set(sortedScores.flatMap(s => s.orb_associations || [])))
      });
    }
  }

  return patterns;
}

/**
 * Detect cross-dimensional patterns
 */
function detectCrossDimensional(scores: any[], threshold: number): any[] {
  const patterns: any[] = [];
  
  // Look for scores that span multiple Orbs (cross-dimensional resonance)
  const crossDimensionalScores = scores.filter(score => 
    score.orb_associations && score.orb_associations.length > 2
  );
  
  if (crossDimensionalScores.length > 0) {
    const avgCrossDimensionalResonance = crossDimensionalScores.reduce(
      (sum, s) => sum + s.overall_score, 0
    ) / crossDimensionalScores.length;
    
    if (avgCrossDimensionalResonance >= threshold) {
      patterns.push({
        pattern_type: 'cross_dimensional',
        pattern_data: {
          cross_dimensional_strength: avgCrossDimensionalResonance,
          dimensional_span: crossDimensionalScores[0].orb_associations.length,
          unity_coefficient: avgCrossDimensionalResonance * 0.9,
          sovereignty_impact: avgCrossDimensionalResonance * 0.8
        },
        strength: avgCrossDimensionalResonance,
        frequency: 440 * (1 + avgCrossDimensionalResonance * 0.6),
        amplitude: avgCrossDimensionalResonance * 0.8,
        phase_shift: Math.PI * avgCrossDimensionalResonance * 0.6,
        coherence_score: avgCrossDimensionalResonance,
        source_content_ids: crossDimensionalScores.map(s => s.content_id),
        orb_threads_affected: Array.from(new Set(crossDimensionalScores.flatMap(s => s.orb_associations || [])))
      });
    }
  }

  return patterns;
}

/**
 * Detect sovereign alignment patterns
 */
function detectSovereignAlignment(scores: any[], threshold: number): any[] {
  const patterns: any[] = [];
  
  // Calculate sovereignty index from resonance scores
  const sovereigntyScores = scores.map(score => {
    const sovereignty = (score.strength + score.clarity + score.coherence + score.pattern) / 4;
    return { ...score, sovereignty };
  });
  
  const avgSovereignty = sovereigntyScores.reduce((sum, s) => sum + s.sovereignty, 0) / sovereigntyScores.length;
  const sovereigntyVariance = sovereigntyScores.reduce((sum, s) => 
    sum + Math.pow(s.sovereignty - avgSovereignty, 2), 0) / sovereigntyScores.length;
  const sovereigntyAlignment = 1 - Math.sqrt(sovereigntyVariance);
  
  if (sovereigntyAlignment >= threshold) {
    patterns.push({
      pattern_type: 'sovereign_alignment',
      pattern_data: {
        sovereignty_alignment: sovereigntyAlignment,
        average_sovereignty: avgSovereignty,
        sovereign_coherence: sovereigntyAlignment * avgSovereignty,
        sovereignty_impact: sovereigntyAlignment * 1.0
      },
      strength: sovereigntyAlignment,
      frequency: 440 * (1 + sovereigntyAlignment * 0.7),
      amplitude: sovereigntyAlignment * 0.9,
      phase_shift: Math.PI * sovereigntyAlignment * 0.7,
      coherence_score: sovereigntyAlignment,
      source_content_ids: scores.map(s => s.content_id),
      orb_threads_affected: Array.from(new Set(scores.flatMap(s => s.orb_associations || [])))
    });
  }

  return patterns;
}
