import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/content';
import { SITE } from '@/lib/coreSiteCopy';
import { LEGAL_LAST_UPDATED, LEGAL_SITE_NAME } from '@/lib/legalCopy';

export const metadata: Metadata = {
  title: 'Terms',
  description: `Terms of use for ${LEGAL_SITE_NAME}.`,
  robots: { index: true, follow: true },
};

const linkClass = 'text-stone-400 hover:text-stone-200 underline underline-offset-4';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-book-vessel pb-20">
      <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
        <header className="border-b border-stone-300/15 pb-10 mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-3 font-sans">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-100 font-serif">
            Terms of Use
          </h1>
          <p className="text-sm text-stone-500 mt-4 font-sans">Last updated: {LEGAL_LAST_UPDATED}</p>
        </header>

        <article className="space-y-10 text-base leading-relaxed text-stone-300 font-serif">
          <p>These terms apply to your use of {LEGAL_SITE_NAME}.</p>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Direct book purchases</h2>
            <p>
              Direct paperback purchases are processed through Stripe. The price and shipping terms displayed at
              checkout apply to the order. Contact{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>{' '}
              with questions about a direct purchase.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Site content</h2>
            <p>
              The site presents an evolving body of authored work. Descriptions, availability, project language, and
              public selections may change as the work develops.
            </p>
            <p>
              Original content identified with {SITE.name} or {SITE.author} remains part of the authored field.
              Please request written permission before reproducing or distributing substantial portions.
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
