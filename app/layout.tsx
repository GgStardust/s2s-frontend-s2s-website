import type { Metadata, Viewport } from 'next'
import { Montserrat, Lora } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import Navigation from '@/components/Navigation'
import NewsletterSignup from '@/components/NewsletterSignup'
import Breadcrumbs from '@/components/Breadcrumbs'
import Analytics from '@/components/Analytics'
import { CONTACT_EMAIL } from '@/lib/content'
import { BOOK_SERIES_CONTEXT } from '@/lib/homepageCopy'
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
      "email": CONTACT_EMAIL,
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
        <Navigation />
        <Breadcrumbs />
        <main id="main-content" className="flex-grow">
        {children}
        </main>
        <footer className="text-center text-base text-stone-400 py-12 pb-[max(3rem,calc(env(safe-area-inset-bottom,0px)+2.5rem))] border-t border-stone-300/15">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
            <div>
              <p className="text-stone-100 mb-1 font-serif text-lg">{BOOK_CATALOG.title}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-1 font-sans">{BOOK_SERIES_CONTEXT}</p>
              <p className="text-sm text-stone-500 mb-4 font-sans">{BOOK_CATALOG.author}</p>
              <p className="text-xs text-stone-600 mb-6 font-sans">
                © {new Date().getFullYear()} {BOOK_CATALOG.author}. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm sm:gap-x-4 sm:gap-y-2 font-sans">
                <Link
                  href="/books"
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-stone-400 hover:text-stone-200 underline underline-offset-4 touch-manipulation"
                >
                  Read
                </Link>
                <Link
                  href="/about"
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-stone-400 hover:text-stone-200 underline underline-offset-4 touch-manipulation"
                >
                  About
                </Link>
                <Link
                  href="/order"
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-stone-300 hover:text-stone-100 underline underline-offset-4 touch-manipulation"
                >
                  Order
                </Link>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-stone-400 hover:text-stone-200 underline underline-offset-4 touch-manipulation"
                >
                  {CONTACT_EMAIL}
                </a>
                <a
                  href="https://www.instagram.com/gigi_stardust/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-stone-500 hover:text-stone-300 underline underline-offset-4 touch-manipulation"
                >
                  Instagram
                </a>
                <Link
                  href="/privacy"
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-stone-600 hover:text-stone-400 underline underline-offset-4 touch-manipulation"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-stone-600 hover:text-stone-400 underline underline-offset-4 touch-manipulation"
                >
                  Terms
                </Link>
              </div>
              <p className="text-xs text-stone-600 mt-6 font-sans">
                Wholesale inquiries:{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-stone-500 hover:text-stone-300 underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
            <div className="pt-6 border-t border-stone-300/15">
              <p className="text-sm text-stone-500 mb-4 font-sans">Occasional notes on the book and availability.</p>
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
