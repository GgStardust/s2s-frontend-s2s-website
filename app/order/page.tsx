import type { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import {
  AUTHORS_EDITION_FULFILLMENT,
  AUTHORS_EDITION_LABEL,
  AUTHORS_EDITION_WHAT,
  ORDER_BOOK_LEAD,
} from '@/lib/orderCopy';
import { BOOK_CATALOG, PRICING } from '@/lib/publishingMetadata';

export const metadata: Metadata = {
  title: `Purchase · ${BOOK_CATALOG.title}`,
  description: `Purchase the current first edition of ${BOOK_CATALOG.title} directly from Gigi Stardust.`,
  robots: { index: false, follow: true },
};

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-book-vessel pb-20">
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-12 md:pt-24 text-center border-b border-stone-300/15">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/75 font-sans">
          Book One · Stardust to Sovereignty
        </p>
        <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-stone-100 font-serif">
          {BOOK_CATALOG.title}
        </h1>
        <p className="mt-4 text-sm uppercase tracking-[0.16em] text-stone-500 font-sans">
          {AUTHORS_EDITION_LABEL}
        </p>
        <p className="mt-7 text-lg md:text-xl leading-relaxed text-stone-300 font-serif">
          {ORDER_BOOK_LEAD}
        </p>
        <div className="mt-9">
          <Button href="/order/direct" variant="primary" className="px-8">
            Checkout · ${PRICING.directPaperbackUsd.toFixed(2)} USD
          </Button>
        </div>
        <p className="mt-4 text-xs text-stone-500 font-sans">Standard shipping included.</p>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-5 text-center">
          <p className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">
            {AUTHORS_EDITION_WHAT}
          </p>
          <p className="text-sm text-stone-500 font-sans">
            {AUTHORS_EDITION_FULFILLMENT}
          </p>
        </div>

        <nav className="mt-12 pt-8 border-t border-stone-300/15 flex justify-center font-sans">
          <Link
            href="/books"
            className="inline-flex min-h-[44px] items-center text-sm text-stone-400 hover:text-stone-200 underline underline-offset-4"
          >
            Return to Book One
          </Link>
        </nav>
      </article>
    </main>
  );
}
