'use client';

import { useState, useEffect } from 'react';

export default function PreorderCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-02-28T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 md:gap-6">
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">{timeLeft.days}</div>
        <div className="text-xs text-cyan-400/70">Days</div>
      </div>
      <div className="text-cyan-400/50">:</div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-xs text-cyan-400/70">Hours</div>
      </div>
      <div className="text-cyan-400/50">:</div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-xs text-cyan-400/70">Minutes</div>
      </div>
      <div className="text-cyan-400/50">:</div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-xs text-cyan-400/70">Seconds</div>
      </div>
    </div>
  );
}
