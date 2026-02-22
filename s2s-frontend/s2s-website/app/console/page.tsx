import NewsletterSignup from '@/components/NewsletterSignup';

export default function ConsolePage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <section className="py-20 px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-stone-100 tracking-tight">
              The Console
            </h1>
            <h2 className="text-xl md:text-2xl font-light mb-8 text-stone-200 italic">
              Real-time coherence system. Coming Summer 2026.
            </h2>
            <p className="text-base leading-relaxed text-stone-200 max-w-2xl mx-auto mb-10">
              The Console functions as a real-time application layer. The design of Book One becomes immediately accessible. It reads your current orientation through the Sovereign Field Inquiry and reveals how your system is perceiving, organizing, and moving right now. Pathways and practices emerge from there.
            </p>
            <div className="terminator-border max-w-md mx-auto">
              <div className="p-6 bg-cosmic-blue rounded-lg">
                <p className="text-base text-stone-200 mb-4">
                  Get notified when the Console launches:
                </p>
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
