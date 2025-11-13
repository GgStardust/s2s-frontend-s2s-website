/**
 * AI Book Compiler Service
 *
 * Uses OpenAI to:
 * - Suggest which essays fit which chapters
 * - Generate transitions between essays
 * - Adapt voice for book flow
 * - Merge content intelligently
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChapterSuggestion {
  chapter_number: number;
  chapter_title: string;
  suggested_essays: Array<{
    file_id: string;
    file_title: string;
    relevance_score: number;
    reasoning: string;
  }>;
}

export interface MergedChapter {
  merged_content: string;
  word_count: number;
  transitions_added: number;
  adaptation_notes: string;
}

/**
 * Analyze essays and suggest which fit each chapter
 */
export async function suggestEssaysForChapter(
  chapterTitle: string,
  chapterDescription: string,
  availableEssays: Array<{ id: string; title: string; content: string; orb_associations: number[] }>
): Promise<ChapterSuggestion['suggested_essays']> {
  const essaysSummary = availableEssays.map(e => ({
    id: e.id,
    title: e.title,
    orb_associations: e.orb_associations,
    excerpt: e.content.substring(0, 500),
  }));

  const prompt = `You are helping compile a book called "Stardust to Sovereignty" - a consciousness technology framework based on the 13-Orb system.

CHAPTER TO FILL:
Title: ${chapterTitle}
Description: ${chapterDescription}

AVAILABLE ESSAYS:
${JSON.stringify(essaysSummary, null, 2)}

TASK:
Analyze which essays would best fit this chapter. Consider:
1. Thematic alignment with chapter topic
2. Orb associations (does essay Orb match chapter Orb?)
3. Content depth and relevance
4. How well the essay supports the chapter's purpose

Return JSON array of suggested essays, sorted by relevance (most relevant first).
Include relevance_score (0-10) and reasoning for each suggestion.

RESPONSE FORMAT:
[
  {
    "file_id": "essay-id",
    "file_title": "Essay Title",
    "relevance_score": 9,
    "reasoning": "This essay directly addresses the chapter's core theme of..."
  }
]`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions":[]}');
    return result.suggestions || [];
  } catch (error) {
    console.error('Error suggesting essays:', error);
    return [];
  }
}

/**
 * Intelligently merge essays with transitions
 */
export async function mergeEssaysForChapter(
  chapterTitle: string,
  essays: Array<{ title: string; content: string }>,
  bookVoice: 'non-fiction' | 'fiction' = 'non-fiction'
): Promise<MergedChapter> {
  const essaysContent = essays.map((e, i) => `
=== ESSAY ${i + 1}: ${e.title} ===
${e.content}
`).join('\n\n');

  const voiceGuidance = bookVoice === 'fiction'
    ? 'Adapt to narrative fiction voice - immersive, present-tense, sensory-rich storytelling.'
    : 'Maintain non-fiction teaching voice - clear, direct, layered meaning. Affirmative definitions only.';

  const prompt = `You are compiling a chapter for "Stardust to Sovereignty" book.

CHAPTER: ${chapterTitle}

ESSAYS TO MERGE:
${essaysContent}

CRITICAL RULES:
1. **Preserve every word from essays** - no summarizing or cutting content
2. **${voiceGuidance}**
3. **Add smooth transitions** between essays - bridge concepts naturally
4. **Maintain S2S editorial standards**: affirmative definitions, layered meaning, transmission integrity
5. **Keep all technical terms** and specialized language
6. **Preserve inline tags** like @orb_7, @sovereignty, etc.

TASK:
Merge these essays into a cohesive chapter. Add transitional paragraphs between essays to create flow, but preserve ALL essay content.

Return JSON:
{
  "merged_content": "Full chapter text with transitions...",
  "word_count": 5000,
  "transitions_added": 3,
  "adaptation_notes": "Added 3 transitions... maintained voice... preserved all technical terms..."
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      merged_content: result.merged_content || essays.map(e => e.content).join('\n\n'),
      word_count: result.word_count || 0,
      transitions_added: result.transitions_added || 0,
      adaptation_notes: result.adaptation_notes || 'Basic concatenation performed',
    };
  } catch (error) {
    console.error('Error merging essays:', error);
    // Fallback: simple concatenation
    const merged = essays.map(e => e.content).join('\n\n---\n\n');
    return {
      merged_content: merged,
      word_count: merged.split(/\s+/).length,
      transitions_added: 0,
      adaptation_notes: 'AI merge failed - performed simple concatenation',
    };
  }
}

/**
 * Suggest chapter structure for entire book
 */
export async function suggestBookStructure(
  bookOutline: string,
  availableEssays: Array<{ id: string; title: string; content: string; orb_associations: number[] }>
): Promise<ChapterSuggestion[]> {
  const essaysSummary = availableEssays.map(e => ({
    id: e.id,
    title: e.title,
    orb_associations: e.orb_associations,
    excerpt: e.content.substring(0, 300),
  }));

  const prompt = `You are helping structure the book "Stardust to Sovereignty".

BOOK OUTLINE:
${bookOutline}

AVAILABLE ESSAYS:
${JSON.stringify(essaysSummary, null, 2)}

TASK:
For each chapter in the outline, suggest which essays would best fit.

Return JSON array of chapter suggestions:
[
  {
    "chapter_number": 1,
    "chapter_title": "Stardust and Origin Intelligence",
    "suggested_essays": [
      {
        "file_id": "essay-id",
        "file_title": "Essay Title",
        "relevance_score": 9,
        "reasoning": "Perfect fit because..."
      }
    ]
  }
]`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"chapters":[]}');
    return result.chapters || [];
  } catch (error) {
    console.error('Error suggesting book structure:', error);
    return [];
  }
}
