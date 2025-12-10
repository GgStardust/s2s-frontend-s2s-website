import type { Metadata } from 'next'
import { Montserrat, Lora } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import Navigation from '@/components/Navigation'
import NewsletterSignup from '@/components/NewsletterSignup'
import Breadcrumbs from '@/components/Breadcrumbs'
import Analytics from '@/components/Analytics'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

export const metadata: Metadata = {
  title: 'Stardust to Sovereignty | Preorder Book One: The Cosmic Tapestry',
  description: 'A living architecture for coherence, perception, and sovereign identity. Preorder Book One: The Cosmic Tapestry - Ships February 28, 2026. Discover the Sovereign Field and the full system of sovereign intelligences.',
  keywords: ['Stardust to Sovereignty', 'consciousness technology', 'sovereign field', 'coherence system', 'perception', 'identity', 'preorder', 'book'],
  authors: [{ name: 'Stardust to Sovereignty' }],
  openGraph: {
    title: 'Stardust to Sovereignty | Preorder Book One: The Cosmic Tapestry',
    description: 'A living architecture for coherence, perception, and sovereign identity. Preorder now - Ships February 28, 2026.',
    type: 'website',
    url: 'https://stardusttosovereignty.com',
    siteName: 'Stardust to Sovereignty',
    images: [
      {
        url: 'https://stardusttosovereignty.com/book-cover.jpeg',
        width: 400,
        height: 600,
        alt: 'Stardust to Sovereignty Book One: The Cosmic Tapestry by Gigi Stardust',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stardust to Sovereignty | Preorder Book One',
    description: 'A living architecture for coherence, perception, and sovereign identity. Preorder now.',
    images: ['https://stardusttosovereignty.com/book-cover.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Stardust to Sovereignty",
    "url": "https://stardusttosovereignty.com",
    "logo": "https://stardusttosovereignty.com/logo.png",
    "description": "A living architecture for coherence, perception, and sovereign identity",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "gigi@gigistardust.com",
      "contactType": "Customer Service"
    },
    "sameAs": []
  };

  const bookStructuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "Book One: The Cosmic Tapestry",
    "alternateName": "Stardust to Sovereignty Book One: The Cosmic Tapestry",
    "author": {
      "@type": "Person",
      "name": "Gigi Stardust"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Stardust to Sovereignty"
    },
    "datePublished": "2026-02-28",
    "description": "A cosmological field report and foundational field manual introducing the structure of the Sovereign Field and the constellation of sovereign intelligences.",
    "bookFormat": ["Paperback", "EPUB"],
    "image": "https://stardusttosovereignty.com/book-cover.jpeg",
    "offers": {
      "@type": "Offer",
      "price": "44.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/PreOrder",
      "url": "https://stardusttosovereignty.com/preorder"
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
      <body className="bg-cosmic-blue text-cream min-h-screen flex flex-col">
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
        <footer className="text-center text-base text-stone-200 py-12 border-t border-stone-300/30">
          <div className="max-w-6xl mx-auto px-6 space-y-6">
            <div>
              <p className="text-stone-100 mb-2 font-medium">S2S - A Consciousness Technology</p>
              <p className="text-stone-300 mb-4">© {new Date().getFullYear()} Stardust to Sovereignty. All rights reserved.</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/privacy" className="text-stone-300 hover:text-cyan-300 underline underline-offset-4">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-stone-300 hover:text-cyan-300 underline underline-offset-4">
                  Terms of Service
                </Link>
                <a href="mailto:gigi@gigistardust.com" className="text-stone-300 hover:text-cyan-300 underline underline-offset-4">
                  Contact
                </a>
              </div>
            </div>
            <div className="pt-4 border-t border-stone-300/30">
              <p className="text-base text-stone-200 mb-3">Stay updated with preorder announcements and Console releases:</p>
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
