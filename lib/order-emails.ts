import type Stripe from 'stripe'
import { Resend } from 'resend'
import { BOOK_CATALOG } from '@/lib/publishingMetadata'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

function formatStripeShipping(session: Stripe.Checkout.Session): string {
  const addr = session.shipping_details?.address
  const name = session.shipping_details?.name
  if (!addr) return '(address collected in Stripe Dashboard if missing here)'
  const lines = [
    name,
    addr.line1,
    addr.line2 || undefined,
    [addr.city, addr.state, addr.postal_code].filter(Boolean).join(', '),
    addr.country,
  ].filter(Boolean) as string[]
  return lines.join('\n')
}

/** Optional transactional mail; orders of record remain in Stripe + your Gmail filters. */
export async function sendOrderPaidEmailsFromStripeSession(session: Stripe.Checkout.Session): Promise<void> {
  const resend = getResend()
  const from = process.env.FROM_EMAIL
  const notify = process.env.ORDER_NOTIFICATION_EMAIL
  const amount = session.amount_total != null ? (session.amount_total / 100).toFixed(2) : 'n/a'
  const email = session.customer_details?.email ?? session.customer_email ?? ''
  const customerName = session.shipping_details?.name ?? session.customer_details?.name ?? ''

  const text = [
    `Paid direct order: ${BOOK_CATALOG.title}`,
    '',
    `Stripe Checkout session: ${session.id}`,
    `Payment status: ${session.payment_status}`,
    `Amount: $${amount} USD (shipping included in price)`,
    '',
    `Customer email: ${email || 'n/a'}`,
    '',
    'Ship to:',
    formatStripeShipping(session),
    '',
    `Open this session in Stripe Dashboard to copy full shipping and receipt details.`,
  ].join('\n')

  if (resend && from && notify) {
    await resend.emails.send({
      from,
      to: notify,
      subject: `[Book order] ${BOOK_CATALOG.title}: ${customerName || email || session.id.slice(0, 8)}`,
      text,
    })
  } else {
    console.warn('[order-emails] Skipping admin email (set RESEND_API_KEY, FROM_EMAIL, ORDER_NOTIFICATION_EMAIL)')
  }

  if (resend && from && email) {
    const ref = session.id.replace('cs_', '').slice(0, 12).toUpperCase()
    const readerText = [
      `Thank you for ordering ${BOOK_CATALOG.title}.`,
      '',
      `Stripe reference: ${ref}`,
      `Amount paid: $${amount} USD (shipping included).`,
      '',
      'Your paperback will be prepared and shipped as soon as possible.',
      '',
      'Gigi Stardust · Stardust to Sovereignty',
    ].join('\n')

    await resend.emails.send({
      from,
      to: email,
      subject: `Order received: ${BOOK_CATALOG.title}`,
      text: readerText,
    })
  } else {
    console.warn('[order-emails] Skipping reader confirmation (Resend or customer email missing)')
  }
}
