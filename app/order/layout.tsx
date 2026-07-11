import type { Metadata } from 'next';
import { BOOK_CATALOG } from '@/lib/publishingMetadata';
import { AUTHORS_EDITION_LABEL } from '@/lib/orderCopy';

export const metadata: Metadata = {
  title: `Order · ${BOOK_CATALOG.title}`,
  description: `Order The Cosmic Tapestry (${AUTHORS_EDITION_LABEL}). Paperback with standard shipping included.`,
  openGraph: {
    title: `Order · ${BOOK_CATALOG.title}`,
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
