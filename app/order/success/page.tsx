import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getStripe } from '@/lib/stripe-server'
import { ORDER_SUCCESS_PAID } from '@/lib/orderCopy'
import { BOOK_CATALOG } from '@/lib/publishingMetadata'

export const metadata: Metadata = {
  title: `Thank you · ${BOOK_CATALOG.title}`,
  robots: { index: false, follow: false },
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string | string[] }
}) {
  const raw = searchParams.session_id
  const sessionId = typeof raw === 'string' ? raw : null
  if (!sessionId) {
    redirect('/order')
  }

  let paid = false
  let emailHint: string | null = null
  let ref: string | null = null

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer_details', 'shipping_details'],
    })
    paid = session.payment_status === 'paid'
    emailHint = session.customer_details?.email ?? session.customer_email ?? null
    ref = session.id.replace(/^cs_/, '').slice(0, 12).toUpperCase()
  } catch {
    redirect('/order')
  }

  return (
    <main id="main" className="page-order">
      <section className="register register--light order-success" aria-labelledby="success-title">
        <div className="order-success__inner">
          <p className="label">{BOOK_CATALOG.volumeLabel}</p>
          <h1 id="success-title" className="display display--section">
            {BOOK_CATALOG.title}
          </h1>
          <p className="order-success__thanks">Thank you.</p>

          {paid ? (
            <>
              <p className="lede">{ORDER_SUCCESS_PAID}</p>
              {ref && (
                <p className="order-success__meta">
                  Reference <span className="order-success__ref">{ref}</span>
                </p>
              )}
              {emailHint && (
                <p className="order-success__meta">
                  Confirmation sent to <span>{emailHint}</span>
                </p>
              )}
            </>
          ) : (
            <p className="lede">
              Payment is still processing. If you completed checkout, check your email for confirmation.
            </p>
          )}

          <div className="order-success__links">
            <Link className="text-link" href="/book-one">
              Return to Book One <span aria-hidden="true">→</span>
            </Link>
            <Link className="text-link" href="/">
              Home <span aria-hidden="true">→</span>
            </Link>
          </div>

          <img
            className="order-success__glyph"
            src="/assets/glyphs/glyph_10.png"
            alt=""
            width={28}
            height={28}
          />
        </div>
      </section>
    </main>
  )
}
