import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/orbs'

export const metadata: Metadata = {
  title: 'The 13 Orbs',
  description:
    'The thirteen Orbs form the core lens architecture of Stardust to Sovereignty. Change the lens. Change what becomes visible.',
  openGraph: {
    title: 'The 13 Orbs · Stardust to Sovereignty',
    description: 'Thirteen lenses through which reality can be perceived.',
  },
}

export default function OrbsPage() {
  return <PageMain />
}
