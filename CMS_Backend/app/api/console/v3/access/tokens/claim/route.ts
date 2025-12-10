import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/console/v3/access/tokens/claim
 * Handle CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

/**
 * POST /api/console/v3/access/tokens/claim
 * Claim an access token and activate console access
 * Body: { token, user_id?, email? }
 */
export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const body = await request.json();
    const { token, user_id, email } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'token is required' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find access token
    const { data: accessToken, error: tokenError } = await supabase
      .from('access_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !accessToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    if (accessToken.status !== 'unclaimed') {
      return NextResponse.json(
        { error: `Token has already been ${accessToken.status}` },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    // Check expiration
    if (accessToken.expires_at && new Date(accessToken.expires_at) < new Date()) {
      // Update token status to expired
      await supabase
        .from('access_tokens')
        .update({ status: 'expired' })
        .eq('id', accessToken.id);

      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    // Verify email matches if provided
    if (email && accessToken.email !== email) {
      return NextResponse.json(
        { error: 'Email does not match token' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const claimEmail = email || accessToken.email;

    // Update token status
    const { error: updateError } = await supabase
      .from('access_tokens')
      .update({
        status: 'active',
        claimed_at: new Date().toISOString(),
        user_id: user_id || null,
      })
      .eq('id', accessToken.id);

    if (updateError) {
      console.error('Error updating token:', updateError);
      return NextResponse.json(
        { error: 'Failed to claim token', details: updateError.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    // Create or update user_product
    const { data: product, error: productError } = await supabase
      .from('user_products')
      .upsert({
        user_id: user_id || null,
        email: claimEmail,
        product_code: accessToken.product_code,
        access_token_id: accessToken.id,
        status: 'active',
        activated_at: new Date().toISOString(),
        expires_at: accessToken.expires_at,
      })
      .select()
      .single();

    if (productError) {
      console.error('Error creating user product:', productError);
      // Token was claimed, but product creation failed - this is a warning
      console.warn('Token claimed but user_product creation failed');
    }

    return NextResponse.json({
      success: true,
      message: 'Access token claimed successfully',
      product_code: accessToken.product_code,
      user_id: user_id || null,
      email: claimEmail,
    }, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in POST /api/console/v3/access/tokens/claim:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

