import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/s2s'

export const metadata: Metadata = {
  title: 'S2S',
  description:
    'Stardust to Sovereignty maps intelligence and sovereign participation across body, relationship, place, land, society, civilization, Earth, galaxy, universe, future human, and unknown intelligence.',
  openGraph: {
    title: 'S2S · Stardust to Sovereignty',
    description:
      'A paradigm for intelligence and sovereign participation across scale.',
  },
}

export default function S2SPage() {
  return <PageMain />
}
