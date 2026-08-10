import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/gigi'

export const metadata: Metadata = {
  title: 'Gigi Stardust',
  description:
    'Gigi Stardust — author and creator of Stardust to Sovereignty. Biography and contact.',
  openGraph: {
    title: 'Gigi Stardust',
    description: 'Author and creator of Stardust to Sovereignty.',
  },
}

export default function GigiPage() {
  return <PageMain />
}
