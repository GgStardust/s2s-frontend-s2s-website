import { Metadata } from 'next'
import { BOOK_CATALOG } from '@/lib/publishingMetadata'

export const metadata: Metadata = {
  title: 'Order Book One',
  description: `Order ${BOOK_CATALOG.title}, Book One of Stardust to Sovereignty.`,
  keywords: ['book order', 'The Cosmic Tapestry', 'Stardust to Sovereignty', 'book one'],
  openGraph: {
    title: `Order | ${BOOK_CATALOG.title}`,
    description: `${BOOK_CATALOG.title} · Book One of Stardust to Sovereignty.`,
    type: 'website',
    url: 'https://stardusttosovereignty.com/preorder',
  },
  alternates: {
    canonical: 'https://stardusttosovereignty.com/preorder',
  },
}

export default function PreorderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
