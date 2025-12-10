import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';
import { getCorsHeaders } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/console/v3/access/tokens
 * Create an access token (for preorder/console-only access)
 * Body: { email, product_code, metadata? }
 */
export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const body = await request.json();
    const { email, product_code, metadata } = body;

    if (!email || !product_code) {
      return NextResponse.json(
        { error: 'email and product_code are required' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('code', product_code)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Invalid product_code' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    // Generate token
    const token = randomBytes(32).toString('hex');

    // Set expiration (default 90 days for one-time, null for subscription)
    const expiresAt = product.billing_type === 'one_time' && product.access_duration_days
      ? new Date(Date.now() + product.access_duration_days * 24 * 60 * 60 * 1000).toISOString()
      : null;

    // Create access token
    const { data: accessToken, error: tokenError } = await supabase
      .from('access_tokens')
      .insert({
        email,
        product_code,
        token,
        status: 'unclaimed',
        metadata: metadata || {},
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (tokenError) {
      console.error('Error creating access token:', tokenError);
      return NextResponse.json(
        { error: 'Failed to create access token', details: tokenError.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    return NextResponse.json({
      token: accessToken.token,
      email: accessToken.email,
      product_code: accessToken.product_code,
      expires_at: accessToken.expires_at,
      status: accessToken.status,
    }, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in POST /api/console/v3/access/tokens:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

