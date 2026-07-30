import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/content';
import { LEGAL_LAST_UPDATED, LEGAL_SITE_NAME } from '@/lib/legalCopy';

export const metadata: Metadata = {
  title: 'Privacy',
  description: `Privacy policy for ${LEGAL_SITE_NAME}.`,
  robots: { index: true, follow: true },
};

const linkClass = 'text-stone-400 hover:text-stone-200 underline underline-offset-4';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-book-vessel pb-20">
      <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
        <header className="border-b border-stone-300/15 pb-10 mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-3 font-sans">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-100 font-serif">
            Privacy Policy
          </h1>
          <p className="text-sm text-stone-500 mt-4 font-sans">Last updated: {LEGAL_LAST_UPDATED}</p>
        </header>

        <article className="space-y-10 text-base leading-relaxed text-stone-300 font-serif">
          <p>
            This policy describes how {LEGAL_SITE_NAME} handles personal information when you join the mailing list,
            contact us, place a direct book order, or visit the site.
          </p>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Information we collect</h2>
            <ul className="list-disc list-outside ml-5 space-y-2 font-sans text-stone-400 text-sm">
              <li>Email address when you subscribe to occasional notes</li>
              <li>Messages you send to {CONTACT_EMAIL}</li>
              <li>Contact, purchase, and shipping information associated with a direct book order</li>
              <li>Basic site usage information collected through enabled analytics services</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">How we use information</h2>
            <p>
              Information is used to send messages you requested, respond to inquiries, complete direct purchases,
              maintain purchase history, and understand general site activity.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Service providers</h2>
            <p>
              The site may use Formspree for mailing-list signups, Vercel for hosting and analytics, Google Analytics
              when enabled, Stripe for payment processing and purchase records, and service providers required to
              fulfill direct orders. Each provider handles information under its own privacy terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Your choices</h2>
            <p>
              You may unsubscribe using the link in any mailing-list message. For access, correction, or deletion
              requests, contact{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              .
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
