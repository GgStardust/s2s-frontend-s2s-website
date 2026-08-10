import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/s2s'

export const metadata: Metadata = {
  title: 'S2S',
  description:
    'Stardust to Sovereignty is a body of work about consciousness, relationship, technology, creativity, and the future human.',
  openGraph: {
    title: 'S2S · Stardust to Sovereignty',
    description:
      'A body of work about being human in a rapidly changing world.',
  },
}

export default function S2SPage() {
  return <PageMain />
}
