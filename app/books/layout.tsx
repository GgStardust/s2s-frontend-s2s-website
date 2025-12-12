import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Books | Stardust to Sovereignty',
  description: 'Explore the Stardust to Sovereignty book series. Book One: The Cosmic Tapestry introduces the Sovereign Field and constellation of intelligences.',
  keywords: ['books', 'book series', 'The Cosmic Tapestry', 'sovereign field', 'consciousness', 'preorder'],
  openGraph: {
    title: 'Books | Stardust to Sovereignty',
    description: 'Explore the Stardust to Sovereignty book series. Book One: The Cosmic Tapestry.',
    type: 'website',
    url: 'https://stardusttosovereignty.com/books',
  },
  alternates: {
    canonical: 'https://stardusttosovereignty.com/books',
  },
}

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
