import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google'
import Analytics from '@/components/Analytics'
import SiteFooter from '@/components/site/SiteFooter'
import SiteHeader from '@/components/site/SiteHeader'
import SiteInteractions from '@/components/site/SiteInteractions'
import './globals.css'
import '@/styles/cleanroom.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Stardust to Sovereignty',
    template: '%s | Stardust to Sovereignty',
  },
  description:
    'What becomes visible when we follow how things relate? Stardust to Sovereignty is an evolving inquiry by Gigi Stardust.',
  metadataBase: new URL('https://stardusttosovereignty.com'),
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'Gigi Stardust', url: 'https://stardusttosovereignty.com/gigi' }],
  creator: 'Gigi Stardust',
  openGraph: {
    title: 'Stardust to Sovereignty',
    description: 'What becomes visible when we follow how things relate?',
    type: 'website',
    url: 'https://stardusttosovereignty.com',
    siteName: 'Stardust to Sovereignty',
    locale: 'en_US',
    images: [
      {
        url: '/og-v7.png',
        width: 1200,
        height: 630,
        alt: 'Stardust to Sovereignty — What becomes visible when we follow how things relate?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stardust to Sovereignty',
    description: 'What becomes visible when we follow how things relate?',
    images: ['/og-v7.png'],
    creator: '@gigi_stardust',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plexMono.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <SiteInteractions />
        <Analytics />
      </body>
    </html>
  )
}
