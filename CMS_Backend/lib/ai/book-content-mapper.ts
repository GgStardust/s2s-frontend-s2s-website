/**
 * AI Book Content Mapper
 *
 * Analyzes content files and suggests mappings to book chapters.
 * Follows PROCESSING_WORKFLOW.md and TAG_REGISTRY.md rules.
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface ContentFile {
  id: string;
  title: string;
  file_path: string;
  content_type: string;
  markdown_body: string;
  orb_associations: number[];
  tags: string[];
}

export interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  part_number: number | null;
  part_title: string | null;
  content: string | null;
  notes: string | null;
}

export interface ChapterMapping {
  chapter_id: string;
  chapter_title: string;
  suggested_sources: Array<{
    file_id: string;
    file_title: string;
    relevance_score: number;
    reasoning: string;
    suggested_sections: string[];
    orb_alignment: number[];
  }>;
  content_gaps: string[];
  adaptation_notes: string;
}

export interface BookMapping {
  book_id: string;
  book_title: string;
  book_type: 'non_fiction' | 'fiction';
  chapter_mappings: ChapterMapping[];
  unmapped_content: Array<{
    file_id: string;
    file_title: string;
    reason: string;
  }>;
}

const SYSTEM_PROMPT = `You are an expert content mapper for the "Stardust to Sovereignty" book compilation project.

YOUR ROLE:
Analyze existing essays, codex fragments, and scrollstreams to suggest which content should be used in which book chapters.

CONTENT INTEGRITY RULES (from PROCESSING_WORKFLOW.md):
1. Preserve every word - no abbreviations or summaries
2. Maintain original formatting and structure
3. Preserve all technical terms and specialized language
4. No content is lost or changed
5. Use affirmative definitions only (e.g., "Sovereignty is signal integrity")

13-ORB SYSTEM:
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

CONTENT TYPES:
- codex_core: Foundational framework documents
- book_fragment: Sections already written for books
- scrollstream_entry: Resonant transmissions
- research_notes: Supporting research and observations
- system_architecture: Technical documentation

ANALYSIS TASK:
For each chapter, suggest which content files are most relevant based on:
1. Thematic alignment with chapter title and description
2. Orb associations matching chapter focus
3. Content depth and completeness
4. Natural flow and progression
5. Avoid redundancy across chapters

OUTPUT FORMAT (JSON only):
{
  "chapter_mappings": [
    {
      "chapter_id": "uuid",
      "chapter_title": "string",
      "suggested_sources": [
        {
          "file_id": "uuid",
          "file_title": "string",
          "relevance_score": 0.95,
          "reasoning": "Explains origin intelligence concepts that directly support chapter theme",
          "suggested_sections": ["intro", "mitochondrial_intelligence"],
          "orb_alignment": [1, 2]
        }
      ],
      "content_gaps": ["Need more real-world examples", "Missing transition to chapter 4"],
      "adaptation_notes": "Merge essay intro with book voice, maintain technical terms"
    }
  ]
}`;

/**
 * Suggest content mappings for all chapters in a book
 */
export async function suggestBookContentMapping(
  bookId: string,
  bookTitle: string,
  bookType: 'non_fiction' | 'fiction',
  chapters: Chapter[],
  availableContent: ContentFile[]
): Promise<BookMapping> {
  try {
    // Create a structured representation of the book and content
    const bookContext = {
      book_id: bookId,
      book_title: bookTitle,
      book_type: bookType,
      chapters: chapters.map(ch => ({
        id: ch.id,
        number: ch.chapter_number,
        title: ch.title,
        part: ch.part_number ? `Part ${ch.part_number}: ${ch.part_title}` : null,
        existing_content_length: ch.content?.length || 0,
        notes: ch.notes || '',
      })),
      available_content: availableContent.map(file => ({
        id: file.id,
        title: file.title,
        file_path: file.file_path,
        content_type: file.content_type,
        word_count: file.markdown_body.split(/\s+/).length,
        orb_associations: file.orb_associations,
        tags: file.tags,
        excerpt: file.markdown_body.substring(0, 500) + '...',
      })),
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analyze this book structure and suggest content mappings:\n\n${JSON.stringify(bookContext, null, 2)}\n\nFor each chapter, suggest which content files are most relevant and why. Focus on thematic alignment, Orb associations, and natural flow.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    // Identify unmapped content
    const mappedFileIds = new Set(
      result.chapter_mappings.flatMap((cm: any) =>
        cm.suggested_sources.map((s: any) => s.file_id)
      )
    );

    const unmappedContent = availableContent
      .filter(file => !mappedFileIds.has(file.id))
      .map(file => ({
        file_id: file.id,
        file_title: file.title,
        reason: 'No clear chapter alignment found',
      }));

    return {
      book_id: bookId,
      book_title: bookTitle,
      book_type: bookType,
      chapter_mappings: result.chapter_mappings || [],
      unmapped_content: unmappedContent,
    };
  } catch (error) {
    console.error('Error in suggestBookContentMapping:', error);
    throw error;
  }
}

/**
 * Suggest content for a single chapter
 */
export async function suggestChapterContent(
  chapterTitle: string,
  chapterNotes: string,
  chapterNumber: number,
  bookType: 'non_fiction' | 'fiction',
  availableContent: ContentFile[]
): Promise<ChapterMapping['suggested_sources']> {
  try {
    const chapterContext = {
      chapter_number: chapterNumber,
      chapter_title: chapterTitle,
      chapter_notes: chapterNotes,
      book_type: bookType,
      available_content: availableContent.map(file => ({
        id: file.id,
        title: file.title,
        content_type: file.content_type,
        orb_associations: file.orb_associations,
        tags: file.tags,
        excerpt: file.markdown_body.substring(0, 300) + '...',
      })),
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Suggest the most relevant content files for this chapter:\n\n${JSON.stringify(chapterContext, null, 2)}\n\nReturn top 5 most relevant files with relevance scores and reasoning.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.suggested_sources || [];
  } catch (error) {
    console.error('Error in suggestChapterContent:', error);
    throw error;
  }
}
