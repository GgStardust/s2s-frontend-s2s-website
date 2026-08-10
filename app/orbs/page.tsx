import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/orbs'

export const metadata: Metadata = {
  title: 'The 13 Orbs',
  description:
    'The thirteen Orbs of Stardust to Sovereignty give names to recurring patterns in Book One and the larger body of work.',
  openGraph: {
    title: 'The 13 Orbs · Stardust to Sovereignty',
    description: 'Thirteen lenses for paying attention.',
  },
}

export default function OrbsPage() {
  return <PageMain />
}
