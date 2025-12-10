import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      <div className="max-w-6xl mx-auto py-20 px-6">
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
            <p className="mb-4">
              <strong className="text-cyan-300">Trademarks and Service Marks:</strong> Stardust to Sovereignty, S2S, Resonance-Based Intelligence, RBI, The Console, The S2S Interface, The Codex, The Cosmic Tapestry, and related marks are trademarks and service marks of Stardust to Sovereignty. Unauthorized use is prohibited.
            </p>
            <p className="mb-4">
              <strong className="text-cyan-300">Patent Protection:</strong> The Resonance-Based Intelligence (RBI) computational framework, Proof-of-Meaning verification methods, field-level coherence computation, temporal continuity validation, 4D Resonance Vector mathematics, and coherence-based similarity algorithms are covered by U.S. Provisional Patent Application No. 63/909,031. Patent pending.
            </p>
            <p className="mb-4">
              <strong className="text-cyan-300">RBI Technology:</strong> All RBI code, methods, algorithms, and mathematical foundations are protected by patent application and copyright. Use of RBI technology requires appropriate licensing.
            </p>
            <p className="mb-4">
              <strong className="text-cyan-300">Book Titles and Series:</strong> Book titles, series names, and related intellectual property are protected. The Stardust to Sovereignty book series, including "The Cosmic Tapestry," "The Architecture of Civilization," and "The Resonant Species," are protected works.
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
              For questions about these terms, contact us at <a href="mailto:gigi@stardusttosovereignty.com" className="text-cyan-300 hover:text-cyan-200 underline">gigi@stardusttosovereignty.com</a>.
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
