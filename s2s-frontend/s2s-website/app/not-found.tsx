import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-structural-grid flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-stone-100">404</h1>
        <h2 className="text-2xl md:text-3xl font-light mb-8 text-stone-200 italic">
          The page you're looking for has moved or is unavailable.
        </h2>
        
        <div className="terminator-border max-w-lg mx-auto mb-8">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <p className="text-base leading-relaxed text-stone-200 italic mb-4">
              "The first change begins as a quiet stirring along the ground. It moves like a slow breath, loosening something within you before you notice what has begun."
            </p>
            <p className="text-sm text-cyan-300/80">Interlude II: The Valley of Shifting Names</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/" variant="primary">
            Return Home
          </Button>
          <Button href="/books" variant="secondary">
            Inside Book One
          </Button>
        </div>
      </div>
    </main>
  );
}
