import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/orbs'

export const metadata: Metadata = {
  title: 'The 13 Orbs',
  description:
    'The thirteen Orbs of Stardust to Sovereignty: lenses for origin, resonance, pattern, time, memory, transformation, sovereignty, and bridging intelligence.',
  openGraph: {
    title: 'The 13 Orbs · Stardust to Sovereignty',
    description: 'Thirteen lenses through which reality can be perceived.',
  },
}

export default function OrbsPage() {
  return <PageMain />
}
