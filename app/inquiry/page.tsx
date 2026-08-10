import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/inquiry'

export const metadata: Metadata = {
  title: 'Inquiry',
  description:
    'Questions currently under pressure through Stardust to Sovereignty — participation, capacity, inheritance, and what draws us toward discovery.',
  openGraph: {
    title: 'Inquiry · Stardust to Sovereignty',
    description: 'Public points of entry into deeper architectural inquiries.',
  },
}

export default function InquiryPage() {
  return <PageMain />
}
