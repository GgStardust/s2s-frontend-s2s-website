'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://formspree.io/f/xgvgzgaj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          _subject: 'Newsletter Signup',
          _template: 'plain',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        setError('There was an error. Please try again.');
      }
    } catch (err) {
      setError('There was an error. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <p className="text-cyan-400 font-medium">Thank you! You're on the list.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-md text-cream placeholder-cyan-400/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
        aria-label="Email address for newsletter"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-md bg-cyan-500 text-cosmic-blue hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium whitespace-nowrap"
        aria-label="Subscribe to newsletter"
      >
        Join List
      </button>
      {error && <p className="text-red-400 text-sm mt-2" role="alert">{error}</p>}
      {!submitted && (
        <p className="text-xs text-cyan-300/60 mt-1 text-center sm:text-left">
          Get Console early access updates
        </p>
      )}
    </form>
  );
}
