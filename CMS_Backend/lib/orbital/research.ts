/**
 * Orbital Research Functions
 * Internal Codex mining and External web research
 */

import OpenAI from 'openai';
import { searchSimilarContent } from './embeddings';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface InternalResearchResult {
  file_id: string;
  file_title: string;
  file_type: string;
  excerpt: string;
  similarity: number;
  orb_associations: number[];
  tags: string[];
}

export interface ExternalResearchResult {
  title: string;
  url: string;
  summary: string;
  relevance: string;
}

export interface ResearchResults {
  internal: InternalResearchResult[];
  external: ExternalResearchResult[];
  synthesis: string;
}

/**
 * Perform internal codex research using vector search
 */
export async function performInternalResearch(
  query: string,
  supabase: any,
  options: { maxResults?: number } = {}
): Promise<InternalResearchResult[]> {
  const { maxResults = 5 } = options;

  // Use vector search to find similar content
  const similarContent = await searchSimilarContent(query, supabase, {
    matchThreshold: 0.6,
    matchCount: maxResults * 2, // Get more, then dedupe by file
  });

  // Group by file and take best match per file
  const fileMap = new Map<string, any>();

  for (const result of similarContent) {
    if (!fileMap.has(result.content_file_id)) {
      fileMap.set(result.content_file_id, result);
    }
  }

  // Get full file metadata
  const fileIds = Array.from(fileMap.keys());

  const { data: files } = await supabase
    .from('content_files')
    .select('id, title, content_type, orb_associations, tags')
    .in('id', fileIds)
    .limit(maxResults);

  if (!files) return [];

  return files.map((file: any) => {
    const match = fileMap.get(file.id);
    return {
      file_id: file.id,
      file_title: file.title,
      file_type: file.content_type,
      excerpt: match.content_chunk.substring(0, 500) + '...',
      similarity: match.similarity,
      orb_associations: file.orb_associations || [],
      tags: file.tags || [],
    };
  });
}

/**
 * Perform external web research (mock for now, can add Tavily/Perplexity later)
 */
export async function performExternalResearch(
  query: string
): Promise<ExternalResearchResult[]> {
  // MOCK: In production, use Tavily API, Perplexity API, or web scraping
  // For now, return empty array
  // TODO: Integrate real web research API when ready

  return [];

  /* Example of what real implementation would look like with Tavily:

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.TAVILY_API_KEY}`
    },
    body: JSON.stringify({
      query,
      search_depth: 'advanced',
      max_results: 5
    })
  });

  const data = await response.json();

  return data.results.map((r: any) => ({
    title: r.title,
    url: r.url,
    summary: r.content,
    relevance: r.score
  }));
  */
}

/**
 * Synthesize research findings into coherent content
 */
export async function synthesizeResearch(
  query: string,
  internalResults: InternalResearchResult[],
  externalResults: ExternalResearchResult[],
  contentType: string
): Promise<string> {
  const systemPrompt = `You are Orbital, the Codex-integrated intelligence for Stardust to Sovereignty.

Your role is to synthesize research findings into coherent content that:
1. Preserves S2S voice and sovereignty logic
2. Uses affirmative definitions only
3. Integrates internal codex findings with external sources
4. Maintains transmission integrity (no summarization)
5. Maps to relevant Orbs and applies canonical tags

Content type: ${contentType}`;

  const internalSummary = internalResults
    .map(
      (r, i) =>
        `${i + 1}. ${r.file_title} (${r.file_type})
   Orbs: ${r.orb_associations.join(', ')}
   Tags: ${r.tags.join(', ')}
   Excerpt: ${r.excerpt}`
    )
    .join('\n\n');

  const externalSummary =
    externalResults.length > 0
      ? externalResults
          .map(
            (r, i) =>
              `${i + 1}. ${r.title}
   URL: ${r.url}
   Summary: ${r.summary}`
          )
          .join('\n\n')
      : 'No external research available.';

  const userPrompt = `Research Query: ${query}

INTERNAL CODEX FINDINGS:
${internalSummary}

EXTERNAL RESEARCH FINDINGS:
${externalSummary}

Based on these findings, provide a synthesis that:
- Highlights key connections between internal codex content
- Integrates external sources as mirrors to S2S logic (if available)
- Identifies relevant Orbs and themes
- Suggests specific tags from TAG_REGISTRY
- Notes any patterns or gaps in current codex coverage

Format as markdown with clear sections.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  return response.choices[0]?.message?.content || '';
}

/**
 * Full research pipeline: Internal + External + Synthesis
 */
export async function performFullResearch(
  query: string,
  supabase: any,
  contentType: string
): Promise<ResearchResults> {
  // Perform internal and external research in parallel
  const [internal, external] = await Promise.all([
    performInternalResearch(query, supabase),
    performExternalResearch(query),
  ]);

  // Synthesize findings
  const synthesis = await synthesizeResearch(
    query,
    internal,
    external,
    contentType
  );

  return {
    internal,
    external,
    synthesis,
  };
}
