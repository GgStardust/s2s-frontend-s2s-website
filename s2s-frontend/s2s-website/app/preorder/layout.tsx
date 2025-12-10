import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preorder Book One | Stardust to Sovereignty',
  description: 'Preorder Book One: The Cosmic Tapestry. Ships February 28, 2026. Choose from Print ($44), Digital ($22), or Bundle ($55).',
  keywords: ['preorder', 'book preorder', 'The Cosmic Tapestry', 'Stardust to Sovereignty', 'book one'],
  openGraph: {
    title: 'Preorder Book One: The Cosmic Tapestry | Stardust to Sovereignty',
    description: 'Preorder Book One: The Cosmic Tapestry. Ships February 28, 2026.',
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
