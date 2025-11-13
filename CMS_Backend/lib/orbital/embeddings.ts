/**
 * Vector Embedding Utilities
 * Generate and store embeddings for semantic search
 * 
 * Uses shared Orbital-Brain OpenAI service
 */

import { createEmbedding } from 'orbital-brain';

/**
 * Generate embedding for text using OpenAI text-embedding-3-small
 * Uses shared Orbital-Brain OpenAI service
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  return createEmbedding(text, 'text-embedding-3-small');
}

/**
 * Split text into chunks for embedding
 * Max ~8000 tokens per chunk (roughly 6000 words)
 */
export function chunkText(text: string, maxChunkSize: number = 6000): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += maxChunkSize) {
    const chunk = words.slice(i, i + maxChunkSize).join(' ');
    chunks.push(chunk);
  }

  return chunks;
}

/**
 * Generate embeddings for a content file
 */
export async function embedContentFile(
  contentFileId: string,
  content: string,
  supabase: any
): Promise<void> {
  // Split content into chunks
  const chunks = chunkText(content);

  // Delete existing embeddings for this file
  await supabase
    .from('content_embeddings')
    .delete()
    .eq('content_file_id', contentFileId);

  // Generate and store embeddings for each chunk
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await generateEmbedding(chunk);

    await supabase.from('content_embeddings').insert({
      content_file_id: contentFileId,
      embedding,
      content_chunk: chunk,
      chunk_index: i,
    });

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * Search for similar content using vector similarity
 */
export async function searchSimilarContent(
  queryText: string,
  supabase: any,
  options: {
    matchThreshold?: number;
    matchCount?: number;
  } = {}
): Promise<Array<{
  content_file_id: string;
  content_chunk: string;
  similarity: number;
  file_title?: string;
  file_type?: string;
}>> {
  const { matchThreshold = 0.7, matchCount = 10 } = options;

  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(queryText);

  // Use Supabase RPC to search
  const { data, error } = await supabase.rpc('match_content', {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) {
    console.error('Error searching similar content:', error);
    return [];
  }

  // Enrich with file metadata
  const fileIds = [...new Set(data.map((d: any) => d.content_file_id))];

  const { data: files } = await supabase
    .from('content_files')
    .select('id, title, content_type')
    .in('id', fileIds);

  const fileMap = new Map(files?.map((f: any) => [f.id, f]) || []);

  return data.map((result: any) => {
    const file: any = fileMap.get(result.content_file_id);
    return {
      ...result,
      file_title: (file as any)?.title,
      file_type: (file as any)?.content_type,
    };
  });
}

/**
 * Batch embed all content files
 */
export async function batchEmbedAllFiles(supabase: any): Promise<{
  success: number;
  failed: number;
  total: number;
}> {
  const { data: files, error } = await supabase
    .from('content_files')
    .select('id, content');

  if (error || !files) {
    console.error('Error fetching files:', error);
    return { success: 0, failed: 0, total: 0 };
  }

  let success = 0;
  let failed = 0;

  for (const file of files) {
    try {
      console.log(`Embedding file ${file.id}...`);
      await embedContentFile(file.id, file.markdown_body || '', supabase);
      success++;
    } catch (err) {
      console.error(`Failed to embed file ${file.id}:`, err);
      failed++;
    }
  }

  return { success, failed, total: files.length };
}
