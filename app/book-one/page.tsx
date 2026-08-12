import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/book-one'

export const metadata: Metadata = {
  title: 'Book One: The Cosmic Tapestry',
  description:
    'The Cosmic Tapestry by Gigi Stardust, Book One of Stardust to Sovereignty: a body-first map of recognition, coherence, and sovereign participation.',
  openGraph: {
    title: 'The Cosmic Tapestry · Book One',
    description:
      'A body-first map of recognition, coherence, and sovereign participation.',
  },
}

export default function BookOnePage() {
  return <PageMain />
}
