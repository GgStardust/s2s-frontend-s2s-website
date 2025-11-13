import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { orbitalContextService } from '@/lib/orbital-context';
import { proofLogger } from '@/lib/proof-logger';
import { EnhancedResonanceEngine } from '@/lib/mathematics/enhanced-resonance-engine';
import { computeResonance, calculateJaccardSimilarity } from '@/lib/rbi/core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Merge chapter sources into chapter content with Orbital Brain + Mathematical Resonance Layer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chapter_id, generation_params, linked_sources, referenced_files } = body;

    if (!chapter_id) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      );
    }

    // Validate generation parameters
    if (linked_sources && linked_sources.length > 3) {
      return NextResponse.json(
        { error: 'Too many linked sources. Limit to 3 per chapter.' },
        { status: 400 }
      );
    }

    // Set default generation parameters
    const params = generation_params || {
      max_words: 3000,
      include_scrollstreams: true,
      include_notes: true,
      linked_orbs_only: true
    };

    const supabase = await createClient();

    // Get chapter details with book information
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select(`
        *,
        books (
          id,
          type,
          title
        )
      `)
      .eq('id', chapter_id)
      .single();

    if (chapterError) {
      console.error('Error fetching chapter:', chapterError);
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // Get book type for fiction detection
    const book = (chapter as any).books;
    const isFiction = book?.type === 'fiction';

    // Get chapter sources with content OR use resonance-based selection
    let sources = [];
    
    if (linked_sources && linked_sources.length > 0) {
      // Use resonance-based source selection from linked_sources
      const { data: contentFiles, error: contentError } = await supabase
        .from('content_files')
        .select('*')
        .in('id', linked_sources);
      
      if (contentError) {
        console.error('Error fetching linked sources:', contentError);
        return NextResponse.json(
          { error: 'Failed to fetch linked sources' },
          { status: 500 }
        );
      }
      
      // Validate that all sources are essays (not book_output)
      const invalidSources = contentFiles.filter(f => f.type !== 'essay');
      if (invalidSources.length > 0) {
        return NextResponse.json(
          { error: `Invalid source types: only "essay" type files can be used as sources. Found: ${invalidSources.map(f => f.type).join(', ')}` },
          { status: 400 }
        );
      }
      
      // Convert content files to source format
      sources = contentFiles.map(file => ({
        id: `source_${file.id}`,
        source_file_id: file.id,
        source_type: 'resonance_selected',
        content_files: file
      }));
    } else {
      // Fallback to existing chapter_sources method
      const { data: chapterSources, error: sourcesError } = await supabase
        .from('chapter_sources')
        .select(`
          *,
          content_files (
            id,
            title,
            content,
            markdown_body,
            file_path,
            content_type,
            orb_associations,
            tags,
            resonance_rating,
            resonance_metrics
          )
        `)
        .eq('chapter_id', chapter_id);

      if (sourcesError) {
        console.error('Error fetching chapter sources:', sourcesError);
        return NextResponse.json(
          { error: 'Failed to fetch chapter sources' },
          { status: 500 }
        );
      }
      
      sources = chapterSources || [];
      
      // Validate that all sources from chapter_sources are essays
      const invalidChapterSources = sources.filter(s => 
        s.content_files && s.content_files.content_type && 
        s.content_files.content_type !== 'essay'
      );
      if (invalidChapterSources.length > 0) {
        return NextResponse.json(
          { error: `Invalid source types in chapter_sources: only "essay" type files can be used. Found: ${invalidChapterSources.map(s => s.content_files?.content_type).join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Initialize Enhanced Resonance Engine
    const resonanceEngine = EnhancedResonanceEngine.getInstance();

    // Generate merged content with AI assistance using resonance-based selection
    let mergedContent = `# ${chapter.title}\n\n`;
    
    if (chapter.content) {
      mergedContent += `## Current Content\n\n${chapter.content}\n\n`;
    }

    if (sources && sources.length > 0) {
      mergedContent += `## Source Materials\n\n`;
      
      // Process each source with Orbital context and resonance analysis
      for (const [index, source] of sources.entries()) {
        if (source.content_files) {
          const sourceContent = source.content_files.content || source.content_files.markdown_body || '';
          
          // Get Orbital context for this source
          const orbitalContext = await orbitalContextService.getOrbitalContext(
            sourceContent,
            source.content_files.title
          );
          
          // Analyze source with Enhanced Resonance Engine
          const resonanceAnalysis = await resonanceEngine.analyzeContentWithMathematics(sourceContent);
          
          // Calculate resonance score (R_ij) using the manual process method
          const resonanceScore = calculateResonanceScore(
            orbitalContext.resonanceMetrics,
            source.content_files.orb_associations || [],
            chapter.orb_focus
          );
          
          mergedContent += `### Source ${index + 1}: ${source.content_files.title}\n\n`;
          mergedContent += `**Orb Associations:** ${orbitalContext.orbAssociations.join(', ')}\n\n`;
          mergedContent += `**Resonance Metrics:** Strength: ${orbitalContext.resonanceMetrics.strength.toFixed(1)}, Clarity: ${orbitalContext.resonanceMetrics.clarity.toFixed(1)}, Coherence: ${orbitalContext.resonanceMetrics.coherence.toFixed(1)}, Pattern: ${orbitalContext.resonanceMetrics.pattern.toFixed(1)}\n\n`;
          mergedContent += `**Resonance Score (R_ij):** ${resonanceScore.toFixed(3)}\n\n`;
          mergedContent += `${sourceContent}\n\n`;
          mergedContent += `---\n\n`;
        }
      }
    }

    // For fiction: detect orb associations and load personality
    let orbContext: number | undefined;
    if (isFiction) {
      // Extract orb number from chapter metadata (orb_focus or orb_associations)
      const orbFocus = (chapter as any).orb_focus || '';
      const orbAssociations = (chapter as any).orb_associations || [];
      
      // Try to extract orb number from orb_focus (e.g., "Orb 2: Resonance Mechanics")
      const orbFocusMatch = orbFocus.match(/Orb\s+(\d+)/i);
      if (orbFocusMatch) {
        orbContext = parseInt(orbFocusMatch[1]);
      } else if (Array.isArray(orbAssociations) && orbAssociations.length > 0) {
        // Try first orb association
        const firstOrb = orbAssociations[0];
        const orbMatch = typeof firstOrb === 'string' ? firstOrb.match(/Orb\s+(\d+)/i) : null;
        if (orbMatch) {
          orbContext = parseInt(orbMatch[1]);
        }
      }
    }

    // Generate AI-written chapter content using the conversation API
    let aiGeneratedContent = '';
    try {
      // Build prompt based on content type
      const basePrompt = isFiction
        ? `Please write a complete fiction chapter for "${chapter.title}" using the following source materials. Create a cohesive, well-written chapter that integrates the resonance-matched sources into a flowing narrative. This is fiction content - focus on narrative flow, character voice, and storytelling.

Source Materials:
${mergedContent}

Requirements:
- Write a complete fiction chapter (${params.max_words || 3000} words)
- Integrate the source materials seamlessly into the narrative
- Maintain character voice consistency
- Create smooth transitions between scenes and ideas
- Use the resonance metrics to guide content flow
- Focus on storytelling and narrative coherence`
        : `Please write a complete chapter for "${chapter.title}" using the following source materials. Create a cohesive, well-written chapter that integrates the resonance-matched sources into a flowing narrative. Follow the S2S writing style and maintain Orb coherence.

Source Materials:
${mergedContent}

Requirements:
- Write a complete chapter (${params.max_words || 3000} words)
- Integrate the source materials seamlessly
- Maintain the S2S writing style and voice
- Ensure Orb coherence and resonance
- Create smooth transitions between ideas
- Use the resonance metrics to guide content flow`;

      const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `${basePrompt}

Please provide the complete chapter content in a code block.`
            }
          ],
          currentContent: mergedContent,
          title: chapter.title,
          orbContext: orbContext // Pass orb personality context for fiction
        })
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        aiGeneratedContent = aiData.response || '';
        
        // Extract content from code blocks if present
        if (aiGeneratedContent.includes('```')) {
          const codeBlocks = aiGeneratedContent.match(/```[\s\S]*?```/g);
          if (codeBlocks && codeBlocks.length > 0) {
            aiGeneratedContent = codeBlocks[0].replace(/```/g, '').trim();
          }
        }
      }
    } catch (error) {
      console.error('AI generation error:', error);
      // Fallback to source concatenation if AI fails
      aiGeneratedContent = mergedContent;
    }

    // Use AI-generated content if available, otherwise fallback to merged sources
    const finalContent = aiGeneratedContent || mergedContent;

    // Analyze merged content with Enhanced Resonance Engine
    const mergedAnalysis = await resonanceEngine.analyzeContentWithMathematics(mergedContent);
    
    // Get Orbital context for merged content
    const mergedOrbitalContext = await orbitalContextService.getOrbitalContext(
      mergedContent,
      chapter.title
    );

    // Log proof for chapter compilation
    const proofLog = await proofLogger.logChapterCompilation(
      chapter_id,
      sources || [],
      mergedContent,
      {
        isValid: mergedAnalysis.mathematical?.sovereignLogic?.validity === 'proven' || false,
        coherence: mergedAnalysis.mathematical?.sovereignLogic?.coherence || 0,
        sovereignty: mergedAnalysis.mathematical?.sovereignLogic?.sovereignty || 0,
        proof: mergedAnalysis.mathematical?.sovereignLogic
      }
    );

         // Update chapter with AI-generated content and new metadata
         // Only update fields that exist in the current schema
         const updateData: any = {
           content: finalContent,
           updated_at: new Date().toISOString()
         };

         // Add mathematical layer fields if they exist in the schema
         try {
           // Check if mathematical layer columns exist
           const { data: columns } = await supabase
             .from('information_schema.columns')
             .select('column_name')
             .eq('table_name', 'chapters')
             .in('column_name', ['orb_associations', 'resonance_metrics', 'resonance_vector', 'sovereign_proof', 'proof_log_id']);

           if (columns) {
             const existingColumns = columns.map(col => col.column_name);
             
             if (existingColumns.includes('orb_associations')) {
               updateData.orb_associations = mergedOrbitalContext.orbAssociations;
             }
             if (existingColumns.includes('resonance_metrics')) {
               updateData.resonance_metrics = mergedOrbitalContext.resonanceMetrics;
             }
             if (existingColumns.includes('resonance_vector')) {
               updateData.resonance_vector = mergedAnalysis.mathematical?.resonanceVector;
             }
             if (existingColumns.includes('sovereign_proof')) {
               updateData.sovereign_proof = mergedAnalysis.mathematical?.sovereignLogic;
             }
             if (existingColumns.includes('proof_log_id')) {
               updateData.proof_log_id = proofLog.id;
             }
           }
         } catch (schemaError) {
           console.log('Schema check failed, using basic update:', schemaError);
         }

         const { error: updateError } = await supabase
           .from('chapters')
           .update(updateData)
           .eq('id', chapter_id);

    if (updateError) {
      console.error('Error updating chapter:', updateError);
      return NextResponse.json(
        { error: 'Failed to update chapter' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Chapter merged successfully with Orbital Brain + Mathematical Resonance Layer',
      chapter_id,
      sources_count: sources?.length || 0,
      content_length: finalContent.length,
      orbitalContext: mergedOrbitalContext,
      mathematicalAnalysis: mergedAnalysis.mathematical,
      coherenceValidation: {
        isValid: mergedAnalysis.mathematical?.sovereignLogic?.validity === 'proven' || false,
        coherence: mergedAnalysis.mathematical?.sovereignLogic?.coherence || 0,
        sovereignty: mergedAnalysis.mathematical?.sovereignLogic?.sovereignty || 0
      },
      proofLog: {
        id: proofLog.id,
        type: proofLog.type,
        overallValidity: proofLog.overallValidity,
        steps: proofLog.steps.length
      }
    });

  } catch (error) {
    console.error('Chapter merge error:', error);
    return NextResponse.json(
      { error: 'Failed to merge chapter' },
      { status: 500 }
    );
  }
}

/**
 * Calculate resonance score (R_ij) using RBI kernel
 * R_ij = (vectorSimilarity × 0.4) + (orbOverlap × 0.4) + (temporalDecay × 0.2)
 * 
 * Uses RBI core library for standardized calculations
 */
function calculateResonanceScore(
  resonanceMetrics: { strength: number; clarity: number; coherence: number; pattern: number },
  orbAssociations: number[],
  chapterOrbFocus?: string | null
): number {
  // Vector similarity: normalize 4D resonance metrics to 0-1 scale
  // Assuming metrics are on 1-10 scale, divide by 40 to get 0-1 range
  const vectorSimilarity = (
    resonanceMetrics.strength + 
    resonanceMetrics.clarity + 
    resonanceMetrics.coherence + 
    resonanceMetrics.pattern
  ) / 40;
  
  // Orb overlap: Jaccard similarity between Orb associations
  const chapterOrbs = chapterOrbFocus ? [parseInt(chapterOrbFocus)] : [];
  const orbOverlap = calculateJaccardSimilarity(orbAssociations, chapterOrbs);
  
  // Temporal decay: exponential decay factor (assume recent content)
  const temporalDecay = 1.0; // No decay for now
  
  // Calculate final resonance score using RBI kernel
  const resonanceScore = computeResonance({
    vectorSimilarity,
    orbOverlap,
    temporalDecay
  });
  
  return Math.min(Math.max(resonanceScore, 0), 1); // Clamp to 0-1
}