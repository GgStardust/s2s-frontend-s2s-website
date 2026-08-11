import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/gigi'

export const metadata: Metadata = {
  title: 'Gigi Stardust',
  description:
    'Gigi Stardust is the author and creator of Stardust to Sovereignty. Her work moves from lived observation through inquiry, resonance, and larger pattern.',
  openGraph: {
    title: 'Gigi Stardust',
    description:
      'Author and creator of Stardust to Sovereignty. Observation, inquiry, resonance, and larger pattern.',
  },
}

export default function GigiPage() {
  return <PageMain />
}
