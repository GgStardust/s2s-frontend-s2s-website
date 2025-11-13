import { NextRequest, NextResponse } from 'next/server';

// Prevent build-time execution
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ResonanceSuggestion {
  id: string;
  type: 'content' | 'orb' | 'reflection' | 'system';
  title: string;
  description: string;
  priority: number;
  orb_associations: number[];
  metadata?: {
    content_id?: string;
    last_updated?: string;
    word_count?: number;
    resonance_score?: number;
  };
}

/**
 * GET /api/resonance/feed
 * 
 * Returns resonance-ranked suggestions for the Field Console
 * 
 * Query parameters:
 * - limit: number of suggestions to return (default: 5)
 * - type: filter by suggestion type (content, orb, reflection, system)
 * - min_priority: minimum priority threshold (default: 0.5)
 * 
 * Response:
 * {
 *   "suggestions": [...],
 *   "total": 12,
 *   "generated_at": "2024-10-16T...",
 *   "version": "v0.1"
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Dynamic import to prevent build-time execution
    const { createClient } = await import('@supabase/supabase-js');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const type = searchParams.get('type') as 'content' | 'orb' | 'reflection' | 'system' | null;
    const minPriority = parseFloat(searchParams.get('min_priority') || '0.5');

    // Get recent content files for analysis
    const { data: contentFiles, error: contentError } = await supabase
      .from('content_files')
      .select('id, title, content_type, orb_associations, tags, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(20);

    if (contentError) {
      console.error('Error fetching content files:', contentError);
    }

    // Get recent reflection logs for analysis
    const { data: reflectionLogs, error: reflectionError } = await supabase
      .from('reflection_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (reflectionError) {
      console.error('Error fetching reflection logs:', reflectionError);
    }

    // Generate mock suggestions based on real data (Sprint 1 approach)
    const suggestions: ResonanceSuggestion[] = [];

    // Content-based suggestions
    if (!type || type === 'content') {
      const contentFilesData = contentFiles || [];
      
      // Find incomplete or recently updated content
      const incompleteContent = contentFilesData.filter(file => 
        file.content_type === 'essay' && 
        file.updated_at > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      );

      incompleteContent.slice(0, 2).forEach((file, index) => {
        suggestions.push({
          id: `content_${file.id}`,
          type: 'content',
          title: `Complete ${file.title}`,
          description: `${file.content_type} is recently updated and may need completion or refinement`,
          priority: 0.9 - (index * 0.1),
          orb_associations: file.orb_associations || [],
          metadata: {
            content_id: file.id,
            last_updated: file.updated_at,
            resonance_score: 0.8
          }
        });
      });

      // Find content with high orb associations
      const highOrbContent = contentFilesData.filter(file => 
        file.orb_associations && file.orb_associations.length >= 3
      );

      highOrbContent.slice(0, 1).forEach((file) => {
        suggestions.push({
          id: `orb_analysis_${file.id}`,
          type: 'orb',
          title: `Analyze Orb Cross-References in ${file.title}`,
          description: `Content has ${file.orb_associations.length} orb associations - explore cross-orb synthesis`,
          priority: 0.7,
          orb_associations: file.orb_associations || [],
          metadata: {
            content_id: file.id,
            resonance_score: 0.7
          }
        });
      });
    }

    // Reflection-based suggestions
    if (!type || type === 'reflection') {
      const reflectionLogsData = reflectionLogs || [];
      
      // Find reflections with low scores that need attention
      const lowScoreReflections = reflectionLogsData.filter(log => 
        log.clarity_score < 0.7 || log.coherence_score < 0.7 || log.consequence_score < 0.7
      );

      lowScoreReflections.slice(0, 1).forEach((log) => {
        const lowestScore = Math.min(log.clarity_score, log.coherence_score, log.consequence_score);
        suggestions.push({
          id: `reflection_${log.id}`,
          type: 'reflection',
          title: `Review Reflection for ${log.artifact_id}`,
          description: `Lowest score: ${(lowestScore * 100).toFixed(0)}% - needs Reality-Check Protocol review`,
          priority: 0.8,
          orb_associations: [],
          metadata: {
            resonance_score: lowestScore
          }
        });
      });
    }

    // System-based suggestions
    if (!type || type === 'system') {
      // Add system maintenance suggestions
      suggestions.push({
        id: 'system_style_training',
        type: 'system',
        title: 'Update Style Training',
        description: 'Consider adding new writing examples to improve AI style recognition',
        priority: 0.6,
        orb_associations: [9, 8], // Field Communication + Photonic Intelligence
        metadata: {
          resonance_score: 0.6
        }
      });

      suggestions.push({
        id: 'system_orb_exploration',
        type: 'system',
        title: 'Explore Underutilized Orbs',
        description: 'Some orbs have fewer content associations - consider expanding coverage',
        priority: 0.5,
        orb_associations: [5, 6, 7, 10, 11], // Less commonly used orbs
        metadata: {
          resonance_score: 0.5
        }
      });
    }

    // Filter by priority and type
    const filteredSuggestions = suggestions
      .filter(suggestion => suggestion.priority >= minPriority)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);

    return NextResponse.json({
      suggestions: filteredSuggestions,
      total: suggestions.length,
      generated_at: new Date().toISOString(),
      version: 'v0.1',
      metadata: {
        content_files_analyzed: contentFiles?.length || 0,
        reflection_logs_analyzed: reflectionLogs?.length || 0,
        filter_applied: {
          type: type || 'all',
          min_priority: minPriority,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Resonance feed API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
