import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      <div className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold mb-8 text-stone-100">Terms of Service</h1>
        
        <div className="space-y-6 text-base leading-relaxed text-stone-200">
          <p className="text-sm text-stone-300 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-stone-100">Preorders</h2>
            <p className="mb-4">
              By placing a preorder, you agree to purchase the book at the listed price. Preorders support the first printing of this self-published work.
            </p>
            <p className="mb-4">
              <strong className="text-cyan-300">Payment:</strong> Payment instructions (Zelle or Venmo) will be sent via email within 24-48 hours of your preorder. Payment is due within 7 days of receiving instructions.
            </p>
            <p className="mb-4">
              <strong className="text-cyan-300">Shipping:</strong> Print editions ship on February 28, 2026. Digital editions are delivered in mid-February 2026. Shipping is included in the price for U.S. orders. International orders may require customs fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-stone-100">Refund Policy</h2>
            <p className="mb-4">
              This is a limited first edition supporting self-publishing. <strong className="text-cyan-300">No refunds will be issued. All sales are final.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-stone-100">Intellectual Property</h2>
            <p className="mb-4">
              All content on this website and in the books is the intellectual property of Stardust to Sovereignty and is protected by copyright. You may not reproduce, distribute, or create derivative works without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-stone-100">Console Access</h2>
            <p className="mb-4">
              Console access will be announced via email to all preorder participants. We're targeting mid-February 2026, but timing may vary. Console access is included with your preorder at no additional cost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-stone-100">Contact</h2>
            <p>
              For questions about these terms, contact us at <a href="mailto:gigi@gigistardust.com" className="text-cyan-300 hover:text-cyan-200 underline">gigi@gigistardust.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-300/30">
          <Link href="/" className="text-cyan-300 hover:text-cyan-200 underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
