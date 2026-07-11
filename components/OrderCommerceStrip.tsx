import Link from 'next/link';
import Button from '@/components/ui/Button';
import { AMAZON_LISTING_URL, BOOK_CATALOG, PRICING } from '@/lib/publishingMetadata';
import { ORDER_CTA } from '@/lib/content';

type OrderCommerceStripProps = {
  variant?: 'inline' | 'sticky';
  className?: string;
};

export default function OrderCommerceStrip({ variant = 'inline', className = '' }: OrderCommerceStripProps) {
  const price = PRICING.directPaperbackUsd;
  const primaryLabel = ORDER_CTA.primary(price);

  if (variant === 'sticky') {
    return (
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 border-t border-cyan-500/25 bg-cosmic-blue/95 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)] ${className}`}
        role="region"
        aria-label="Order the book"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-stone-300 text-center sm:text-left font-sans">
            {ORDER_CTA.editionLine(price, BOOK_CATALOG.publicationDateDisplay)}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Button href="/order/direct" variant="primary" className="text-sm px-5 py-2.5 min-h-[44px]">
              {primaryLabel}
            </Button>
            <a
              href={AMAZON_LISTING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center text-sm text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4 px-2 touch-manipulation"
            >
              {ORDER_CTA.amazonSecondary}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`terminator-border rounded-lg ${className}`}
      role="region"
      aria-label="Order the book"
    >
      <div className="p-5 sm:p-6 bg-cosmic-blue rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium text-stone-100 font-sans">{BOOK_CATALOG.title}</p>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            {ORDER_CTA.editionLine(price, BOOK_CATALOG.publicationDateDisplay)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Button href="/order/direct" variant="primary" className="text-sm px-6 min-h-[44px] w-full sm:w-auto">
            {primaryLabel}
          </Button>
          <a
            href={AMAZON_LISTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center text-sm text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4 px-2 touch-manipulation"
          >
            {ORDER_CTA.amazonSecondary}
          </a>
          <Link
            href="/order"
            className="inline-flex min-h-[44px] items-center text-sm text-stone-500 hover:text-stone-300 underline underline-offset-4 px-2 touch-manipulation"
          >
            {ORDER_CTA.whereToBuy}
          </Link>
        </div>
      </div>
    </div>
  );
}
