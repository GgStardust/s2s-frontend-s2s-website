import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/orbs'

export const metadata: Metadata = {
  title: 'The 13 Orbs',
  description:
    'The thirteen Orbs of Stardust to Sovereignty name capacities already active in human experience and give the wider field structural resolution.',
  openGraph: {
    title: 'The 13 Orbs · Stardust to Sovereignty',
    description: 'Thirteen functions within one S2S architecture.',
  },
}

export default function OrbsPage() {
  return <PageMain />
}
