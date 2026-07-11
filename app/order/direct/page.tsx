import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import StripeCheckoutButton from '@/components/direct-checkout/StripeCheckoutButton';
import { getDirectSalePriceUsd } from '@/lib/directPricing';
import { orderOpeningQuote } from '@/lib/manuscriptWebsiteCopy';
import { BOOK_CATALOG, PRICING } from '@/lib/publishingMetadata';

export const metadata: Metadata = {
  title: 'Order direct',
  description: `Order ${BOOK_CATALOG.title} directly from the author. Secure checkout; shipping included.`,
};

export default function DirectOrderPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const priceUsd = getDirectSalePriceUsd();
  const canceled = searchParams.canceled === '1';

  return (
    <main className="min-h-screen bg-structural-grid relative">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-14 md:py-20">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/70 mb-3">
            {BOOK_CATALOG.volumeLabel} · {BOOK_CATALOG.series}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 mb-4">
            Order from the author
          </h1>
          <p className="text-base text-stone-400 max-w-2xl leading-relaxed">
            Paperback trim · {BOOK_CATALOG.title}. Author&apos;s Edition: one payment of ${priceUsd.toFixed(2)} USD
            includes standard shipping. Your copy is printed and fulfilled directly by the author.
          </p>
          <p className="mt-6 max-w-2xl text-stone-300 italic text-base leading-relaxed border-l-2 border-cyan-500/25 pl-4">
            &ldquo;{orderOpeningQuote}&rdquo;
          </p>
        </header>

        {canceled && (
          <div
            className="mb-8 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
            role="status"
          >
            Checkout was canceled. Your account remains unchanged. You can try again when you are ready.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start mb-14">
          <div className="flex justify-center md:justify-start">
            <div className="book-cover-wrapper max-w-[280px]">
              <div className="terminator-border rounded-sm w-full">
                <div className="rounded-sm p-2 bg-cosmic-blue">
                  <div className="book-cover-inner flex">
                    <div className="relative overflow-hidden rounded-l-sm min-w-0">
                      <Image
                        src="/book-cover.png"
                        alt={`${BOOK_CATALOG.title} cover`}
                        width={280}
                        height={420}
                        className="w-full h-auto block"
                        priority
                      />
                    </div>
                    <div className="book-cover-spine" aria-hidden />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-stone-200 leading-relaxed">{BOOK_CATALOG.catalogDescriptionShort}</p>
            <div className="rounded-lg border border-cyan-500/20 bg-cosmic-blue/50 px-4 py-3 text-sm text-stone-300 space-y-1">
              <p>
                <span className="text-cyan-300/90 font-semibold text-lg">${priceUsd.toFixed(2)} USD</span>
                <span className="text-stone-500"> · shipping included</span>
              </p>
              <p className="text-stone-500 text-xs leading-relaxed">
                Retailers such as Amazon often show a lower paperback list (about ${PRICING.paperbackUsd}.00 USD) plus
                their own shipping. This direct price covers fulfillment and standard shipping in one total.
              </p>
            </div>
          </div>
        </div>

        <div className="terminator-border rounded-lg">
          <div className="rounded-lg bg-cosmic-blue p-6 md:p-8 border border-cyan-500/15">
            <h2 className="text-lg font-semibold text-cyan-300 mb-4">Checkout</h2>
            <p className="text-sm text-stone-500 mb-6 max-w-prose">
              Total <span className="text-stone-300">${priceUsd.toFixed(2)} USD</span> includes standard shipping.
            </p>
            <StripeCheckoutButton priceUsd={priceUsd} />
          </div>
        </div>

        <p className="mt-10 text-sm text-stone-500 max-w-xl">
          Payments are processed by Stripe. Shipping and contact details are collected on Stripe&apos;s secure page and
          appear in your Stripe receipt and dashboard for fulfillment.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <Link href="/order" className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4">
            Other ways to buy
          </Link>
          <Link href="/" className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
