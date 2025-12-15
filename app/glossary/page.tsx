import Link from 'next/link';
import Button from '@/components/ui/Button';
import { BUTTON_LABELS } from '@/lib/content';
import { glossaryTerms } from '@/lib/glossary';

export const metadata = {
  title: 'Glossary | Stardust to Sovereignty',
  description: 'Key terms and definitions from the Stardust to Sovereignty system.',
};

export default function GlossaryPage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-stone-100 tracking-tight">
            Glossary
          </h1>
          <h2 className="text-xl md:text-2xl font-light mb-6 text-stone-200">
            Key terms and definitions from the Stardust to Sovereignty system
          </h2>
          <p className="text-base text-stone-300 max-w-2xl mx-auto">
            These definitions are drawn directly from Book One. Each term names a precise structural element within the S2S architecture.
          </p>
        </div>
      </section>

      {/* Glossary Terms */}
      <section className="max-w-4xl mx-auto py-12 lg:py-16 px-6">
        <p className="text-sm text-stone-300 mb-8 text-center">
          Each definition describes function and structure directly, without metaphor or symbolic substitution.
        </p>
        <div className="space-y-6">
          {glossaryTerms.map((item) => (
            <div key={item.slug} id={item.slug} className="terminator-border scroll-mt-20">
              <div className="p-6 bg-cosmic-blue rounded-lg">
                <h3 className="text-xl lg:text-2xl font-semibold tracking-tight text-cyan-300 mb-3">
                  {item.term}
                </h3>
                <p className="text-base leading-relaxed text-stone-200">
                  {item.definition}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="text-center">
          <p className="text-base leading-relaxed text-stone-200 mb-6 max-w-2xl mx-auto">
            These terms are introduced throughout Book One. The book provides the structural context and depth in which each term operates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/preorder" variant="primary">
              {BUTTON_LABELS.preorder}
            </Button>
            <Button href="/about-the-book" variant="secondary">
              {BUTTON_LABELS.aboutBook}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
