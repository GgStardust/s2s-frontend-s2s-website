import Link from 'next/link';
import type { Metadata } from 'next';
import { CONTACT_EMAIL } from '@/lib/content';
import { LEGAL_LAST_UPDATED, LEGAL_SITE_NAME } from '@/lib/legalCopy';
import { BOOK_CATALOG } from '@/lib/publishingMetadata';

export const metadata: Metadata = {
  title: `Privacy · ${BOOK_CATALOG.title}`,
  description: `Privacy policy for ${LEGAL_SITE_NAME}. How we handle information for book orders and newsletter signups.`,
  robots: { index: true, follow: true },
};

const linkClass =
  'text-stone-400 hover:text-stone-200 underline underline-offset-4';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-book-vessel pb-20">
      <div className="max-w-3xl mx-auto px-6 py-14 md:py-18">
        <header className="border-b border-stone-300/15 pb-10 mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-3 font-sans">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-100 font-serif">
            Privacy Policy
          </h1>
          <p className="text-sm text-stone-500 mt-4 font-sans">Last updated: {LEGAL_LAST_UPDATED}</p>
        </header>

        <article className="space-y-10 text-base leading-relaxed text-stone-300 font-serif">
          <p>
            This policy describes how {LEGAL_SITE_NAME} handles personal information when you order{' '}
            <em>{BOOK_CATALOG.title}</em>, join the mailing list, or contact us.
          </p>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Information we collect</h2>
            <p>We collect information you provide directly, including:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 font-sans text-stone-400 text-sm">
              <li>Email address when you subscribe to occasional book and availability notes</li>
              <li>
                Name, email, phone (if provided), shipping address, and payment details when you purchase the
                Author&apos;s Edition through Stripe Checkout on this site
              </li>
              <li>Messages you send to {CONTACT_EMAIL}</li>
            </ul>
            <p className="text-sm text-stone-500 font-sans">
              Payment and shipping for the Author&apos;s Edition are collected on Stripe&apos;s hosted checkout page.
              We receive order and fulfillment details from Stripe after checkout completes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">How we use information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 font-sans text-stone-400 text-sm">
              <li>Process and fulfill Author&apos;s Edition orders</li>
              <li>Send order confirmations and shipping-related messages</li>
              <li>Send newsletter messages when you have subscribed</li>
              <li>Respond to wholesale and general inquiries</li>
              <li>Understand site traffic through privacy-oriented analytics (see below)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Service providers</h2>
            <p>We use trusted providers to operate the site:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 font-sans text-stone-400 text-sm">
              <li>
                <strong className="text-stone-300 font-medium">Stripe</strong> for payment processing and checkout
              </li>
              <li>
                <strong className="text-stone-300 font-medium">Formspree</strong> for newsletter signups
              </li>
              <li>
                <strong className="text-stone-300 font-medium">Vercel</strong> for hosting and privacy-oriented
                analytics
              </li>
              <li>
                <strong className="text-stone-300 font-medium">Google Analytics</strong> when enabled via site
                configuration
              </li>
            </ul>
            <p className="text-sm text-stone-500 font-sans">
              Orders placed through Amazon or other retailers are governed by those services&apos; privacy policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Your choices</h2>
            <p>
              You may unsubscribe from the newsletter using the link in any message. For access, correction, or deletion
              of personal information, contact{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-section-title font-semibold text-stone-200 font-serif">Contact</h2>
            <p>
              Questions about this policy:{' '}
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
