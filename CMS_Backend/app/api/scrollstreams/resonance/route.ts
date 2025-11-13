import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

function extractScrollstreamLines(markdown: string): string[] {
  if (!markdown) return [];
  const lines = markdown.split(/\r?\n/);
  const pulses: string[] = [];
  for (const line of lines) {
    // Basic rule: line contains @scrollstream and has meaningful text
    if (/@scrollstream/i.test(line)) {
      // Strip the tag and surrounding punctuation
      const cleaned = line
        .replace(/@scrollstream/gi, '')
        .replace(/^[\s\-*>#]+/, '')
        .trim();
      if (cleaned.length > 0 && cleaned.length <= 320) {
        pulses.push(cleaned);
      }
    }
  }
  return pulses;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '1000');
    const orb = searchParams.get('orb');

    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);

    // Prefer files tagged with scrollstream; fall back to searching content
    let query = supabase
      .from('content_files')
      .select('*')
      .order('created_at', { ascending: false });

    // Narrow by orb if provided - will filter after fetching
    let orbNum: number | null = null;
    if (orb) {
      orbNum = parseInt(orb);
      if (Number.isNaN(orbNum) || orbNum < 1 || orbNum > 13) {
        orbNum = null;
      }
    }

    // Try tag filter first
    const { data: tagged, error: tagErr } = await query.contains('tags', ['scrollstream']).limit(2000);

    // If tag-based fails or returns empty, fetch a broader set for content scan
    let files = tagged || [];
    if (tagErr || files.length === 0) {
      const { data: recent, error: recentErr } = await supabase
        .from('content_files')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2000);
      if (!recentErr && recent) files = recent;
    }

    // Filter by Orb pattern if specified
    if (orbNum !== null) {
      const orbPattern = new RegExp(`^Orb\\s+${orbNum}:`, 'i');
      files = files.filter((f: any) => {
        if (!f.orb_associations || !Array.isArray(f.orb_associations)) return false;
        return f.orb_associations.some((orbStr: string) => orbPattern.test(orbStr));
      });
    }

    // Extract pulses from markdown_body or content
    const items: any[] = [];
    for (const f of files) {
      const body: string = (f.markdown_body || f.content || '').toString();
      const pulses = extractScrollstreamLines(body);
      if (pulses.length === 0) continue;
      pulses.forEach((text: string, idx: number) => {
        items.push({
          id: `${f.id}::${idx}`,
          file_id: f.id,
          content: text,
          orb_associations: f.orb_associations || [],
          tags: f.tags || [],
          status: f.status || 'unknown',
          created_at: f.created_at || null,
          source_title: f.title || null,
          source_path: f.file_path || null,
        });
      });
      if (items.length >= limit) break;
    }

    // Truncate to limit
    const result = items.slice(0, limit);

    return NextResponse.json({
      total: result.length,
      items: result,
      source_files_scanned: files.length,
      generated_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Scrollstreams resonance API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


