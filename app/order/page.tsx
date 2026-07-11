import Link from 'next/link';
import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import { ORDER_CTA, ORDER_RETAILERS, CONTACT_EMAIL } from '@/lib/content';
import { BOOK_SERIES_CONTEXT } from '@/lib/homepageCopy';
import {
  AUTHORS_EDITION_FULFILLMENT,
  AUTHORS_EDITION_LABEL,
  AUTHORS_EDITION_WHAT,
  ORDER_BOOK_LEAD,
  ORDER_WHOLESALE_NOTE,
} from '@/lib/orderCopy';
import { BOOK_CATALOG, PRICING } from '@/lib/publishingMetadata';

export const metadata: Metadata = {
  title: `Order · ${BOOK_CATALOG.title}`,
  description: `Order The Cosmic Tapestry (${AUTHORS_EDITION_LABEL}).`,
};

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-book-vessel pb-20">
      <header className="max-w-3xl mx-auto px-6 pt-14 md:pt-18 pb-10 text-center border-b border-stone-300/15">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-3 font-sans">{BOOK_SERIES_CONTEXT}</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-100 font-serif">
          {BOOK_CATALOG.title}
        </h1>
        <p className="text-base text-stone-400 mt-3 font-sans">{AUTHORS_EDITION_LABEL}</p>
        <p className="text-base text-stone-500 leading-relaxed mt-5 max-w-xl mx-auto font-serif">{ORDER_BOOK_LEAD}</p>
        <div className="mt-8">
          <Button href="/order/direct" variant="primary" className="px-8">
            {ORDER_CTA.primary(PRICING.directPaperbackUsd)}
          </Button>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-center md:text-left">
        <p className="text-base leading-relaxed text-stone-400 font-serif">{AUTHORS_EDITION_WHAT}</p>
        <p className="text-sm text-stone-500 font-sans">{AUTHORS_EDITION_FULFILLMENT}</p>

        <div className="pt-6 border-t border-stone-300/15 space-y-3">
          <p className="text-sm text-stone-500 font-sans">
            {ORDER_RETAILERS[0].name}:{' '}
            <a
              href={ORDER_RETAILERS[0].href!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-stone-200 underline underline-offset-4"
            >
              paperback and ebook
            </a>
          </p>
          <p className="text-sm text-stone-500 font-sans">
            {ORDER_WHOLESALE_NOTE}{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-stone-400 hover:text-stone-200 underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Button href="/order/direct" variant="primary" className="px-8">
            {ORDER_CTA.primary(PRICING.directPaperbackUsd)}
          </Button>
          <Link href="/books" className="inline-flex min-h-[44px] items-center text-sm text-stone-500 hover:text-stone-300 underline underline-offset-4 font-sans">
            Read an excerpt
          </Link>
        </div>
      </article>
    </main>
  );
}
