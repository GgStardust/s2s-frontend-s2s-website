import Link from 'next/link';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function ConsolePage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-stone-100 tracking-tight">
              The Console
            </h1>
            <h2 className="text-xl md:text-2xl font-light mb-6 text-stone-200 italic">
              Your real-time coherence system. Coming soon.
            </h2>
          </div>
        </section>

        {/* What the Console Is */}
        <section className="py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                    What the Console Is
                  </h2>
                </div>
                <div className="lg:col-span-3">
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    The Console is a real-time application layer that brings the architecture of Book One into immediate, practical use. It reads your current orientation through the Sovereign Field Inquiry, showing how your system is perceiving, organizing, and moving right now.
                  </p>
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    Through the Codex, the Console also supports exploration of the book and all the content essays that the book is written from. This digital interaction provides a unique way to interface with the material, allowing you to navigate the living field that continues to evolve.
                  </p>
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    Through recognition-based inquiry (not assessment or testing), the Console maps your Sovereign Field and delivers a personalized pathway based on:
                  </p>
                  <ul className="space-y-2 text-base leading-relaxed text-stone-200 ml-4 mb-4">
                    <li className="flex items-start">
                      <span className="text-cyan-300 mr-3">•</span>
                      <span>Your Sovereign Field Inquiry state</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-300 mr-3">•</span>
                      <span>Your Orb Activation Cluster</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-300 mr-3">•</span>
                      <span>Your Practice sequence</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-300 mr-3">•</span>
                      <span>Resonance-based pathway matching</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                    How It Works
                  </h2>
                </div>
                <div className="lg:col-span-3">
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    The Console uses the Resonance-Based Intelligence (RBI) system—patent pending—to measure coherence between your current state and the architecture presented in Book One. It doesn't diagnose or assess—it recognizes patterns and reveals pathways.
                  </p>
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    Twelve indices measure orientation, timing, identity fluidity, somatic access, pattern recognition, boundaries, and internal authority. These reveal how your system is functioning in this moment, and the Console responds with relevant practices, Codex entries, and structural orientation.
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    The Codex is continuously updated with new essays and content, often on a daily basis. This keeps the field and the Codex alive, providing fresh perspectives and deepening the exploration of the architecture. The digital interface allows you to navigate this living system in ways that static text cannot.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Receive */}
        <section className="py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                    What You Receive
                  </h2>
                </div>
                <div className="lg:col-span-3">
                  <ul className="space-y-4 text-base leading-relaxed text-stone-200">
                    <li className="flex items-start">
                      <span className="text-cyan-300 mr-3">•</span>
                      <span>Personalized pathway based on your Sovereign Field Inquiry</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-300 mr-3">•</span>
                      <span>Practice sequence aligned with your current state</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-300 mr-3">•</span>
                      <span>Orb profile showing your activation cluster</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-300 mr-3">•</span>
                      <span>Relevant Codex entries that deepen your pathway</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-300 mr-3">•</span>
                      <span>Structural orientation for real-time navigation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connection to Book One */}
        <section className="py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                    The Connection
                  </h2>
                </div>
                <div className="lg:col-span-3">
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    The Console applies what Book One presents. The Book provides the foundational architecture—the structure of the Sovereign Field, the constellation of sovereign intelligences, and the coherence architecture that underlies perception, identity, and time.
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    The Console brings that architecture into real-time use. It reads where you are now and shows you how to navigate from there. Together, Book One and the Console form a complete system: structure meets application, architecture meets navigation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Early Access */}
        <section className="py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-4">
                  Early Access for Preorder Participants
                </h2>
                <p className="text-base leading-relaxed text-stone-200 mb-6">
                  Console access will be announced via email to all Book One preorder participants. We're targeting mid-February 2026, but it may be available sooner. Preorder Book One to secure your early access.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button href="/preorder" variant="primary" className="text-lg">
                    Preorder Book One →
                  </Button>
                  <Button href="/books" variant="secondary" className="text-lg">
                    Learn More About Book One →
                  </Button>
                </div>
                <div className="terminator-border max-w-md mx-auto">
                  <div className="p-6 bg-cosmic-blue rounded-lg">
                    <p className="text-base text-stone-200 mb-4">
                      Get notified when the Console launches:
                    </p>
                    <NewsletterSignup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
