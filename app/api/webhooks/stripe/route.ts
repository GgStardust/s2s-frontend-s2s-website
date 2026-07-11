import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe-server'
import { sendOrderPaidEmailsFromStripeSession } from '@/lib/order-emails'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[stripe webhook] Missing STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    console.error('[stripe webhook] signature', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    try {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.payment_status !== 'paid') {
        return NextResponse.json({ received: true })
      }

      const stripe = getStripe()
      const full = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['customer_details'],
      })

      await sendOrderPaidEmailsFromStripeSession(full)
    } catch (err) {
      // Keep webhook deliveries successful even if optional post-payment handling fails.
      console.error('[stripe webhook] checkout.session.completed handler failed', err)
    }
  }

  return NextResponse.json({ received: true })
}
