import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/orbs'

export const metadata: Metadata = {
  title: 'The 13 Orbs',
  description:
    'The thirteen Orbs of Stardust to Sovereignty are primary intelligences and structural principles within Book One and the larger S2S field.',
  openGraph: {
    title: 'The 13 Orbs · Stardust to Sovereignty',
    description: 'Thirteen primary Orbs within S2S.',
  },
}

export default function OrbsPage() {
  return <PageMain />
}
