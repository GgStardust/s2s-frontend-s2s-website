import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/inquiry'

export const metadata: Metadata = {
  title: 'Inquiry',
  description:
    'Questions currently under pressure through Stardust to Sovereignty: participation, human capacity, repeated choices, attention, place, and generative attraction.',
  openGraph: {
    title: 'Inquiry · Stardust to Sovereignty',
    description: 'Public points of entry into active S2S inquiries.',
  },
}

export default function InquiryPage() {
  return <PageMain />
}
