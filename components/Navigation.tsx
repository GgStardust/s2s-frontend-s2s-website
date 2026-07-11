'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BOOK_SERIES_CONTEXT } from '@/lib/homepageCopy';

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems: Array<{ href: string; label: string; prominent?: boolean }> = [
    { href: '/books', label: 'Read' },
    { href: '/about', label: 'About' },
    { href: '/order', label: 'Order', prominent: true },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href === '/order') {
      return pathname === '/order' || pathname?.startsWith('/order/') || false;
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="w-full border-b border-stone-400/20 bg-cosmic-blue/95 backdrop-blur-sm sticky top-0 z-50 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-3 min-h-[44px]">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="group touch-manipulation py-1 leading-snug max-w-[65vw] sm:max-w-none"
            title={BOOK_SERIES_CONTEXT}
          >
            <span className="block text-lg sm:text-xl md:text-2xl font-bold text-stone-100 group-hover:text-stone-50 font-serif truncate sm:overflow-visible sm:whitespace-normal">
              The Cosmic Tapestry
            </span>
            <span className="hidden sm:block text-[11px] uppercase tracking-[0.18em] text-stone-500 font-sans mt-0.5">
              Book One · Stardust to Sovereignty
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                  className={`text-base transition-colors relative touch-manipulation font-sans ${
                    item.prominent
                      ? isActive(item.href)
                        ? 'text-stone-100 font-semibold'
                        : 'text-stone-200 font-medium hover:text-stone-50'
                      : isActive(item.href)
                        ? 'text-stone-100 font-medium'
                        : 'text-stone-400 hover:text-stone-200'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-cream hover:text-cyan-300 hover:bg-white/5 transition-colors touch-manipulation"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-cyan-500/20 pt-4">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                    className={`block py-3 text-base transition-colors relative touch-manipulation font-sans ${
                      item.prominent
                        ? isActive(item.href)
                          ? 'text-stone-100 font-semibold'
                          : 'text-stone-200 font-medium hover:text-stone-50'
                        : isActive(item.href)
                          ? 'text-stone-100 font-medium'
                          : 'text-stone-400 hover:text-stone-200'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
