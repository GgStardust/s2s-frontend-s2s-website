import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import StripeCheckoutButton from '@/components/direct-checkout/StripeCheckoutButton'
import { getDirectSalePriceUsd } from '@/lib/directPricing'
import { AUTHORS_EDITION_LABEL, AUTHORS_EDITION_WHAT } from '@/lib/orderCopy'
import { BOOK_CATALOG, PRICING } from '@/lib/publishingMetadata'

export const metadata: Metadata = {
  title: `Checkout · ${BOOK_CATALOG.title}`,
  description: `Purchase the current first edition of ${BOOK_CATALOG.title} directly from Gigi Stardust.`,
  robots: { index: false, follow: false },
}

export default function DirectOrderPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const priceUsd = getDirectSalePriceUsd()
  const canceled = searchParams.canceled === '1'

  return (
    <main id="main" className="page-order">
      <section className="register register--light order-checkout" aria-labelledby="checkout-title">
        <div className="order-checkout__grid">
          <div className="order-checkout__copy">
            <p className="label">Book One · Direct purchase</p>
            <h1 id="checkout-title" className="display display--section">
              {BOOK_CATALOG.title}
            </h1>
            <p className="order-hero__edition">{AUTHORS_EDITION_LABEL}</p>
            <p className="lede">{AUTHORS_EDITION_WHAT}</p>

            <dl className="edition-facts">
              <div>
                <dt>Format</dt>
                <dd>Paperback</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>${priceUsd.toFixed(2)} USD</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>Standard included</dd>
              </div>
              <div>
                <dt>Also available</dt>
                <dd>
                  Amazon paperback ${PRICING.paperbackUsd} · Ebook ${PRICING.digitalUsd}
                </dd>
              </div>
            </dl>

            {canceled && (
              <p className="order-status" role="status">
                Checkout was canceled. You can start again when ready.
              </p>
            )}

            <div className="order-checkout__actions">
              <StripeCheckoutButton priceUsd={priceUsd} />
              <p className="order-back">
                <Link className="text-link" href="/book-one">
                  Return to Book One <span aria-hidden="true">→</span>
                </Link>
              </p>
            </div>
          </div>

          <aside className="order-checkout__object" aria-label="Book cover">
            <figure className="book-photo order-checkout__photo">
              <Image
                src="/assets/book/book-one-mockup.png"
                alt={`${BOOK_CATALOG.title}, Book One by Gigi Stardust`}
                width={819}
                height={1024}
                priority
              />
            </figure>
          </aside>
        </div>
      </section>
    </main>
  )
}
