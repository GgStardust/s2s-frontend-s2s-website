import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/s2s'

export const metadata: Metadata = {
  title: 'S2S',
  description:
    'Stardust to Sovereignty — a dynamic paradigm of discovery across body, relationship, place, land, Earth, and larger scales of intelligence.',
  openGraph: {
    title: 'S2S · Stardust to Sovereignty',
    description:
      'A dynamic paradigm of discovery. Living Field, Future Human, and the thirteen Orbs.',
  },
}

export default function S2SPage() {
  return <PageMain />
}
