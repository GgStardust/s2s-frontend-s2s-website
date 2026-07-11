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
    <div className="space-y-4 max-w-xl">
      <p className="text-sm text-stone-400 leading-relaxed">
        On the next screen, Stripe will ask for your email, phone (for the shipper), and shipping address. Your card is
        charged only once; shipping is included in the price shown.
      </p>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <Button type="button" variant="primary" className="w-full sm:w-auto" disabled={loading} onClick={startCheckout}>
        {loading ? 'Opening secure checkout…' : `Continue to checkout · $${priceUsd.toFixed(2)} USD`}
      </Button>
    </div>
  );
}
