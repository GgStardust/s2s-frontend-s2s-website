import Link from 'next/link';
import type { Metadata } from 'next';
import { CONTACT_EMAIL, ORDER_RETAILERS } from '@/lib/content';
import { LEGAL_LAST_UPDATED, LEGAL_SITE_NAME } from '@/lib/legalCopy';
import { AUTHORS_EDITION_LABEL } from '@/lib/orderCopy';
import { BOOK_CATALOG, PRICING } from '@/lib/publishingMetadata';

export const metadata: Metadata = {
  title: `Terms · ${BOOK_CATALOG.title}`,
  description: `Terms of service for ${LEGAL_SITE_NAME}. Purchases, shipping, and use of site content.`,
  robots: { index: true, follow: true },
};

const linkClass =
  'text-stone-400 hover:text-stone-200 underline underline-offset-4';

export default function TermsPage() {
  const amazon = ORDER_RETAILERS[0];

  return (
    <main className="min-h-screen bg-book-vessel pb-20">
      <div className="max-w-3xl mx-auto px-6 py-14 md:py-18">
        <header className="border-b border-stone-300/15 pb-10 mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-3 font-sans">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-100 font-serif">
            Terms of Service
          </h1>
          <p className="text-sm text-stone-500 mt-4 font-sans">Last updated: {LEGAL_LAST_UPDATED}</p>
        </header>

        <article className="space-y-10 text-base leading-relaxed text-stone-300 font-serif">
          <p>
            These terms apply to your use of {LEGAL_SITE_NAME} and purchases of{' '}
            <em>{BOOK_CATALOG.title}</em> offered here.
          </p>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Purchases</h2>
            <p>
              <strong className="text-stone-200 font-medium">{AUTHORS_EDITION_LABEL} (this site).</strong> You may order
              the paperback directly through Stripe Checkout. The listed price (${PRICING.directPaperbackUsd.toFixed(2)}{' '}
              USD at time of writing) includes standard shipping to eligible countries shown at checkout. Payment,
              billing, and shipping details are collected by Stripe. Orders are fulfilled by {BOOK_CATALOG.author}.
            </p>
            <p>
              <strong className="text-stone-200 font-medium">Retailers.</strong> Paperback and ebook editions are also
              available through {amazon.name} and other booksellers. Those purchases are governed by the retailer&apos;s
              terms, pricing, and shipping policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Shipping</h2>
            <p>
              Author&apos;s Edition orders ship after payment is confirmed. Delivery times depend on destination and
              carrier service. International orders may be subject to customs duties or import fees collected by local
              authorities.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Refunds</h2>
            <p>
              Author&apos;s Edition orders on this site are final. For retailer purchases, refund and return policies
              follow the retailer you used.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Intellectual property</h2>
            <p>
              All content on this website and in the books is the intellectual property of Stardust to Sovereignty and
              is protected by copyright. Reproduction, distribution, or creation of derivative works requires written
              permission.
            </p>
            <p>
              Stardust to Sovereignty, S2S, {BOOK_CATALOG.title}, The Living Civilization, The Resonant Species, and
              related book and series marks are trademarks of Stardust to Sovereignty. Unauthorized use is prohibited.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Website use</h2>
            <p>
              Site content is provided for reading about and ordering the book. We may update these terms or site
              content as the book and availability evolve.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Contact</h2>
            <p>
              Questions about these terms:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </article>

        <div className="mt-12 pt-8 border-t border-stone-300/15">
          <Link href="/" className={`text-sm font-sans ${linkClass}`}>
            ← Home
          </Link>
        </div>
      </div>
    </main>
  );
}
