import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ORDER_CTA, ORDER_RETAILERS } from '@/lib/content';
import { BOOK_CATALOG, PRICING } from '@/lib/publishingMetadata';

export default function OrderPage() {
  const otherRetailers = ORDER_RETAILERS;

  return (
    <main className="min-h-screen bg-structural-grid relative">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-14 md:py-20">
        <header className="mb-10 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 mb-3">
            Where to buy
          </h1>
          <p className="text-base text-stone-400 leading-relaxed max-w-2xl">
            <span className="text-stone-300">{BOOK_CATALOG.title}</span>
            {' · '}
            {BOOK_CATALOG.volumeLabel}, {BOOK_CATALOG.series}. Author&apos;s Edition.
          </p>
          <p className="text-sm text-stone-500 mt-3">{BOOK_CATALOG.bisacShelf}</p>
          <div className="mt-6">
            <Button href="/order/direct" variant="primary" className="w-full sm:w-auto">
              {ORDER_CTA.primary(PRICING.directPaperbackUsd)}
            </Button>
          </div>
        </header>

        <section aria-labelledby="edition-facts-heading" className="mb-10">
          <h2 id="edition-facts-heading" className="sr-only">
            Edition details
          </h2>
          <div className="rounded-lg border border-stone-400/20 bg-cosmic-blue/60 p-5 md:p-6 text-sm text-stone-300 space-y-2">
            <p>
              <span className="text-stone-400">Publication: </span>
              {BOOK_CATALOG.publicationDateDisplay}
            </p>
            <p>
              <span className="text-stone-400">Trim: </span>
              {BOOK_CATALOG.trimSize} ·{' '}
              <span className="text-stone-400">Reference page count: </span>
              {BOOK_CATALOG.pageCountIngramAmazon} pp.
            </p>
            <p>
              <span className="text-stone-400">Marketplace paperback (typical list): </span>${PRICING.paperbackUsd}{' '}
              USD · <span className="text-stone-400">Ebook: </span>${PRICING.digitalUsd} USD
            </p>
            <p>
              <span className="text-stone-400">Author&apos;s Edition (this site): </span>${PRICING.directPaperbackUsd}{' '}
              USD including standard shipping
            </p>
            <p className="text-stone-400 pt-1">{PRICING.websitePaperbackNote}</p>
          </div>
        </section>

        <section aria-labelledby="more-retailers-heading">
          <h2 id="more-retailers-heading" className="text-lg font-semibold text-stone-200 mb-4">
            More channels
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {otherRetailers.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-stone-400/20 bg-cosmic-blue/80 p-5 md:p-6 backdrop-blur-sm"
              >
                <h3 className="text-base font-medium text-stone-100 mb-2">{r.name}</h3>
                <p className="text-sm text-stone-400 mb-4">{r.blurb}</p>
                {!r.href ? (
                  <p className="text-xs uppercase tracking-wider text-stone-500">Coming soon</p>
                ) : (
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
                  >
                    Shop this title
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 pt-8 border-t border-stone-400/20 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <Link href="/" className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4">
            ← Home
          </Link>
          <Link href="/books" className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4">
            Excerpts
          </Link>
          <Link href="/about" className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4">
            About
          </Link>
        </div>
      </div>
    </main>
  );
}
