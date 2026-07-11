import type { Metadata } from 'next';
import { BOOK_CATALOG } from '@/lib/publishingMetadata';

export const metadata: Metadata = {
  title: 'Where to buy',
  description: `${BOOK_CATALOG.title} (${BOOK_CATALOG.volumeLabel}). ${BOOK_CATALOG.metaDescription}`,
  openGraph: {
    title: `Where to buy | ${BOOK_CATALOG.title}`,
    description: BOOK_CATALOG.catalogDescriptionShort,
    url: 'https://stardusttosovereignty.com/order',
  },
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
