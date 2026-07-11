import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import StripeCheckoutButton from '@/components/direct-checkout/StripeCheckoutButton';
import { getDirectSalePriceUsd } from '@/lib/directPricing';
import { BOOK_SERIES_CONTEXT } from '@/lib/homepageCopy';
import { AUTHORS_EDITION_LABEL, AUTHORS_EDITION_WHAT } from '@/lib/orderCopy';
import { BOOK_CATALOG } from '@/lib/publishingMetadata';

export const metadata: Metadata = {
  title: `Checkout · ${BOOK_CATALOG.title}`,
  description: `Order The Cosmic Tapestry (${AUTHORS_EDITION_LABEL}).`,
};

export default function DirectOrderPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const priceUsd = getDirectSalePriceUsd();
  const canceled = searchParams.canceled === '1';

  return (
    <main className="min-h-screen bg-book-vessel pb-20">
      <div className="max-w-3xl mx-auto px-6 py-14 md:py-16">
        <header className="text-center mb-10 border-b border-stone-300/15 pb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-3 font-sans">{BOOK_SERIES_CONTEXT}</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-100 font-serif">
            {BOOK_CATALOG.title}
          </h1>
          <p className="text-base text-stone-400 mt-3 font-sans">
            {AUTHORS_EDITION_LABEL} · ${priceUsd.toFixed(2)} USD · shipping included
          </p>
        </header>

        {canceled && (
          <div
            className="mb-8 rounded-sm border border-stone-500/30 bg-stone-400/5 px-4 py-3 text-sm text-stone-300 font-sans"
            role="status"
          >
            Checkout was canceled.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-10">
          <div className="flex justify-center md:justify-start">
            <div className="rounded-sm p-2 bg-cosmic-blue-light/30 max-w-[260px]">
              <Image
                src="/book-cover.png"
                alt={`${BOOK_CATALOG.title} cover`}
                width={260}
                height={390}
                className="w-full h-auto block rounded-sm"
                priority
              />
            </div>
          </div>
          <p className="text-base leading-relaxed text-stone-400 font-serif">{AUTHORS_EDITION_WHAT}</p>
        </div>

        <StripeCheckoutButton priceUsd={priceUsd} />

        <div className="mt-10 flex flex-wrap gap-x-4 gap-y-2 text-sm font-sans justify-center">
          <Link href="/order" className="text-stone-500 hover:text-stone-300 underline underline-offset-4">
            Other ways to buy
          </Link>
          <Link href="/books" className="text-stone-500 hover:text-stone-300 underline underline-offset-4">
            Read an excerpt
          </Link>
        </div>
      </div>
    </main>
  );
}
