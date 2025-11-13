/**
 * Semantic Search API - Content discovery with vector similarity
 * Created: 2025-01-23
 * Purpose: Backend completion for S2S System Plan v4.0
 * Status: Core API Implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createEmbedding } from 'orbital-brain';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';

/**
 * GET /api/search/semantic - Semantic content discovery
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q');
    const orb = searchParams.get('orb');
    const content_type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');
    const threshold = parseFloat(searchParams.get('threshold') || '0.7');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Generate embedding for the search query (using shared Orbital-Brain service)
    const queryEmbedding = await createEmbedding(query.trim(), 'text-embedding-3-small');

    // Perform semantic search using pgvector
    const { data: results, error } = await supabase.rpc('match_content', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit
    });

    if (error) {
      console.error('Semantic search error:', error);
      return NextResponse.json(
        { error: 'Semantic search failed' },
        { status: 500 }
      );
    }

    // Get full content details for matching files
    const contentIds = results.map((r: any) => r.content_file_id);
    
    if (contentIds.length === 0) {
      return NextResponse.json({
        results: [],
        total_count: 0,
        query: query.trim(),
        filters: {
          orb: orb || null,
          content_type: content_type || null,
          threshold,
          limit
        },
        generated_at: new Date().toISOString()
      });
    }

    let contentQuery = supabase
      .from('content_files')
      .select('*')
      .in('id', contentIds);

    // Apply additional filters
    if (orb) {
      const orbNumber = parseInt(orb);
      if (orbNumber >= 1 && orbNumber <= 13) {
        // Search for strings like "Orb 1: Origin Intelligence" in array
        contentQuery = contentQuery.filter('orb_associations', 'cs', `{Orb ${orbNumber}:}`);
      }
    }

    if (content_type) {
      contentQuery = contentQuery.eq('type', content_type);
    }

    const { data: contentFiles, error: contentError } = await contentQuery;

    if (contentError) {
      console.error('Content fetch error:', contentError);
      return NextResponse.json(
        { error: 'Failed to fetch content details' },
        { status: 500 }
      );
    }

    // Filter by Orb pattern if specified (client-side filtering)
    let filteredContentFiles = contentFiles || [];
    if (orb) {
      const orbNumber = parseInt(orb);
      if (orbNumber >= 1 && orbNumber <= 13) {
        const orbPattern = new RegExp(`^Orb\\s+${orbNumber}:`, 'i');
        filteredContentFiles = filteredContentFiles.filter((file: any) => {
          if (!file.orb_associations || !Array.isArray(file.orb_associations)) return false;
          return file.orb_associations.some((orbStr: string) => orbPattern.test(orbStr));
        });
      }
    }

    // Combine results with similarity scores
    const searchResults = results.map((result: any) => {
      const contentFile = contentFiles?.find((cf: any) => cf.id === result.content_file_id);
      return {
        ...contentFile,
        similarity_score: result.similarity,
        content_chunk: result.content_chunk
      };
    }).filter(Boolean);

    // Sort by similarity score
    searchResults.sort((a: any, b: any) => b.similarity_score - a.similarity_score);

    return NextResponse.json({
      results: searchResults,
      total_count: searchResults.length,
      query: query.trim(),
      filters: {
        orb: orb || null,
        content_type: content_type || null,
        threshold,
        limit
      },
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Semantic search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/search/semantic - Advanced semantic search with filters
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();
    
    const {
      query,
      orb_associations = [],
      content_types = [],
      tags = [],
      date_range,
      resonance_threshold,
      limit = 10,
      threshold = 0.7
    } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Generate embedding for the search query (using shared Orbital-Brain service)
    const queryEmbedding = await createEmbedding(query.trim(), 'text-embedding-3-small');

    // Perform semantic search
    const { data: results, error } = await supabase.rpc('match_content', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit * 2 // Get more results for filtering
    });

    if (error) {
      console.error('Semantic search error:', error);
      return NextResponse.json(
        { error: 'Semantic search failed' },
        { status: 500 }
      );
    }

    if (results.length === 0) {
      return NextResponse.json({
        results: [],
        total_count: 0,
        query: query.trim(),
        filters: {
          orb_associations,
          content_types,
          tags,
          date_range,
          resonance_threshold,
          threshold,
          limit
        },
        generated_at: new Date().toISOString()
      });
    }

    // Get full content details with advanced filtering
    const contentIds = results.map((r: any) => r.content_file_id);
    
    let contentQuery = supabase
      .from('content_files')
      .select('*')
      .in('id', contentIds);

    // Apply Orb associations filter
    if (orb_associations.length > 0) {
      const validOrbs = orb_associations.filter((orb: number) => 
        typeof orb === 'number' && orb >= 1 && orb <= 13
      );
      if (validOrbs.length > 0) {
        contentQuery = contentQuery.overlaps('orb_associations', validOrbs);
      }
    }

    // Apply content types filter
    if (content_types.length > 0) {
      contentQuery = contentQuery.in('type', content_types);
    }

    // Apply tags filter
    if (tags.length > 0) {
      contentQuery = contentQuery.overlaps('tags', tags);
    }

    // Apply date range filter
    if (date_range?.start && date_range?.end) {
      contentQuery = contentQuery
        .gte('created_at', date_range.start)
        .lte('created_at', date_range.end);
    }

    const { data: contentFiles, error: contentError } = await contentQuery;

    if (contentError) {
      console.error('Content fetch error:', contentError);
      return NextResponse.json(
        { error: 'Failed to fetch content details' },
        { status: 500 }
      );
    }

    // Combine results with similarity scores and apply resonance threshold
    let searchResults = results.map((result: any) => {
      const contentFile = contentFiles?.find((cf: any) => cf.id === result.content_file_id);
      return {
        ...contentFile,
        similarity_score: result.similarity,
        content_chunk: result.content_chunk
      };
    }).filter(Boolean);

    // Apply resonance threshold if specified
    if (resonance_threshold !== undefined) {
      searchResults = searchResults.filter((result: any) => 
        result.resonance_score >= resonance_threshold
      );
    }

    // Sort by similarity score and limit results
    searchResults.sort((a: any, b: any) => b.similarity_score - a.similarity_score);
    searchResults = searchResults.slice(0, limit);

    return NextResponse.json({
      results: searchResults,
      total_count: searchResults.length,
      query: query.trim(),
      filters: {
        orb_associations,
        content_types,
        tags,
        date_range,
        resonance_threshold,
        threshold,
        limit
      },
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Advanced semantic search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
