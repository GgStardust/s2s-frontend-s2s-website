import type { Metadata } from 'next'
import { Montserrat, Lora } from 'next/font/google'
import './globals.css'
import DashboardNav from '@/components/navigation/DashboardNav'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Stardust to Sovereignty Dashboard',
  description: 'A comprehensive framework for understanding and developing sovereign consciousness through 13 fundamental Orbs.',
  keywords: ['consciousness', 'sovereignty', 'orbs', 'spiritual development', 'quantum intelligence'],
  authors: [{ name: 'Gigi Stardust' }],
  openGraph: {
    title: 'Stardust to Sovereignty Dashboard',
    description: 'A comprehensive framework for understanding and developing sovereign consciousness through 13 fundamental Orbs.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stardust to Sovereignty Dashboard',
    description: 'A comprehensive framework for understanding and developing sovereign consciousness through 13 fundamental Orbs.',
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
  return (
    <html lang="en" className={`${montserrat.variable} ${lora.variable}`}>
      <body className="bg-deep-navy text-creamy-white min-h-screen">
        <DashboardNav />
        {children}
      </body>
    </html>
  )
}
