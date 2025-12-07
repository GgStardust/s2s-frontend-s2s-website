/**
 * Orbital Brain Narrative Generation Module
 * 
 * Generates recognition-first openings and narrative bridges using Orbital Brain.
 * Integrates with RBI for field-aware narrative generation.
 * 
 * Part of Layer 5 (Interfaces) of the compiler architecture.
 */

import { EnhancedResonanceEngine } from '../../mathematics/enhanced-resonance-engine.js';
import { generateOrbitalResponse, chatCompletions } from 'orbital-brain';
import { ResonanceVectorMath, type ResonanceVector } from '@/lib/mathematics/resonance-vectors.js';
import { computeResonance } from '@/lib/rbi/core/compute.js';

// Fallback for computeResonanceWithOrbs - uses ResonanceVectorMath
function computeResonanceWithOrbs(
  vector1: ResonanceVector,
  vector2: ResonanceVector,
  orbs: number[]
): number {
  return ResonanceVectorMath.calculateResonanceSimilarity(vector1, vector2);
}
import type { ContentFile, ChapterOutline } from '../types.js';
import type { ContentMetadata, RBIOutput } from 'orbital-brain/types';

export interface OpeningResult {
  content: string;
  rbi_metrics?: {
    coherence: number;
    field_strength: number;
  };
}

export interface BridgeResult {
  content: string;
  resonance: number;
  coherence: number;
}

/**
 * Generate recognition-first opening for a chapter
 * 
 * Creates an opening that grounds the reader in experience before introducing concepts.
 * Uses Orbital Brain to generate field-aware, recognition-first narrative.
 */
