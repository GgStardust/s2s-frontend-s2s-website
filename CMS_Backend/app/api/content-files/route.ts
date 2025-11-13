import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { withCache, cacheConfigs } from '@/lib/middleware/cache-middleware';
import { cache } from '@/lib/cache/redis';
import { addContentProcessingJob } from '@/lib/queue/bull';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/content-files - Get all content files (with caching)
export const GET = withCache(cacheConfigs.contentFiles)(async function getContentFiles(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: contentFiles, error } = await supabase
      .from('content_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Normalize orb_associations and tags to always be arrays (never null)
    const normalizedFiles = (contentFiles || []).map((file: any) => ({
      ...file,
      orb_associations: Array.isArray(file.orb_associations) 
        ? file.orb_associations 
        : (file.orb_associations && typeof file.orb_associations === 'object' && file.orb_associations !== null)
          ? (() => {
              const result: any[] = [];
              if (file.orb_associations.primary_orb) result.push(file.orb_associations.primary_orb);
              if (Array.isArray(file.orb_associations.secondary_orbs)) {
                result.push(...file.orb_associations.secondary_orbs);
              }
              return result;
            })()
          : [],
      tags: Array.isArray(file.tags) ? file.tags : []
    }));

    return NextResponse.json({ contentFiles: normalizedFiles });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});

// POST /api/content-files - Create new content file
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    const {
      title,
      file_path,
      content_type,
      markdown_body,
      orb_associations,
      tags
    } = body;

    if (!title || !content_type || !markdown_body) {
      return NextResponse.json(
        { error: 'Title, content_type, and markdown_body are required' },
        { status: 400 }
      );
    }

    const { data: contentFile, error } = await supabase
      .from('content_files')
      .insert({
        title,
        file_path,
        content_type,
        markdown_body,
        orb_associations: orb_associations || [],
        tags: tags || []
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating content file:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Invalidate cache after creating new content
    try {
    await cache.invalidatePattern('content_files:*');
    } catch (cacheError) {
      console.warn('Cache invalidation failed (non-critical):', cacheError);
    }
    
    // Queue content processing job (with fallback to synchronous if queue unavailable)
    try {
    await addContentProcessingJob({
      type: 'process_file',
      fileId: contentFile.id,
      filePath: file_path,
      metadata: { content_type, orb_associations, tags },
      priority: 1,
    });
    } catch (queueError) {
      console.warn('Queue job failed (non-critical, continuing):', queueError);
      // Continue even if queue fails - job may have run synchronously
    }

    return NextResponse.json({ contentFile }, { status: 201 });
  } catch (err: any) {
    console.error('Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/content-files - Clear all content files
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // First get count of existing records
    const { count } = await supabase
      .from('content_files')
      .select('*', { count: 'exact', head: true });

    // Delete all records
    const { error } = await supabase
      .from('content_files')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (error) {
      console.error('Error clearing content files:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'All content files cleared successfully',
      deletedCount: count || 0
    });
  } catch (err: any) {
    console.error('Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
