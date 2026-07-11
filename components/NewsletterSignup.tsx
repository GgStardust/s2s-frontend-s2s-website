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
          signup_source: 'website_newsletter',
          _subject: 'Newsletter signup (website)',
          _template: 'plain',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        setError('There was an error. Please try again.');
      }
    } catch {
      setError('There was an error. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <p className="text-stone-300 font-serif">Thank you. You are on the list.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className="flex-1 px-4 py-3 bg-cosmic-blue-light/20 border border-stone-500/30 rounded-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-stone-400/50 focus:ring-1 focus:ring-stone-400/30 font-sans text-sm"
          aria-label="Email address for newsletter"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-sm bg-stone-200 text-cosmic-blue hover:bg-stone-100 border border-stone-300/40 transition-colors font-medium whitespace-nowrap text-sm font-sans"
          aria-label="Subscribe to newsletter"
        >
          Join list
        </button>
      </div>
      {error && (
        <p className="text-red-400/90 text-sm font-sans" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
