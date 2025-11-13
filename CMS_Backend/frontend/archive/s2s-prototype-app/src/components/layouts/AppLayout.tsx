'use client';

import React from 'react';
import NavigationFramework from '@/components/NavigationFramework';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              <p className="text-sm text-gray-400">{subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                S2S
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <NavigationFramework />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/30 backdrop-blur-sm border-t border-gray-700/50 mt-16">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center text-sm text-gray-400">
            <p>Stardust to Sovereignty Consciousness Technology Prototype</p>
            <p className="mt-1">Mathematical Framework for Consciousness Verification</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
