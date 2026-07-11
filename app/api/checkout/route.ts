import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe-server'
import { directSalePriceCents } from '@/lib/directPricing'
import { BOOK_CATALOG } from '@/lib/publishingMetadata'
import { STRIPE_CHECKOUT_SHIPPING_COUNTRIES } from '@/lib/stripe-shipping'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function baseUrl(): string {
  const u = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  if (!u) return 'http://localhost:3000'
  if (u.startsWith('http')) return u
  return `https://${u}`
}

/** Stripe collects email, phone (optional), and shipping on its hosted page (no Supabase). */
export async function POST(request: Request) {
  try {
    let prefilledEmail: string | undefined
    try {
      const text = await request.text()
      if (text) {
        const body = JSON.parse(text) as { email?: string }
        if (typeof body?.email === 'string' && body.email.trim()) {
          prefilledEmail = body.email.trim()
        }
      }
    } catch {
      // empty body is fine
    }

    const stripe = getStripe()
    const origin = baseUrl()
    const amount_cents = directSalePriceCents()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ...(prefilledEmail ? { customer_email: prefilledEmail } : {}),
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: [...STRIPE_CHECKOUT_SHIPPING_COUNTRIES],
      },
      metadata: {
        product: 'cosmic_tapestry_paperback_direct',
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amount_cents,
            product_data: {
              name: `${BOOK_CATALOG.title}: Author's Edition (paperback)`,
              description: "Direct from the author; standard shipping included in this price.",
            },
          },
        },
      ],
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order/direct?canceled=1`,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Could not start checkout.' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('[checkout]', e)
    return NextResponse.json({ error: 'Checkout is temporarily unavailable.' }, { status: 500 })
  }
}
