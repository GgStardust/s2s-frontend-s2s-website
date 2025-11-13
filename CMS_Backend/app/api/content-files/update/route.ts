import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, orb_associations } = body || {};

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);

    const updates: Record<string, any> = {};
    if (Array.isArray(orb_associations)) {
      // Normalize to numbers and store
      const nums = orb_associations
        .map((n: any) => Number(n))
        .filter((n: number) => !Number.isNaN(n));
      updates.orb_associations = nums;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ ok: true, message: 'Nothing to update' });
    }

    const { data, error } = await supabase
      .from('content_files')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update content file' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, file: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}











