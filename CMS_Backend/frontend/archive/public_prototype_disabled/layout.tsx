export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-creamy-white">S2S Consciousness Technology Prototype</h1>
          <p className="text-creamy-white/60 text-sm mt-2">
            Mathematical consciousness verification and resonance visualization
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
