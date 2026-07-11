'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

type Props = {
  priceUsd: number;
};

export default function StripeCheckoutButton({ priceUsd }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startCheckout() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Something went wrong.');
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError('Payment could not be started. Please try again.');
    } catch {
      setError('Payment could not be started. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-400/90 font-sans" role="alert">
          {error}
        </p>
      )}
      <Button type="button" variant="primary" className="w-full sm:w-auto px-8" disabled={loading} onClick={startCheckout}>
        {loading ? 'Opening checkout…' : `Checkout · $${priceUsd.toFixed(2)} USD`}
      </Button>
    </div>
  );
}
