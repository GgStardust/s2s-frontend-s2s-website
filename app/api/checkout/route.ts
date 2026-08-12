import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe-server';
import { directSalePriceCents } from '@/lib/directPricing';
import { BOOK_CATALOG } from '@/lib/publishingMetadata';
import { STRIPE_CHECKOUT_SHIPPING_COUNTRIES } from '@/lib/stripe-shipping';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function baseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (!value) return 'http://localhost:3000';
  if (value.startsWith('http')) return value;
  return `https://${value}`;
}

export async function POST(request: Request) {
  try {
    let prefilledEmail: string | undefined;
    try {
      const text = await request.text();
      if (text) {
        const body = JSON.parse(text) as { email?: string };
        if (typeof body.email === 'string' && body.email.trim()) {
          prefilledEmail = body.email.trim();
        }
      }
    } catch {
      // An empty request body is valid.
    }

    const stripe = getStripe();
    const origin = baseUrl();
    const amountCents = directSalePriceCents();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ...(prefilledEmail ? { customer_email: prefilledEmail } : {}),
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: [...STRIPE_CHECKOUT_SHIPPING_COUNTRIES],
      },
      metadata: {
        product: 'cosmic_tapestry_paperback_direct',
        edition: 'current_first_edition',
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amountCents,
            product_data: {
              name: `${BOOK_CATALOG.title}: Current First Edition (paperback)`,
              description: 'Purchased directly from Gigi Stardust; standard shipping included.',
            },
          },
        },
      ],
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order?canceled=1`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Could not start checkout.' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[checkout]', error);
    return NextResponse.json({ error: 'Checkout is temporarily unavailable.' }, { status: 500 });
  }
}
