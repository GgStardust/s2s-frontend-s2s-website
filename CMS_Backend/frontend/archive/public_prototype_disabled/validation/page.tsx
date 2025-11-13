import ProofViewer from '@/components/prototype/ProofViewer';

export default function ValidationPage() {
  return (
    <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
      <h2 className="text-2xl font-bold text-creamy-white mb-4">CoC Validation Display</h2>
      <p className="text-creamy-white/60 text-sm mb-4">
        Consciousness of Coherence validation with mathematical proof steps
      </p>
      <ProofViewer />
    </div>
  );
}
