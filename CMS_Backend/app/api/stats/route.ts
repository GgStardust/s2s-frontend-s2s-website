import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get content files count
    const { count: contentFilesCount, error: contentError } = await supabase
      .from('content_files')
      .select('*', { count: 'exact', head: true });

    if (contentError) {
      console.error('Error fetching content files count:', contentError);
    }

    // Get scrollstreams count
    const { count: scrollstreamsCount, error: scrollError } = await supabase
      .from('scrollstreams')
      .select('*', { count: 'exact', head: true });

    if (scrollError) {
      console.error('Error fetching scrollstreams count:', scrollError);
    }

    // Core Orbs is always 13 (fixed system constant)
    const coreOrbs = 13;

    return NextResponse.json({
      contentFiles: contentFilesCount || 0,
      scrollstreams: scrollstreamsCount || 0,
      coreOrbs,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

