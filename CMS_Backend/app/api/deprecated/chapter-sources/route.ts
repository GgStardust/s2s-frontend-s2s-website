import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// POST /api/chapter-sources - Add sources to chapter
export async function POST(request: NextRequest) {
  try {
    const { chapter_id, file_ids } = await request.json();
    
    if (!chapter_id || !file_ids || !Array.isArray(file_ids)) {
      return NextResponse.json({ error: 'Chapter ID and file IDs are required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current sources
    const { data: currentSources } = await supabase
      .from('chapter_sources')
      .select('file_id')
      .eq('chapter_id', chapter_id);

    const existingFileIds = currentSources?.map(s => s.file_id) || [];

    // Add new sources (avoid duplicates)
    const newFileIds = file_ids.filter((id: string) => !existingFileIds.includes(id));
    
    if (newFileIds.length > 0) {
      const sourcesToAdd = newFileIds.map((file_id: string) => ({
        chapter_id,
        file_id,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('chapter_sources')
        .insert(sourcesToAdd);

      if (error) {
        console.error('Error adding chapter sources:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      message: 'Sources added successfully',
      addedCount: newFileIds.length,
      totalSources: existingFileIds.length + newFileIds.length
    });

  } catch (err: any) {
    console.error('Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/chapter-sources - Remove sources from chapter
export async function DELETE(request: NextRequest) {
  try {
    const { chapter_id, file_ids } = await request.json();
    
    if (!chapter_id || !file_ids || !Array.isArray(file_ids)) {
      return NextResponse.json({ error: 'Chapter ID and file IDs are required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Remove specified sources
    const { error } = await supabase
      .from('chapter_sources')
      .delete()
      .eq('chapter_id', chapter_id)
      .in('file_id', file_ids);

    if (error) {
      console.error('Error removing chapter sources:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Sources removed successfully',
      removedCount: file_ids.length
    });

  } catch (err: any) {
    console.error('Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}