import type { Metadata } from 'next'
import PageMain from '@/components/site/pages/home'

export const metadata: Metadata = {
  title: 'Previous homepage',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PreviousHomePage() {
  return <PageMain />
}
