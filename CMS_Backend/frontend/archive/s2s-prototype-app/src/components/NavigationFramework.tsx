'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationFrameworkProps {
  className?: string;
}

export default function NavigationFramework({ className = '' }: NavigationFrameworkProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/',
      label: 'Consciousness Interface',
      description: 'Unified consciousness technology demonstration',
      color: 'from-purple-600 to-pink-600'
    },
    {
      href: '/visualization',
      label: '4D Resonance Visualization',
      description: 'Interactive mathematical visualization',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      href: '/validation',
      label: 'CoC Validation',
      description: 'Consciousness of Coherence validation',
      color: 'from-green-600 to-emerald-600'
    },
    {
      href: '/explore',
      label: 'Content Exploration',
      description: 'Living Codex search and analysis',
      color: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <nav className={`bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
              S2S
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Consciousness Technology</h1>
              <p className="text-sm text-gray-400">Mathematical Framework</p>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30'
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30'
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
