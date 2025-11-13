import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { orbitalContextService } from '@/lib/orbital-context';
import { EnhancedResonanceEngine } from '@/lib/mathematics/enhanced-resonance-engine';
import { computeResonance, calculateJaccardSimilarity } from '@/lib/rbi/core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Resonance-based source selection for Book Compiler
 * Uses R_ij scoring algorithm from manual process
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chapter_id, max_sources = 3, orb_focus } = body;

    if (!chapter_id) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get chapter details
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapter_id)
      .single();

    if (chapterError) {
      console.error('Error fetching chapter:', chapterError);
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // Get all content files for resonance analysis - include full YAML frontmatter
    // Filter to only essays (exclude book_output - compiled chapters should not be used as sources)
    // Also exclude system references (core framework files are reference only, not source content)
    const { data: contentFiles, error: contentError } = await supabase
      .from('content_files')
      .select('*')
      .eq('type', 'essay')  // Only use essays as sources, not compiled book_output
      .order('created_at', { ascending: false });

    if (contentError) {
      console.error('Error fetching content files:', contentError);
      return NextResponse.json(
        { error: 'Failed to fetch content files' },
        { status: 500 }
      );
    }

    if (!contentFiles || contentFiles.length === 0) {
      return NextResponse.json(
        { error: 'No content files available' },
        { status: 400 }
      );
    }

    // Filter content files based on special handling metadata
    // System references can be included if use_in_book_compiler is true
    const filteredContentFiles = contentFiles.filter((file: any) => {
      const yaml = file.yaml_frontmatter || {};
      
      // Exclude system references unless explicitly allowed
      if (yaml.source_type === 'system_reference' || yaml.system_role === 'core_framework') {
        // Check if framework file should be included
        if (yaml.use_in_book_compiler === true) {
          // Framework file can be included - will be weighted by inclusion_weight
          return true;
        }
        // Exclude system references that aren't meant for compiler
        return false;
      }
      
      // Include all regular essays
      return true;
    });

    // Initialize Enhanced Resonance Engine
    const resonanceEngine = EnhancedResonanceEngine.getInstance();

    // Extract inline tags helper
    function extractInlineTags(content: string): { orbTags: number[]; allTags: string[] } {
      const orbTags: number[] = [];
      const allTags: string[] = [];
      
      // Extract @orb tags
      const orbMatches = content.matchAll(/@orb[_\s]*(\d+)/gi);
      for (const match of orbMatches) {
        const orbNum = parseInt(match[1]);
        if (orbNum >= 1 && orbNum <= 13) {
          orbTags.push(orbNum);
          allTags.push(`@orb_${orbNum}`);
        }
      }
      
      // Extract other @tags
      const tagMatches = content.matchAll(/@([a-z_]+)/gi);
      for (const match of tagMatches) {
        const tag = match[1].toLowerCase();
        if (!allTags.includes(`@${tag}`) && tag !== 'orb' && !tag.startsWith('orb')) {
          allTags.push(`@${tag}`);
        }
      }
      
      return {
        orbTags: Array.from(new Set(orbTags)).sort((a, b) => a - b),
        allTags: Array.from(new Set(allTags))
      };
    }

    // Calculate resonance scores for all content files using rich YAML metadata
    const scoredContent = await Promise.all(
      filteredContentFiles.map(async (file) => {
        const content = file.content || file.markdown_body || '';
        
        // Extract YAML frontmatter
        const yaml = file.yaml_frontmatter || {};
        const fieldFunction = yaml.field_function || {};
        const bookThreading = yaml.book_threading || '';
        const integrationPoints = yaml.integration_points || [];
        
        // Extract inline tags from content
        const inlineTags = extractInlineTags(content);
        
        // Get Orb associations from YAML or extracted column
        let orbAssociations: number[] = [];
        if (file.orb_associations && Array.isArray(file.orb_associations)) {
          orbAssociations = file.orb_associations;
        } else if (yaml.orb_associations) {
          // Extract from YAML orb_associations (could be object or array)
          if (Array.isArray(yaml.orb_associations)) {
            orbAssociations = yaml.orb_associations
              .map((orb: any) => {
                if (typeof orb === 'number') return orb;
                if (typeof orb === 'string') {
                  const match = orb.match(/Orb\s*(\d+)/i);
                  return match ? parseInt(match[1]) : null;
                }
                return null;
              })
              .filter((n: any): n is number => n !== null);
          } else if (yaml.orb_associations.primary_orb) {
            const primaryMatch = String(yaml.orb_associations.primary_orb).match(/Orb\s*(\d+)/i);
            if (primaryMatch) orbAssociations.push(parseInt(primaryMatch[1]));
            if (yaml.orb_associations.secondary_orbs) {
              yaml.orb_associations.secondary_orbs.forEach((orb: any) => {
                const match = String(orb).match(/Orb\s*(\d+)/i);
                if (match) orbAssociations.push(parseInt(match[1]));
              });
            }
          }
        }
        
        // Combine YAML orb associations with inline orb tags
        const allOrbAssociations = Array.from(new Set([...orbAssociations, ...inlineTags.orbTags]));
        
        // METADATA-FIRST: Extract metadata BEFORE calling RBI
        const metadata = {
          orb_associations: allOrbAssociations,
          field_function: fieldFunction,
          book_threading: typeof bookThreading === 'object' ? bookThreading : undefined,
          integration_points: typeof integrationPoints === 'object' ? integrationPoints : undefined,
          tags: inlineTags.allTags
        };
        
        // Get Orbital context
        const orbitalContext = await orbitalContextService.getOrbitalContext(
          content,
          file.title
        );
        
        // Analyze with Enhanced Resonance Engine - NOW WITH METADATA
        const resonanceAnalysis = await resonanceEngine.analyzeContentWithMathematics(
          content,
          file.title,
          metadata
        );
        
        // Calculate enhanced resonance score using YAML metadata
        const resonanceScore = calculateEnhancedResonanceScore(
          orbitalContext.resonanceMetrics,
          allOrbAssociations,
          chapter.orb_focus || orb_focus,
          {
            fieldFunction,
            bookThreading,
            integrationPoints,
            inlineTags: inlineTags.allTags,
            chapterTitle: chapter.title,
            chapterDescription: chapter.description || ''
          }
        );
        
        return {
          ...file,
          resonanceScore,
          orbitalContext,
          resonanceAnalysis,
          yamlMetadata: {
            fieldFunction,
            bookThreading,
            integrationPoints,
            inlineTags: inlineTags.allTags,
            inlineOrbTags: inlineTags.orbTags
          }
        };
      })
    );

    // Sort by resonance score and select top sources
    const selectedSources = scoredContent
      .sort((a, b) => b.resonanceScore - a.resonanceScore)
      .slice(0, max_sources);

    // Format response
    const response = {
      chapter_id,
      chapter_title: chapter.title,
      selected_sources: selectedSources.map(source => ({
        id: source.id,
        title: source.title,
        content_type: source.content_type,
        orb_associations: source.orb_associations,
        resonance_score: source.resonanceScore,
        resonance_metrics: source.orbitalContext.resonanceMetrics,
        tags: source.tags,
        file_path: source.file_path,
        yaml_metadata: source.yamlMetadata,
        book_threading: source.yamlMetadata?.bookThreading,
        field_function: source.yamlMetadata?.fieldFunction,
        integration_points: source.yamlMetadata?.integrationPoints,
        inline_tags: source.yamlMetadata?.inlineTags
      })),
      total_analyzed: contentFiles.length,
      selection_criteria: {
        max_sources,
        orb_focus: chapter.orb_focus || orb_focus,
        algorithm: 'R_ij resonance scoring'
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in resonance source selection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Calculate enhanced resonance score using rich YAML metadata
 * R_ij = (vectorSimilarity × 0.3) + (orbOverlap × 0.3) + (bookThreading × 0.15) + (fieldFunction × 0.15) + (integrationPoints × 0.1)
 */
function calculateEnhancedResonanceScore(
  resonanceMetrics: { strength: number; clarity: number; coherence: number; pattern: number },
  orbAssociations: number[],
  chapterOrbFocus: string | null | undefined,
  metadata: {
    fieldFunction: any;
    bookThreading: string;
    integrationPoints: string[];
    inlineTags: string[];
    chapterTitle: string;
    chapterDescription: string;
  }
): number {
  // Vector similarity: normalize 4D resonance metrics to 0-1 scale
  const vectorSimilarity = (
    resonanceMetrics.strength + 
    resonanceMetrics.clarity + 
    resonanceMetrics.coherence + 
    resonanceMetrics.pattern
  ) / 40;
  
  // Orb overlap: Jaccard similarity between Orb associations
  const chapterOrbs = chapterOrbFocus ? [parseInt(chapterOrbFocus)] : [];
  const orbOverlap = calculateJaccardSimilarity(orbAssociations, chapterOrbs);
  
  // Book threading match: check if content is threaded for "Stardust to Sovereignty"
  const bookThreadingScore = metadata.bookThreading && 
    (metadata.bookThreading.includes('Stardust to Sovereignty') || 
     metadata.bookThreading.includes('Book : Stardust to Sovereignty') ||
     metadata.bookThreading.includes('Book 1')) ? 1.0 : 0.0;
  
  // Field function match: check if content_purpose matches chapter topic
  const contentPurpose = metadata.fieldFunction?.content_purpose || '';
  const chapterText = `${metadata.chapterTitle} ${metadata.chapterDescription}`.toLowerCase();
  const purposeWords = contentPurpose.toLowerCase().split(/\s+/);
  const chapterWords = chapterText.split(/\s+/);
  const matchingWords = purposeWords.filter(word => 
    word.length > 4 && chapterWords.some(cw => cw.includes(word) || word.includes(cw))
  );
  const fieldFunctionScore = Math.min(matchingWords.length / 3, 1.0); // Cap at 1.0
  
  // Integration points: prioritize content designed for Book Compiler
  const integrationScore = metadata.integrationPoints.includes('Book Compiler') ? 1.0 :
                          metadata.integrationPoints.includes('book_fragments') ? 0.7 :
                          metadata.integrationPoints.length > 0 ? 0.3 : 0.0;
  
  // Calculate weighted score
  const enhancedScore = (
    vectorSimilarity * 0.3 +
    orbOverlap * 0.3 +
    bookThreadingScore * 0.15 +
    fieldFunctionScore * 0.15 +
    integrationScore * 0.1
  );
  
  return Math.min(Math.max(enhancedScore, 0), 1); // Clamp to 0-1
}

/**
 * Legacy function for backward compatibility
 */
function calculateResonanceScore(
  resonanceMetrics: { strength: number; clarity: number; coherence: number; pattern: number },
  orbAssociations: number[],
  chapterOrbFocus?: string | null
): number {
  const vectorSimilarity = (
    resonanceMetrics.strength + 
    resonanceMetrics.clarity + 
    resonanceMetrics.coherence + 
    resonanceMetrics.pattern
  ) / 40;
  
  const chapterOrbs = chapterOrbFocus ? [parseInt(chapterOrbFocus)] : [];
  const orbOverlap = calculateJaccardSimilarity(orbAssociations, chapterOrbs);
  const temporalDecay = 1.0;
  
  const resonanceScore = computeResonance({
    vectorSimilarity,
    orbOverlap,
    temporalDecay
  });
  
  return Math.min(Math.max(resonanceScore, 0), 1);
}