export async function generateRecognitionFirstOpening(
  chapter: ChapterOutline,
  sources: ContentFile[],
  stylePrompt?: string
): Promise<OpeningResult> {
  const resonanceEngine = EnhancedResonanceEngine.getInstance();

  // Analyze chapter to get RBI metrics
  const chapterQuery = `${chapter.title} ${chapter.description || ''}`;
  const chapterAnalysis = await resonanceEngine.analyzeContentWithMathematics(
    chapterQuery,
    chapter.title,
    {
      orb_associations: chapter.orb_focus ? [chapter.orb_focus] : []
    }
  );

  // Format RBI output for Orbital Brain
  const rbiOutput: RBIOutput = {
    resonance_metrics: {
      strength: chapterAnalysis.mathematical?.fieldDynamics?.fieldStrength 
        ? Math.round(chapterAnalysis.mathematical.fieldDynamics.fieldStrength * 10) / 10 
        : 0,
      clarity: chapterAnalysis.signature?.clarity 
        ? Math.round(chapterAnalysis.signature.clarity * 10) / 10 
        : 0,
      coherence: chapterAnalysis.mathematical?.sovereignLogic?.coherence 
        ? Math.round(chapterAnalysis.mathematical.sovereignLogic.coherence * 10) / 10 
        : 0,
      pattern: chapterAnalysis.mathematical?.harmonicFrequency?.fundamental 
        ? Math.round(chapterAnalysis.mathematical.harmonicFrequency.fundamental * 10) / 10 
        : 0
    },
    coherence: chapterAnalysis.mathematical?.sovereignLogic?.coherence || 0,
    proof_status: chapterAnalysis.mathematical?.sovereignLogic?.validity || 'unproven',
    mathematical: {
      resonanceVector: chapterAnalysis.mathematical?.resonanceVector,
      fieldDynamics: chapterAnalysis.mathematical?.fieldDynamics,
      sovereignLogic: chapterAnalysis.mathematical?.sovereignLogic
    }
  };

  // Build metadata
  const metadata: ContentMetadata = {
    orb_associations: chapter.orb_focus ? [chapter.orb_focus] : [],
    field_function: {
      content_purpose: `Recognition-first opening for ${chapter.title}`,
      primary_mechanism: 'narrative_generation',
      console_context: 'book_compiler',
      console_relation: 'opening'
    },
    book_threading: `Book : Stardust to Sovereignty, Chapter ${chapter.chapter_number}`
  };

  // Get Orbital Brain interpretation
  const orbitalResponse = await generateOrbitalResponse({
    inquiry: `Create a recognition-first opening for the chapter "${chapter.title}". Ground the reader in experience before introducing concepts. Start with what the reader can recognize and feel, then gently introduce the chapter's themes.`,
    metadata,
    rbi_output: rbiOutput
  });

  // Build system prompt for OpenAI
  let systemPrompt = `You are generating a recognition-first opening for a chapter in the Stardust to Sovereignty book.

## CHAPTER CONTEXT
Title: ${chapter.title}
Description: ${chapter.description || 'No description provided'}

## RECOGNITION-FIRST PRINCIPLES
- Start with EXPERIENCE, not concepts
- Ground the reader in what they can recognize and feel
- Use sensory, embodied language
- Connect to universal human experience
- Then gently introduce chapter themes
- Avoid abstract concepts at the start

## FIELD STATE
- Field State: ${orbitalResponse.orbital_interpretation.field_state}
- Narrative Coherence: ${(orbitalResponse.orbital_interpretation.narrative_coherence * 100).toFixed(0)}%
- Primary Orb: ${orbitalResponse.orbital_interpretation.primary_orb || 'None'}`;

  // Add Orb personality if available
  if (orbitalResponse.orbital_interpretation.primary_orb) {
    // Note: Orb personality loading would go here (similar to conversation route)
    systemPrompt += `\n\n## ORB PERSONALITY
When writing, embody the voice of Orb ${orbitalResponse.orbital_interpretation.primary_orb}.`;
  }

  // Add style training if provided
  if (stylePrompt) {
    systemPrompt += `\n\n${stylePrompt}`;
  }

  // Generate opening using OpenAI
  const opening = await chatCompletions({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Write a recognition-first opening (2-4 paragraphs) for the chapter "${chapter.title}". Start with experience, then introduce themes.`
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return {
    content: opening || orbitalResponse.content,
    rbi_metrics: {
      coherence: rbiOutput.coherence || 0,
      field_strength: rbiOutput.mathematical?.fieldDynamics?.fieldStrength || 0
    }
  };
}

/**
 * Generate narrative bridge between two sections
 * 
 * Creates a smooth transition that maintains coherence and flow.
 */
export async function generateBridge(
  source1: ContentFile,
  source2: ContentFile,
  stylePrompt?: string
): Promise<BridgeResult> {
  const resonanceEngine = EnhancedResonanceEngine.getInstance();

  // Analyze both sources
  const [analysis1, analysis2] = await Promise.all([
    resonanceEngine.analyzeContentWithMathematics(
      source1.content,
      source1.title,
      {
        orb_associations: source1.orb_tags.length > 0 ? source1.orb_tags : undefined
      }
    ),
    resonanceEngine.analyzeContentWithMathematics(
      source2.content,
      source2.title,
      {
        orb_associations: source2.orb_tags.length > 0 ? source2.orb_tags : undefined
      }
    )
  ]);

  // Calculate resonance between sources
  const allOrbs = [...new Set([...source1.orb_tags, ...source2.orb_tags])];
  const resonance = allOrbs.length > 0
    ? computeResonanceWithOrbs(
        analysis1.mathematical.resonanceVector,
        analysis2.mathematical.resonanceVector,
        allOrbs
      )
    : ResonanceVectorMath.calculateResonanceSimilarity(
        analysis1.mathematical.resonanceVector,
        analysis2.mathematical.resonanceVector
      );

  const coherence = (analysis1.mathematical.sovereignLogic.coherence +
                    analysis2.mathematical.sovereignLogic.coherence) / 2;

  // Format RBI output
  const rbiOutput: RBIOutput = {
    resonance_metrics: {
      strength: Math.round((analysis1.mathematical.fieldDynamics.fieldStrength +
                           analysis2.mathematical.fieldDynamics.fieldStrength) / 2 * 10) / 10,
      clarity: Math.round((analysis1.signature.clarity + analysis2.signature.clarity) / 2 * 10) / 10,
      coherence: Math.round(coherence * 10) / 10,
      pattern: Math.round((analysis1.mathematical.harmonicFrequency.fundamental +
                          analysis2.mathematical.harmonicFrequency.fundamental) / 2 * 10) / 10
    },
    coherence,
    proof_status: analysis1.mathematical.sovereignLogic.validity === 'proven' &&
                  analysis2.mathematical.sovereignLogic.validity === 'proven'
      ? 'proven'
      : 'partial',
    mathematical: {
      resonanceVector: analysis1.mathematical.resonanceVector,
      fieldDynamics: {
        fieldStrength: (analysis1.mathematical.fieldDynamics.fieldStrength +
                        analysis2.mathematical.fieldDynamics.fieldStrength) / 2,
        coherence,
        stability: (analysis1.mathematical.fieldDynamics.stability +
                   analysis2.mathematical.fieldDynamics.stability) / 2
      }
    }
  };

  // Build metadata
  const metadata: ContentMetadata = {
    orb_associations: allOrbs.length > 0 ? allOrbs : undefined,
    field_function: {
      content_purpose: `Bridge between "${source1.title}" and "${source2.title}"`,
      primary_mechanism: 'narrative_bridge',
      console_context: 'book_compiler',
      console_relation: 'transition'
    }
  };

  // Get Orbital Brain interpretation
  const orbitalResponse = await generateOrbitalResponse({
    inquiry: `Create a smooth narrative bridge connecting these two sections. Maintain coherence and flow.`,
    metadata,
    rbi_output: rbiOutput
  });

  // Build system prompt
  let systemPrompt = `You are generating a narrative bridge between two sections in the Stardust to Sovereignty book.

## SECTION 1
Title: ${source1.title}
Content Preview: ${source1.content.substring(0, 200)}...

## SECTION 2
Title: ${source2.title}
Content Preview: ${source2.content.substring(0, 200)}...

## BRIDGE REQUIREMENTS
- Create smooth transition between sections
- Maintain coherence and flow
- Connect themes naturally
- Keep it concise (1-2 paragraphs)
- Preserve narrative momentum`;

  // Add style training if provided
  if (stylePrompt) {
    systemPrompt += `\n\n${stylePrompt}`;
  }

  // Generate bridge using OpenAI
  const bridge = await chatCompletions({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Write a narrative bridge (1-2 paragraphs) connecting "${source1.title}" to "${source2.title}".`
      }
    ],
    temperature: 0.7,
    max_tokens: 300
  });

  return {
    content: bridge || orbitalResponse.content,
    resonance,
    coherence
  };
}

/**
 * Generate bridges for all gaps in ordered sources
 */
export async function generateBridgesForGaps(
  orderedSources: ContentFile[],
  stylePrompt?: string
): Promise<Array<{ position: number; bridge: BridgeResult }>> {
  if (orderedSources.length < 2) {
    return [];
  }

  const bridges: Array<{ position: number; bridge: BridgeResult }> = [];

  for (let i = 0; i < orderedSources.length - 1; i++) {
    const source1 = orderedSources[i];
    const source2 = orderedSources[i + 1];

    try {
      const bridge = await generateBridge(source1, source2, stylePrompt);
      
      // Only add bridge if resonance is below threshold (indicates gap)
      if (bridge.resonance < 0.6) {
        bridges.push({
          position: i + 1, // Insert after source1
          bridge
        });
      }
    } catch (error) {
      console.warn(`Warning: Failed to generate bridge between ${source1.title} and ${source2.title}:`, error);
    }
  }

  return bridges;
}

