import Link from 'next/link';
import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import ExpandableExcerpt from '@/components/ExpandableExcerpt';
import FirstReaders from '@/components/FirstReaders';
import { ORDER_CTA } from '@/lib/content';
import { BOOK_CATALOG, PRICING } from '@/lib/publishingMetadata';
import {
  bodyAsTechnologyTeaser,
  interludeFieldRemembers,
  prologueOpeningVerbatim,
  prologueSummary,
} from '@/lib/manuscriptWebsiteCopy';
import { HOMEPAGE_SERIES, READ_INTERLUDE_ROLE, BOOK_SERIES_CONTEXT } from '@/lib/homepageCopy';

export const metadata: Metadata = {
  title: 'Read',
  description: `${BOOK_CATALOG.title} (${BOOK_CATALOG.volumeLabel}, ${BOOK_CATALOG.series}). Excerpts from the Author\u2019s Edition.`,
  openGraph: {
    title: `Read | ${BOOK_CATALOG.title}`,
    description: BOOK_CATALOG.catalogDescriptionShort,
  },
};

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-book-vessel pb-20">
      <section className="max-w-3xl mx-auto py-14 md:py-16 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-3 font-sans">{BOOK_SERIES_CONTEXT}</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-100 font-serif">The Cosmic Tapestry</h1>
        <p className="text-base text-stone-500 leading-relaxed mt-5 max-w-xl mx-auto font-serif">
          Three samples: prologue, a structural chapter, and an imaginative passage. That is the book&apos;s dual register.
        </p>
      </section>

      <section
        id="from-the-manuscript"
        className="scroll-mt-28 max-w-3xl mx-auto px-6 pb-12 space-y-8 border-t border-stone-300/15 pt-12"
      >
        <div id="prologue-excerpt" className="scroll-mt-28">
          <ExpandableExcerpt
            label="Prologue"
            title="Before Form, I Witnessed You"
            excerpt={prologueOpeningVerbatim.first}
            fullText={prologueOpeningVerbatim.continuation}
            paraphrase={{ text: prologueSummary }}
          />
        </div>

        <ExpandableExcerpt
          label="Structural chapter"
          title="The Body as Advanced Biological Technology"
          excerpt={bodyAsTechnologyTeaser.excerpt}
          italicExcerpt={bodyAsTechnologyTeaser.italic}
          paraphrase={{ text: bodyAsTechnologyTeaser.summary }}
        />

        <ExpandableExcerpt
          label="Imaginative passage"
          title={interludeFieldRemembers.title}
          excerpt={interludeFieldRemembers.excerpt}
          fullText={interludeFieldRemembers.continuation}
          paraphrase={{ text: READ_INTERLUDE_ROLE }}
        />

        <p className="text-sm text-stone-500 text-center font-sans pt-2">
          <Link href="/about" className="text-stone-400 hover:text-cyan-200 underline underline-offset-4">
            About the book and trilogy →
          </Link>
        </p>
      </section>

      <FirstReaders compact />

      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-stone-300/15">
        <h2 className="text-lg font-semibold text-stone-200 mb-3 font-sans">{HOMEPAGE_SERIES.title}</h2>
        <p className="text-base text-stone-400 leading-relaxed font-serif">{HOMEPAGE_SERIES.lead}</p>
        <p className="text-sm text-stone-500 mt-4 font-serif italic">{HOMEPAGE_SERIES.bookOne}</p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <Button href="/order/direct" variant="primary" className="text-base px-8">
          {ORDER_CTA.primary(PRICING.directPaperbackUsd)}
        </Button>
        <p className="mt-3 text-sm font-sans">
          <Link href="/order" className="text-stone-500 hover:text-cyan-200 underline underline-offset-4">
            {ORDER_CTA.whereToBuy}
          </Link>
        </p>
      </section>
    </main>
  );
}
