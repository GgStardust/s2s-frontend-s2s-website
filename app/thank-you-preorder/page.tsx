'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const PRICING = {
  print: 44,
  digital: 22,
  bundle: 55,
};

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderType = searchParams.get('order') || 'print';
  const amount = PRICING[orderType as keyof typeof PRICING] || PRICING.print;

  return (
    <main className="min-h-screen bg-structural-grid">
      <section className="max-w-4xl mx-auto py-20 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-semibold mb-6 tracking-tight text-stone-100">
            Thank you for your preorder.
          </h1>
        </div>

        <div className="space-y-8 text-base leading-relaxed text-stone-200 mb-12">
          <p>
            Your support means a great deal to me. This is the first print run of a project I have been building for years, and your preorder helps bring it forward into the world.
          </p>
          
          <p>
            To complete your preorder, please submit your payment below. Once payment is received, your copy is fully confirmed.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-8">
            Payment Options
          </h2>

          <div className="space-y-8">
            {/* Zelle Payment */}
            <div className="terminator-border">
              <div className="p-6 bg-cosmic-blue rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-cyan-300">Zelle</h3>
                <div className="space-y-2 text-stone-200">
                  <p><strong className="text-cyan-300">Send to:</strong> Jen Dye</p>
                  <p><strong className="text-cyan-300">Phone #:</strong> 415-999-9109</p>
                  <p><strong className="text-cyan-300">Amount:</strong> ${amount}</p>
                  <p><strong className="text-cyan-300">Memo:</strong> Your preorder email</p>
                </div>
              </div>
            </div>

            {/* Venmo Payment */}
            <div className="terminator-border">
              <div className="p-6 bg-cosmic-blue rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-cyan-300">Venmo Gigi Dye</h3>
                <div className="space-y-2 text-stone-200">
                  <p><strong className="text-cyan-300">Send to:</strong> @Jen-Dye-1</p>
                  <p><strong className="text-cyan-300">Amount:</strong> ${amount}</p>
                  <p><strong className="text-cyan-300">Memo:</strong> Your preorder email</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-6">
            After Payment
          </h2>
          <p className="text-base leading-relaxed text-stone-200">
            You'll receive a confirmation email once your payment is matched to your preorder.
          </p>
        </div>

        <div className="mb-12 space-y-6 text-base leading-relaxed text-stone-200">
          <p>
            Thank you again for supporting the first edition of Stardust to Sovereignty.
          </p>
          <p>
            This book has taken years of work, refinement, and care, and I'm grateful you're here at the beginning.
          </p>
        </div>

        <div className="border-t border-stone-600/30 pt-8 text-center">
          <p className="text-sm text-stone-400 mb-6">
            For any questions, contact: <a href="mailto:stardusttosovereignty@gmail.com" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">stardusttosovereignty@gmail.com</a>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/" variant="tertiary">
              Return to Home
            </Button>
            <Button href="/books" variant="secondary">
              Learn More About Book One
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ThankYouPreorderPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-structural-grid">
        <section className="max-w-4xl mx-auto py-20 px-6 text-center">
          <p className="text-stone-200">Loading...</p>
        </section>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
