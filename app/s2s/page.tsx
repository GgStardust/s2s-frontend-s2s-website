import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/s2s'

export const metadata: Metadata = {
  title: 'S2S',
  description:
    'Stardust to Sovereignty follows intelligence from lived encounter into relationship, systems, Earth, future human capacity, and larger scales of participation.',
  openGraph: {
    title: 'S2S · Stardust to Sovereignty',
    description:
      'An orientation into intelligence, coherence, and sovereign participation across scale.',
  },
}

export default function S2SPage() {
  return <PageMain />
}
