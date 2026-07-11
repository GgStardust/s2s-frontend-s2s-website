'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems: Array<{ href: string; label: string; prominent?: boolean; comingSoon?: boolean }> = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/books', label: 'Books' },
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
    <header className="w-full border-b border-cyan-500/30 bg-cosmic-blue/95 backdrop-blur-sm sticky top-0 z-50 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-3 min-h-[44px]">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="text-lg sm:text-xl md:text-2xl font-bold text-city-light hover:text-cyan-300 transition-colors leading-snug max-w-[65vw] truncate sm:max-w-none sm:overflow-visible sm:whitespace-normal touch-manipulation py-1"
            title="The Cosmic Tapestry · Book One · Stardust to Sovereignty"
          >
            Stardust to Sovereignty
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              if (item.comingSoon) {
                return (
                  <span
                    key={item.href}
                    className="text-base transition-colors relative text-cream/40 cursor-not-allowed"
                    title="Coming Soon"
                  >
                    {item.label}
                    <span className="absolute -top-1 -right-6 text-[10px] text-cyan-400/60 font-normal">
                      Soon
                    </span>
                  </span>
                );
              }
              return (
              <Link
                key={item.href}
                href={item.href}
                  className={`text-base transition-colors relative touch-manipulation ${
                    item.prominent
                      ? isActive(item.href)
                        ? 'text-cyan-400 font-bold'
                        : 'text-cyan-300 font-semibold hover:text-cyan-200'
                      : isActive(item.href)
                      ? 'text-cyan-400 font-semibold'
                      : 'text-[#F8F9FA]/80 hover:text-cyan-300'
                }`}
              >
                {item.label}
              </Link>
              );
            })}
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
              {navItems.map((item) => {
                if (item.comingSoon) {
                  return (
                    <span
                      key={item.href}
                      className="text-base transition-colors relative text-cream/40 cursor-not-allowed"
                      title="Coming Soon"
                    >
                      {item.label}
                      <span className="ml-2 text-xs text-cyan-400/60 font-normal">
                        (Coming Soon)
                      </span>
                    </span>
                  );
                }
                return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                    className={`block py-3 text-base transition-colors relative touch-manipulation ${
                      item.prominent
                        ? isActive(item.href)
                          ? 'text-cyan-400 font-bold'
                          : 'text-cyan-300 font-semibold hover:text-cyan-200'
                        : isActive(item.href)
                        ? 'text-cyan-400 font-semibold'
                        : 'text-city-light/80 hover:text-cyan-300'
                  }`}
                >
                  {item.label}
                </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
