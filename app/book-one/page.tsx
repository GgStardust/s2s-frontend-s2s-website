import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/book-one'

export const metadata: Metadata = {
  title: 'Book One — The Cosmic Tapestry',
  description:
    'The Cosmic Tapestry — Book One of Stardust to Sovereignty by Gigi Stardust. Literary opening, excerpts, and purchase.',
  openGraph: {
    title: 'The Cosmic Tapestry · Book One',
    description:
      'The first completed literary embodiment of Stardust to Sovereignty.',
  },
}

export default function BookOnePage() {
  return <PageMain />
}
