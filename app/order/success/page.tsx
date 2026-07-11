import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getStripe } from '@/lib/stripe-server';
import { ORDER_SUCCESS_PAID } from '@/lib/orderCopy';
import { BOOK_CATALOG } from '@/lib/publishingMetadata';

export const metadata: Metadata = {
  title: `Thank you · ${BOOK_CATALOG.title}`,
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string | string[] };
}) {
  const raw = searchParams.session_id;
  const sessionId = typeof raw === 'string' ? raw : null;
  if (!sessionId) {
    redirect('/order/direct');
  }

  let paid = false;
  let emailHint: string | null = null;
  let ref: string | null = null;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer_details', 'shipping_details'],
    });
    paid = session.payment_status === 'paid';
    emailHint = session.customer_details?.email ?? session.customer_email ?? null;
    ref = session.id.replace(/^cs_/, '').slice(0, 12).toUpperCase();
  } catch {
    redirect('/order/direct');
  }

  return (
    <main className="min-h-screen bg-book-vessel">
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-4 font-sans">Author&apos;s Edition</p>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-100 font-serif mb-2">{BOOK_CATALOG.title}</h1>
        <p className="text-lg text-stone-400 font-serif mb-8">Thank you</p>

        {paid ? (
          <>
            <p className="text-base text-stone-300 leading-relaxed mb-6 font-serif">{ORDER_SUCCESS_PAID}</p>
            {ref && (
              <p className="text-sm text-stone-500 mb-4 font-sans">
                Reference <span className="font-mono text-stone-400">{ref}</span>
              </p>
            )}
            {emailHint && (
              <p className="text-sm text-stone-500 mb-8 font-sans">
                Confirmation sent to <span className="text-stone-400">{emailHint}</span>
              </p>
            )}
          </>
        ) : (
          <p className="text-base text-stone-400 mb-10 font-serif">
            Payment is still processing. If you completed checkout, check your email for confirmation.
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-sans">
          <Link href="/books" className="text-stone-500 hover:text-stone-300 underline underline-offset-4">
            Read an excerpt
          </Link>
          <Link href="/" className="text-stone-500 hover:text-stone-300 underline underline-offset-4">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
