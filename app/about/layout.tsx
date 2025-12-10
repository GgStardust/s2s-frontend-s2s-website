import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Stardust to Sovereignty',
  description: 'Learn about Stardust to Sovereignty, a living architecture for coherence, perception, and sovereign identity. Discover the system, the author, and the vision.',
  keywords: ['about', 'author', 'Gigi Stardust', 'consciousness technology', 'sovereignty', 'coherence system'],
  openGraph: {
    title: 'About | Stardust to Sovereignty',
    description: 'Learn about Stardust to Sovereignty, a living architecture for coherence, perception, and sovereign identity.',
    type: 'website',
    url: 'https://stardusttosovereignty.com/about',
  },
  alternates: {
    canonical: 'https://stardusttosovereignty.com/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
