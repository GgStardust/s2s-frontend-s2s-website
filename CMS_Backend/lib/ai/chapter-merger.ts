/**
 * AI Chapter Merger
 *
 * Intelligently merges multiple essays/content files into coherent chapters
 * with smooth transitions, maintaining voice and preserving content integrity.
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface SourceContent {
  id: string;
  title: string;
  content: string;
  orb_associations: number[];
  tags: string[];
}

export interface MergedChapter {
  merged_content: string;
  word_count: number;
  transitions_added: number;
  adaptation_notes: string;
  sections: Array<{
    source_id: string;
    source_title: string;
    start_position: number;
    end_position: number;
  }>;
}

const SYSTEM_PROMPT = `You are an expert content compiler for the "Stardust to Sovereignty" book system.

YOUR ROLE:
Merge multiple essays and content pieces into a single, coherent chapter while preserving every word and maintaining the author's voice.

STRICT CONTENT INTEGRITY RULES (from PROCESSING_WORKFLOW.md):
1. **Preserve EVERY word** - Do not summarize, paraphrase, or abbreviate
2. **Maintain original formatting** and structure within each piece
3. **Preserve ALL technical terms** and specialized language exactly as written
4. **No content is lost or changed** - only ADD transitions, never remove or modify
5. **Use affirmative definitions** (e.g., "Sovereignty is signal integrity")
6. **Maintain layered meaning** - do not collapse or simplify complex concepts

VOICE & STYLE GUIDELINES:
- **Authoritative but accessible** - Based on lived experience
- **Preserve layered meaning** - Multi-dimensional concepts maintained
- **Keep technical precision** - S2S-specific terminology unchanged
- **Natural flow** - Transitions should feel organic, not forced

13-ORB SYSTEM AWARENESS:
- Orb 1: Origin Intelligence
- Orb 2: Resonance Mechanics
- Orb 3: Existential Architecture
- Orb 4: Harmonic Emergence
- Orb 5: Temporal Sovereignty
- Orb 6: Starline Memory
- Orb 7: Alchemical Current
- Orb 8: Quantum Perception
- Orb 9: Sovereign Will
- Orb 10: Field Dynamics
- Orb 11: Galactic Integration
- Orb 12: Ascension Mechanics
- Orb 13: Bridging Intelligence

YOUR TASK:
1. **Keep all original content intact** - Every word from every source must appear in the output
2. **Add smooth transitions** between pieces - Connect ideas naturally
3. **Adapt for book voice** - Adjust essay-style intros/outros for chapter context
4. **Create section breaks** where appropriate - Use "###" or "---" for clarity
5. **Maintain Orb thread** - Ensure Orb concepts flow logically through chapter

TRANSITION TECHNIQUES:
- **Thematic bridges**: "This understanding of [concept] leads us to..."
- **Orb connections**: "Having explored Orb X, we now turn to how Orb Y..."
- **Practical to theoretical**: "From this lived experience, we can extract..."
- **Question to answer**: Pose a question that the next section answers
- **Echo and expand**: Reference a previous concept and deepen it

OUTPUT FORMAT:
Return the merged chapter content with transitions added. Mark where each original source begins and ends for tracking.`;

/**
 * Merge multiple content sources into a single coherent chapter
 */
export async function mergeChapterContent(
  chapterTitle: string,
  chapterNotes: string,
  sources: SourceContent[],
  bookType: 'non_fiction' | 'fiction'
): Promise<MergedChapter> {
  try {
    if (sources.length === 0) {
      throw new Error('No sources provided for merging');
    }

    if (sources.length === 1) {
      // Single source - just return it with minimal adaptation
      return {
        merged_content: sources[0].content,
        word_count: sources[0].content.split(/\s+/).length,
        transitions_added: 0,
        adaptation_notes: 'Single source - no merging needed',
        sections: [
          {
            source_id: sources[0].id,
            source_title: sources[0].title,
            start_position: 0,
            end_position: sources[0].content.length,
          },
        ],
      };
    }

    // Multiple sources - merge with AI
    const context = {
      chapter_title: chapterTitle,
      chapter_notes: chapterNotes,
      book_type: bookType,
      source_count: sources.length,
      sources: sources.map(s => ({
        id: s.id,
        title: s.title,
        word_count: s.content.split(/\s+/).length,
        orb_associations: s.orb_associations,
        tags: s.tags,
        content: s.content,
      })),
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Merge these ${sources.length} content pieces into a coherent chapter titled "${chapterTitle}".\n\nIMPORTANT: Preserve EVERY word from EVERY source. Only ADD transitions and adaptations, NEVER remove or change original content.\n\nContext:\n${JSON.stringify(context, null, 2)}\n\nReturn the complete merged chapter with all original content preserved and smooth transitions added.`,
        },
      ],
      temperature: 0.4,
      max_tokens: 16000,
    });

    const mergedContent = response.choices[0].message.content || '';

    // Count transitions (approximate - look for transitional phrases)
    const transitionPatterns = [
      'leads us to',
      'we now turn to',
      'building on this',
      'from this understanding',
      'having explored',
    ];
    const transitionsAdded = transitionPatterns.reduce((count, pattern) => {
      return count + (mergedContent.toLowerCase().match(new RegExp(pattern, 'g')) || []).length;
    }, 0);

    // Track source sections (approximate positions)
    const sections = sources.map((source, index) => {
      const estimatedStart = index * (mergedContent.length / sources.length);
      const estimatedEnd = (index + 1) * (mergedContent.length / sources.length);

      return {
        source_id: source.id,
        source_title: source.title,
        start_position: Math.floor(estimatedStart),
        end_position: Math.floor(estimatedEnd),
      };
    });

    return {
      merged_content: mergedContent,
      word_count: mergedContent.split(/\s+/).length,
      transitions_added: transitionsAdded,
      adaptation_notes: `Merged ${sources.length} sources with transitions`,
      sections,
    };
  } catch (error) {
    console.error('Error in mergeChapterContent:', error);
    throw error;
  }
}

/**
 * Generate transitions between two content pieces
 */
export async function generateTransition(
  fromContent: string,
  toContent: string,
  context: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert writer creating smooth transitions between content sections. Write natural, thematic bridges that connect ideas while maintaining the author\'s voice.',
        },
        {
          role: 'user',
          content: `Create a 2-3 sentence transition between these two content pieces:\n\nContext: ${context}\n\nEnding of previous section:\n${fromContent.substring(fromContent.length - 500)}\n\nBeginning of next section:\n${toContent.substring(0, 500)}\n\nWrite a natural transition that bridges these ideas:`,
        },
      ],
      temperature: 0.5,
      max_tokens: 200,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating transition:', error);
    throw error;
  }
}
