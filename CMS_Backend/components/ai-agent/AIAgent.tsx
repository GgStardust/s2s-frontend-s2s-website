'use client';

import { useState } from 'react';

interface AIAgentProps {
  onQuery: (query: string) => void;
}

export default function AIAgent({ onQuery }: AIAgentProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    
    // TODO: Implement actual AI querying with Codex content
    // For now, simulate AI response
    setTimeout(() => {
      onQuery(query);
      setQuery('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4 text-gradient">AI Content Processor</h3>
        <p className="text-creamy-white/80 text-lg">
          Process raw content, suggest Orb tags, extract scrollstream, and structure Codex entries
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Paste raw content here for processing, Orb tagging, and Codex structuring..."
            className="input-cosmic resize-none"
            rows={4}
          />
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Process Content'}
          </button>
        </div>
      </form>

      {/* AI Response Area */}
      <div className="bg-gradient-to-r from-deep-gold/10 to-cosmic-blue/10 rounded-xl p-6 border border-deep-gold/30">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-deep-gold rounded-full flex items-center justify-center text-deep-navy font-bold text-sm mr-3 orb-glow">
            AI
          </div>
          <h4 className="font-semibold text-deep-gold text-lg">AI Response:</h4>
        </div>
        <p className="text-creamy-white/80">
          {query ? 'Processing your content...' : 'Paste raw content above to get AI processing assistance.'}
        </p>
      </div>
    </div>
  );
}
