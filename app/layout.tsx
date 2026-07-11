import type { Metadata, Viewport } from 'next'
import { Montserrat, Lora } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import Navigation from '@/components/Navigation'
import NewsletterSignup from '@/components/NewsletterSignup'
import Breadcrumbs from '@/components/Breadcrumbs'
import Analytics from '@/components/Analytics'
import {
  AMAZON_LISTING_URL,
  BOOK_CATALOG,
  ISBN_SCHEMA_PRIMARY,
  PRICING,
  SEARCH_KEYWORDS,
} from '@/lib/publishingMetadata'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

const siteKeywords = [
  ...SEARCH_KEYWORDS,
  BOOK_CATALOG.title,
  BOOK_CATALOG.series,
  BOOK_CATALOG.author,
  'Stardust to Sovereignty',
]

export const metadata: Metadata = {
  title: {
    default: `The Cosmic Tapestry · Book One | ${BOOK_CATALOG.series}`,
    template: `%s | ${BOOK_CATALOG.series}`,
  },
  description: BOOK_CATALOG.metaDescription,
  keywords: siteKeywords,
  authors: [{ name: BOOK_CATALOG.author, url: 'https://stardusttosovereignty.com/about' }],
  creator: BOOK_CATALOG.author,
  publisher: BOOK_CATALOG.imprint,
  metadataBase: new URL('https://stardusttosovereignty.com'),
  alternates: {
    canonical: 'https://stardusttosovereignty.com',
  },
  openGraph: {
    title: `The Cosmic Tapestry · ${BOOK_CATALOG.volumeLabel} | ${BOOK_CATALOG.series}`,
    description: BOOK_CATALOG.catalogDescriptionShort,
    type: 'website',
    url: 'https://stardusttosovereignty.com',
    siteName: BOOK_CATALOG.series,
    locale: 'en_US',
    images: [
      {
        url: 'https://stardusttosovereignty.com/book-cover.png',
        width: 800,
        height: 1200,
        alt: `${BOOK_CATALOG.title} by ${BOOK_CATALOG.author}, ${BOOK_CATALOG.series}, ${BOOK_CATALOG.volumeLabel}`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `The Cosmic Tapestry · ${BOOK_CATALOG.volumeLabel} | ${BOOK_CATALOG.series}`,
    description: BOOK_CATALOG.catalogDescriptionShort,
    images: ['https://stardusttosovereignty.com/book-cover.png'],
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
  verification: {
    // Add Google Search Console verification if available
    // google: 'your-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": BOOK_CATALOG.imprint,
    "alternateName": BOOK_CATALOG.series,
    "url": "https://stardusttosovereignty.com",
    "logo": "https://stardusttosovereignty.com/logo.png",
    "description": BOOK_CATALOG.catalogDescriptionShort,
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "gigi@stardusttosovereignty.com",
      "contactType": "Customer Service"
    },
    "sameAs": []
  };

  const bookStructuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": BOOK_CATALOG.title,
    "alternateName": [
      `${BOOK_CATALOG.series}: ${BOOK_CATALOG.volumeLabel}`,
      `${BOOK_CATALOG.volumeLabel}: ${BOOK_CATALOG.title}`,
    ],
    "isbn": ISBN_SCHEMA_PRIMARY,
    "numberOfPages": BOOK_CATALOG.pageCountIngramAmazon,
    "author": {
      "@type": "Person",
      "name": BOOK_CATALOG.author
    },
    "publisher": {
      "@type": "Organization",
      "name": BOOK_CATALOG.imprint
    },
    "datePublished": BOOK_CATALOG.publicationDateISO,
    "description": BOOK_CATALOG.catalogDescriptionShort,
    "bookFormat": ["Paperback", "Ebook"],
    "image": "https://stardusttosovereignty.com/book-cover.png",
    "offers": {
      "@type": "Offer",
      "price": String(PRICING.paperbackUsd),
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": AMAZON_LISTING_URL
    }
  };

  return (
    <html lang="en" className={`${montserrat.variable} ${lora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bookStructuredData) }}
        />
      </head>
      <body className="bg-cosmic-blue text-cream min-h-screen flex flex-col font-sans antialiased">
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <div className="comet-container">
          <div className="comet"></div>
        </div>
        <Navigation />
        <Breadcrumbs />
        <main id="main-content" className="flex-grow">
        {children}
        </main>
        <footer className="text-center text-base text-stone-200 py-12 pb-[max(3rem,calc(env(safe-area-inset-bottom,0px)+2.5rem))] border-t border-stone-300/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
            <div>
              <p className="text-stone-100 mb-1 font-medium">{BOOK_CATALOG.title}</p>
              <p className="text-sm text-stone-400 mb-1">{BOOK_CATALOG.volumeLabel} · {BOOK_CATALOG.series}</p>
              <p className="text-xs text-stone-500 mb-3">{BOOK_CATALOG.imprint} · {BOOK_CATALOG.press}</p>
              <p className="text-stone-300 mb-2">© {new Date().getFullYear()} {BOOK_CATALOG.series}. All rights reserved.</p>
              <p className="text-stone-500 text-xs mb-4 max-w-xl mx-auto">
                RBI technology · U.S. Provisional Patent Application No. 63/909,031 (patent pending)
              </p>
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm sm:gap-x-5 sm:gap-y-2">
                <Link
                  href="/order"
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-stone-200 hover:text-cyan-300 underline underline-offset-4 touch-manipulation"
                >
                  Where to buy
                </Link>
                <a
                  href="mailto:gigi@stardusttosovereignty.com"
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-stone-300 hover:text-cyan-300 underline underline-offset-4 touch-manipulation"
                >
                  Contact
                </a>
                <a
                  href="https://www.instagram.com/gigi_stardust/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-stone-300 hover:text-cyan-300 underline underline-offset-4 touch-manipulation"
                >
                  Instagram
                </a>
                <Link
                  href="/source-field"
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-stone-300 hover:text-cyan-300 underline underline-offset-4 touch-manipulation"
                >
                  Source Field
                </Link>
                <Link
                  href="/console"
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-stone-500 hover:text-cyan-300 underline underline-offset-4 touch-manipulation"
                >
                  Console (coming 2026)
                </Link>
              </div>
            </div>
            <div className="pt-4 border-t border-stone-300/30">
              <p className="text-base text-stone-300 mb-3">Occasional updates: retailers, book news, Console.</p>
              <div className="max-w-md mx-auto">
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
