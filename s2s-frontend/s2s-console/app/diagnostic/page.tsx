'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConsoleLayout from '@/components/ConsoleLayout';
// Note: Diagnostic page is the entry point, so it doesn't require access protection

const CMS_BACKEND_URL = process.env.NEXT_PUBLIC_CMS_BACKEND_URL || 'http://localhost:4000';

export default function DiagnosticIntro() {
  const [email, setEmail] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const requestBody: any = {};
      if (email.trim()) {
        requestBody.email = email.trim();
      }

      const response = await fetch(`${CMS_BACKEND_URL}/api/console/v3/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start diagnostic');
      }

      const data = await response.json();
      
      // Store session ID in localStorage
      localStorage.setItem('diagnostic_session_id', data.session_id);
      localStorage.setItem('diagnostic_questions', JSON.stringify(data.questions));
      if (email.trim()) {
        localStorage.setItem('diagnostic_email', email.trim());
      }

      // Navigate to first question
      router.push(`/diagnostic/question/0`);
    } catch (error: any) {
      console.error('Error starting diagnostic:', error);
      alert(error.message || 'Failed to start diagnostic. Please try again.');
      setIsStarting(false);
    }
  };

  return (
    <ConsoleLayout>
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-editorial-text">
          The Sovereignty Console
        </h1>
        <p className="text-xl md:text-2xl text-editorial-text/80 mb-8 italic font-serif">
          A real-time navigation interface
        </p>

        <div className="bg-gray-50 border-l-4 border-editorial-gold p-6 md:p-8 rounded-r-lg mb-8 text-left">
          <p className="text-lg md:text-xl text-editorial-text/90 leading-relaxed mb-4">
            This console reads the organization of your Sovereign Field—how your perception, timing, identity, and internal authority are arranging themselves in this moment. It does not measure performance or advancement. It reflects the architecture already moving through you.
          </p>
          <p className="text-lg md:text-xl text-editorial-text/90 leading-relaxed mb-4">
            The Orbs form the structural map of this architecture. Your responses reveal which architectural principles are most active, which are stabilizing, and which want more coherence. The diagnostic translates these signals into an Orb Activation Map.
          </p>
          <p className="text-lg md:text-xl text-editorial-text/90 leading-relaxed">
            The console begins with a simple real-time assessment: twelve panels that show how your system is perceiving, processing, deciding, and relating in this moment. This generates a field signature called SFI—your current coherence pattern.
          </p>
        </div>

        <div className="bg-gray-50 border-l-4 border-editorial-gold p-6 md:p-8 rounded-r-lg mb-8 text-left">
          <p className="text-lg md:text-xl text-editorial-text/90 leading-relaxed mb-4">
            From here, the system maps your signature onto the Orbs—the foundational principles of Sovereignty—and builds a Practice Pathway that meets your exact orientation. Each pathway includes Codex entries, readings, and field practices matched to your state.
          </p>
          <p className="text-lg md:text-xl text-editorial-text/90 leading-relaxed mb-4">
            From here, the system builds a Practice Pathway—a sequence of lived modules that support your next layer of clarity, coherence, and orientation. These practices are ways of inhabiting reality, not tasks. They meet you exactly where your system is.
          </p>
          <p className="text-lg md:text-xl text-editorial-text/90 leading-relaxed">
            The twelve practices form a unified system across three layers: Foundational (1-4), Functional (5-8), and Advanced (9-12). Your diagnostic results determine which practices are most aligned with your current field configuration.
          </p>
        </div>

        <div className="bg-gray-50 border-l-4 border-editorial-gold p-6 md:p-8 rounded-r-lg mb-8 text-left">
          <p className="text-lg md:text-xl text-editorial-text/90 leading-relaxed italic">
            If this language feels familiar, you are already inside the threshold. Recognition is the entry point.
          </p>
        </div>

        {/* Email Input (Optional) */}
        <div className="max-w-md mx-auto mb-8">
          <label htmlFor="email" className="block text-sm font-medium text-editorial-text/70 mb-2 text-left">
            Email <span className="text-editorial-text/50 font-normal">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            placeholder="your@email.com (optional)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-editorial-gold focus:border-editorial-gold outline-none text-editorial-text"
            disabled={isStarting}
          />
          <p className="text-sm text-editorial-text/50 mt-2 text-left">
            Providing your email allows you to save your pathway and return to it later.
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={isStarting}
          className="px-8 py-4 bg-editorial-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-lg min-w-[200px]"
        >
          {isStarting ? 'Starting...' : 'Begin Diagnostic'}
        </button>
      </div>
    </ConsoleLayout>
  );
}

