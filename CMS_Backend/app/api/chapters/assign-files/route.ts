import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Prevent build-time execution
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await request.json();
    const { assignments } = body;

    if (!assignments || !Array.isArray(assignments)) {
      return NextResponse.json({ error: 'Invalid assignments data' }, { status: 400 });
    }

    // For each chapter, update the assigned_files array
    for (const assignment of assignments) {
      const { chapter_id, file_ids } = assignment;

      if (!chapter_id || !file_ids) continue;

      const { error } = await supabase
        .from('chapters')
        .update({ assigned_files: file_ids })
        .eq('id', chapter_id);

      if (error) {
        console.error(`Error assigning files to chapter ${chapter_id}:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
