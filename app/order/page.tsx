import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AUTHORS_EDITION_FULFILLMENT,
  AUTHORS_EDITION_LABEL,
  AUTHORS_EDITION_WHAT,
  ORDER_BOOK_LEAD,
} from '@/lib/orderCopy'
import { BOOK_CATALOG, PRICING } from '@/lib/publishingMetadata'

export const metadata: Metadata = {
  title: `Purchase · ${BOOK_CATALOG.title}`,
  description: `Purchase the current first edition of ${BOOK_CATALOG.title} directly from Gigi Stardust.`,
  robots: { index: false, follow: true },
}

export default function OrderPage() {
  return (
    <main id="main" className="page-order">
      <section className="register register--light order-hero" aria-labelledby="order-title">
        <div className="order-hero__inner">
          <p className="label">Book One · Stardust to Sovereignty</p>
          <h1 id="order-title" className="display display--section">
            {BOOK_CATALOG.title}
          </h1>
          <p className="order-hero__edition">{AUTHORS_EDITION_LABEL}</p>
          <p className="lede">{ORDER_BOOK_LEAD}</p>
          <p className="order-hero__price">
            ${PRICING.directPaperbackUsd.toFixed(2)} USD · standard shipping included
          </p>
          <p className="order-row">
            <Link className="text-link" href="/order/direct">
              Continue to checkout <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      <section className="register register--light order-detail" aria-label="Edition details">
        <div className="order-detail__inner">
          <p>{AUTHORS_EDITION_WHAT}</p>
          <p className="order-detail__note">{AUTHORS_EDITION_FULFILLMENT}</p>
          <p className="order-back">
            <Link className="text-link" href="/book-one">
              Return to Book One <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
