import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getStripe } from '@/lib/stripe-server';
import { BOOK_CATALOG } from '@/lib/publishingMetadata';

export const metadata: Metadata = {
  title: 'Thank you',
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
    emailHint =
      session.customer_details?.email ?? session.customer_email ?? null;
    ref = session.id.replace(/^cs_/, '').slice(0, 12).toUpperCase();
  } catch {
    redirect('/order/direct');
  }

  return (
    <main className="min-h-screen bg-structural-grid relative">
      <div className="relative z-10 max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-100 mb-4">Thank you</h1>
        {paid ? (
          <>
            <p className="text-stone-300 leading-relaxed mb-6">
              Your payment for <em className="text-cyan-200 not-italic">{BOOK_CATALOG.title}</em> went through.
              {ref && (
                <>
                  {' '}
                  Reference: <span className="font-mono text-cyan-300">{ref}</span>
                </>
              )}
            </p>
            {emailHint && (
              <p className="text-sm text-stone-500 mb-6">
                Confirmation is sent to <span className="text-stone-400">{emailHint}</span> (and appears in your Stripe
                receipt).
              </p>
            )}
            <p className="text-sm text-stone-500 mb-10">
              The author prepares each paperback; you will be contacted if anything is needed before shipment.
            </p>
          </>
        ) : (
          <p className="text-stone-400 mb-10">
            Payment is still processing for this session. If you completed payment, check your email for a Stripe
            receipt or return to the order page to try again.
          </p>
        )}
        <Link href="/books" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4 text-sm">
          Read excerpts
        </Link>
        <span className="text-stone-600 mx-2">·</span>
        <Link href="/" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4 text-sm">
          Home
        </Link>
      </div>
    </main>
  );
}
