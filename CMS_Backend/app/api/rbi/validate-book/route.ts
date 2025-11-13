/**
 * RBI Book Validation API
 * 
 * Validates compiled book using RBI validation mode:
 * - Coherence scores across all chapters
 * - Proof-of-meaning structures
 * - Resonance vectors
 * - Cross-chapter coherence
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EnhancedResonanceEngine } from '@/lib/mathematics/enhanced-resonance-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { book_id } = body;

    if (!book_id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get book details
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', book_id)
      .single();

    if (bookError || !book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Get all chapters for this book
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', book_id)
      .order('chapter_number', { ascending: true });

    if (chaptersError) {
      return NextResponse.json(
        { error: 'Failed to fetch chapters' },
        { status: 500 }
      );
    }

    if (!chapters || chapters.length === 0) {
      return NextResponse.json(
        { error: 'No chapters found for this book' },
        { status: 400 }
      );
    }

    // Initialize Enhanced Resonance Engine
    const resonanceEngine = EnhancedResonanceEngine.getInstance();

    // Validate each chapter
    const chapterValidations = await Promise.all(
      chapters.map(async (chapter: any) => {
        const content = chapter.content || '';
        
        if (!content || content.trim() === '') {
          return {
            chapter_id: chapter.id,
            chapter_number: chapter.chapter_number,
            chapter_title: chapter.title,
            status: 'empty',
            coherence: 0,
            proof_status: 'unproven',
            errors: ['Chapter has no content']
          };
        }

        // METADATA-FIRST: Extract metadata from chapter if available
        const chapterMetadata = chapter.yaml_frontmatter ? {
          orb_associations: chapter.orb_focus ? [parseInt(chapter.orb_focus)] : 
                           (chapter.yaml_frontmatter.orb_associations || []),
          field_function: chapter.yaml_frontmatter.field_function,
          book_threading: chapter.yaml_frontmatter.book_threading,
          integration_points: chapter.yaml_frontmatter.integration_points,
          tags: chapter.yaml_frontmatter.tags || []
        } : undefined;
        
        // Analyze chapter with Enhanced Resonance Engine - WITH METADATA
        const analysis = await resonanceEngine.analyzeContentWithMathematics(
          content,
          chapter.title,
          chapterMetadata
        );

        // Extract proof status
        const proofStatus = analysis.mathematical?.sovereignLogic?.validity || 'unproven';
        const coherence = analysis.mathematical?.sovereignLogic?.coherence || 0;
        const sovereignty = analysis.mathematical?.sovereignLogic?.sovereignty || 0;

        return {
          chapter_id: chapter.id,
          chapter_number: chapter.chapter_number,
          chapter_title: chapter.title,
          status: proofStatus === 'proven' ? 'valid' : proofStatus === 'partial' ? 'partial' : 'unproven',
          coherence,
          sovereignty,
          proof_status: proofStatus,
          resonance_metrics: {
            strength: analysis.resonance?.strength || 0,
            clarity: analysis.resonance?.clarity || 0,
            coherence: analysis.resonance?.coherence || 0,
            pattern: analysis.resonance?.pattern || 0
          },
          proof_structure: analysis.mathematical?.sovereignLogic || null
        };
      })
    );

    // Calculate overall book metrics
    const overallCoherence = chapterValidations.reduce((sum, ch) => sum + ch.coherence, 0) / chapterValidations.length;
    const provenChapters = chapterValidations.filter(ch => ch.proof_status === 'proven').length;
    const partialChapters = chapterValidations.filter(ch => ch.proof_status === 'partial').length;
    const unprovenChapters = chapterValidations.filter(ch => ch.proof_status === 'unproven').length;

    // Check cross-chapter coherence (simplified - could be enhanced)
    const avgResonanceStrength = chapterValidations.reduce(
      (sum, ch) => sum + (ch.resonance_metrics?.strength || 0), 
      0
    ) / chapterValidations.length;

    const avgResonanceClarity = chapterValidations.reduce(
      (sum, ch) => sum + (ch.resonance_metrics?.clarity || 0), 
      0
    ) / chapterValidations.length;

    return NextResponse.json({
      success: true,
      book_id,
      book_title: book.title,
      validation: {
        overall_coherence: overallCoherence,
        overall_status: overallCoherence >= 0.7 ? 'coherent' : overallCoherence >= 0.5 ? 'partial' : 'incoherent',
        chapter_count: chapters.length,
        proven_chapters: provenChapters,
        partial_chapters: partialChapters,
        unproven_chapters: unprovenChapters,
        average_resonance_strength: avgResonanceStrength,
        average_resonance_clarity: avgResonanceClarity
      },
      chapters: chapterValidations,
      metadata: {
        validated_at: new Date().toISOString(),
        rbi_version: 'dynamic'
      }
    });

  } catch (error) {
    console.error('Error validating book:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

