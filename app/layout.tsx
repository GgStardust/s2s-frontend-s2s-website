import type { Metadata, Viewport } from 'next';
import { Lora, Montserrat } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import Analytics from '@/components/Analytics';
import Breadcrumbs from '@/components/Breadcrumbs';
import Navigation from '@/components/Navigation';
import NewsletterSignup from '@/components/NewsletterSignup';
import { CONTACT_EMAIL } from '@/lib/content';
import { SITE } from '@/lib/coreSiteCopy';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    SITE.name,
    'Gigi Stardust',
    'Coherent inhabitation',
    'Developmental architecture',
    'The Resonant Species',
    'Living Literary Technology',
    'Source Field',
    'The Cosmic Tapestry',
  ],
  authors: [{ name: SITE.author, url: 'https://stardusttosovereignty.com/about-gigi' }],
  creator: SITE.author,
  metadataBase: new URL('https://stardusttosovereignty.com'),
  alternates: {
    canonical: 'https://stardusttosovereignty.com',
  },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: 'website',
    url: 'https://stardusttosovereignty.com',
    siteName: SITE.name,
    locale: 'en_US',
    images: [
      {
        url: '/og-v4.png',
        width: 1200,
        height: 630,
        alt: 'Stardust to Sovereignty: How do we change without losing where we came from?',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description,
    images: ['/og-v4.png'],
    creator: '@gigi_stardust',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: SITE.name,
    description: SITE.description,
    url: 'https://stardusttosovereignty.com',
    creator: {
      '@type': 'Person',
      name: SITE.author,
      url: 'https://stardusttosovereignty.com/about-gigi',
    },
  };

  return (
    <html lang="en" className={`${montserrat.variable} ${lora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-cosmic-blue text-cream min-h-screen flex flex-col font-sans antialiased">
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <Navigation />
        <Breadcrumbs />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <footer className="border-t border-stone-300/15 py-12 pb-[max(3rem,calc(env(safe-area-inset-bottom,0px)+2.5rem))]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16">
              <div>
                <p className="text-xl text-stone-100 font-serif">{SITE.name}</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-500 font-sans">
                  A philosophical and creative body of work by Gigi Stardust.
                </p>
                <p className="mt-5 text-xs text-stone-600 font-sans">
                  © {new Date().getFullYear()} {SITE.author}. All rights reserved.
                </p>
              </div>
              <nav className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm font-sans" aria-label="Footer">
                <Link href="/about" className="text-stone-400 hover:text-stone-200">
                  The Work
                </Link>
                <Link href="/source-field" className="text-stone-400 hover:text-stone-200">
                  Source Field
                </Link>
                <Link href="/books" className="text-stone-400 hover:text-stone-200">
                  Book One
                </Link>
                <Link href="/about-gigi" className="text-stone-400 hover:text-stone-200">
                  Gigi
                </Link>
                <Link href="/console" className="text-stone-500 hover:text-stone-300">
                  Console
                </Link>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-stone-500 hover:text-stone-300">
                  Contact
                </a>
                <Link href="/privacy" className="text-stone-600 hover:text-stone-400">
                  Privacy
                </Link>
                <Link href="/terms" className="text-stone-600 hover:text-stone-400">
                  Terms
                </Link>
              </nav>
            </div>

            <div className="mt-10 pt-8 border-t border-stone-300/10 max-w-xl">
              <p className="text-sm text-stone-500 mb-4 font-sans">
                Occasional notes from the evolving field.
              </p>
              <NewsletterSignup />
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
