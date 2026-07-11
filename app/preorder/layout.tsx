import { Metadata } from 'next'
import { BOOK_CATALOG } from '@/lib/publishingMetadata'

export const metadata: Metadata = {
  title: 'Preorder Book One',
  description: `Preorder ${BOOK_CATALOG.title}. Publication ${BOOK_CATALOG.publicationDateDisplay}. See current print and digital pricing on the order page and retailers.`,
  keywords: ['preorder', 'book preorder', 'The Cosmic Tapestry', 'Stardust to Sovereignty', 'book one'],
  openGraph: {
    title: `Preorder | ${BOOK_CATALOG.title}`,
    description: `${BOOK_CATALOG.title} · ${BOOK_CATALOG.publicationDateDisplay}.`,
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
