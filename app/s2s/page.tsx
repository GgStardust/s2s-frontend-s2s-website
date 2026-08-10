import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/s2s'

export const metadata: Metadata = {
  title: 'S2S',
  description:
    'Stardust to Sovereignty maps intelligence and sovereign participation across embodied, relational, planetary, cosmic, and future-human scales.',
  openGraph: {
    title: 'S2S · Stardust to Sovereignty',
    description:
      'A paradigm for intelligence and sovereign participation across scale.',
  },
}

export default function S2SPage() {
  return <PageMain />
}
