import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/console/v3/access/check
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
 * GET /api/console/v3/access/check
 * Check if user has console access
 * Query params: user_id or email
 */
export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get('user_id') || undefined;
    const email = searchParams.get('email') || undefined;

    if (!user_id && !email) {
      return NextResponse.json(
        { error: 'Either user_id or email is required' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for active user_products with console access
    let query = supabase
      .from('user_products')
      .select('*, products(*)')
      .eq('status', 'active')
      .or('product_code.eq.CONSOLE_BETA,product_code.eq.CONSOLE_ONE_TIME,product_code.eq.CONSOLE_SUBSCRIPTION');

    if (user_id) {
      query = query.eq('user_id', user_id);
    } else {
      query = query.eq('email', email);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error checking access:', error);
      return NextResponse.json(
        { error: 'Failed to check access', details: error.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    const hasAccess = products && products.length > 0;
    const activeProducts = products || [];

    // Check if access is expired
    const now = new Date();
    const validProducts = activeProducts.filter((product: any) => {
      if (!product.expires_at) return true; // No expiration
      return new Date(product.expires_at) > now;
    });

    const hasValidAccess = validProducts.length > 0;

    return NextResponse.json({
      has_access: hasValidAccess,
      user_id: user_id || null,
      email: email || null,
      products: validProducts.map((p: any) => ({
        product_code: p.product_code,
        product_name: p.products?.name,
        activated_at: p.activated_at,
        expires_at: p.expires_at,
      })),
    }, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in GET /api/console/v3/access/check:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

