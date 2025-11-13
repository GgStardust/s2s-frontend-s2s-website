'use client';

import { useState } from 'react';
import { getAllOrbs } from '@/lib/content';
import { Orb } from '@/lib/types';

interface LivingFieldMapProps {
  onOrbSelect?: (orb: Orb) => void;
}

export default function LivingFieldMap({ onOrbSelect }: LivingFieldMapProps) {
  const [hoveredOrb, setHoveredOrb] = useState<number | null>(null);
  const [selectedOrb, setSelectedOrb] = useState<Orb | null>(null);
  const orbs = getAllOrbs();

  // Orb positioning in constellation formation - more balanced layout
  const orbPositions = [
    { id: 1, x: 15, y: 25 },   // Origin Intelligence
    { id: 2, x: 35, y: 15 },   // Resonance Mechanics
    { id: 3, x: 55, y: 25 },   // Photonic Intelligence
    { id: 4, x: 75, y: 15 },   // Harmonic Architectures
    { id: 5, x: 15, y: 45 },   // Temporal Sovereignty
    { id: 6, x: 35, y: 55 },   // Starline Memory
    { id: 7, x: 55, y: 45 },   // Alchemical Current
    { id: 8, x: 75, y: 55 },   // Quantum Intuition
    { id: 9, x: 25, y: 75 },   // Temporal Fluidity
    { id: 10, x: 45, y: 85 },  // Ancestral Repatterning
    { id: 11, x: 65, y: 75 },  // Radiant Transparency
    { id: 12, x: 45, y: 45 },  // Sovereign Field (center)
    { id: 13, x: 45, y: 5 }    // Bridging Intelligence (top center)
  ];

  const handleOrbHover = (orbId: number) => {
    setHoveredOrb(orbId);
  };

  const handleOrbClick = (orb: Orb) => {
    setSelectedOrb(orb);
    if (onOrbSelect) {
      onOrbSelect(orb);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-deep-navy via-deep-navy/95 to-deep-navy/90 overflow-hidden">
      {/* Constellation Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="constellation-grid"></div>
      </div>

      {/* Axis Lines - Connect mirror pairs */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="axisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(196, 154, 108, 0.3)" />
            <stop offset="50%" stopColor="rgba(196, 154, 108, 0.1)" />
            <stop offset="100%" stopColor="rgba(196, 154, 108, 0.3)" />
          </linearGradient>
        </defs>
        {orbs.map((orb) => {
          const position = orbPositions.find(p => p.id === orb.id);
          if (!position) return null;
          
          // Find mirror pair (1↔12, 2↔11, etc.)
          const mirrorId = 14 - orb.id;
          const mirrorPosition = orbPositions.find(p => p.id === mirrorId);
          
          if (mirrorPosition) {
            return (
              <line
                key={`axis-${orb.id}`}
                x1={`${position.x}%`}
                y1={`${position.y}%`}
                x2={`${mirrorPosition.x}%`}
                y2={`${mirrorPosition.y}%`}
                stroke="url(#axisGradient)"
                strokeWidth="2"
                className="opacity-30 hover:opacity-60 transition-opacity duration-300"
              />
            );
          }
          return null;
        })}
      </svg>

      {/* Orb Nodes */}
      {orbs.map((orb) => {
        const position = orbPositions.find(p => p.id === orb.id);
        if (!position) return null;

        const isHovered = hoveredOrb === orb.id;
        const isSelected = selectedOrb?.id === orb.id;

        return (
          <div
            key={orb.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
            onMouseEnter={() => handleOrbHover(orb.id)}
            onMouseLeave={() => setHoveredOrb(null)}
            onClick={() => handleOrbClick(orb)}
          >
            {/* Orb Circle */}
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center
              transition-all duration-500 transform
              ${isHovered ? 'scale-125' : 'scale-100'}
              ${isSelected ? 'bg-gradient-to-br from-deep-gold to-yellow-500' : 'bg-gradient-to-br from-cosmic-blue to-deep-gold'}
              ${isHovered ? 'shadow-2xl shadow-deep-gold/60' : 'shadow-xl shadow-cosmic-blue/40'}
              animate-pulse-glow
              border-2 border-creamy-white/20
            `}>
              <span className="text-creamy-white font-bold text-xl drop-shadow-lg">
                {orb.id}
              </span>
            </div>

            {/* Orb Title - appears on hover */}
            {isHovered && (
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-deep-navy/95 backdrop-blur-md rounded-xl px-6 py-4 border border-deep-gold/40 shadow-2xl max-w-sm">
                  <h3 className="text-creamy-white font-bold text-base mb-2">
                    Orb {orb.id}: {orb.title}
                  </h3>
                  <p className="text-deep-gold/90 text-sm leading-relaxed">
                    {orb.synthesis.substring(0, 120)}...
                  </p>
                  <div className="mt-3 pt-2 border-t border-deep-gold/20">
                    <span className="text-creamy-white/60 text-xs font-semibold">
                      Click to explore field applications
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Field Console Overlay */}
      {selectedOrb && (
        <div className="absolute inset-0 bg-deep-navy/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-deep-navy/90 rounded-2xl p-8 border border-deep-gold/30">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-4xl font-bold text-creamy-white mb-2">
                    Orb {selectedOrb.id}: {selectedOrb.title}
                  </h2>
                  <p className="text-deep-gold text-lg">
                    {selectedOrb.synthesis}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrb(null)}
                  className="text-creamy-white/60 hover:text-creamy-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-deep-navy/50 rounded-lg p-4">
                    <h3 className="text-deep-gold font-semibold mb-2">Field Applications</h3>
                    <p className="text-creamy-white/80 text-sm">
                      This Orb governs the fundamental aspects of consciousness architecture...
                    </p>
                  </div>
                  <div className="bg-deep-navy/50 rounded-lg p-4">
                    <h3 className="text-deep-gold font-semibold mb-2">Related Scrolls</h3>
                    <p className="text-creamy-white/80 text-sm">
                      Explore the living transmissions connected to this Orb...
                    </p>
                  </div>
                </div>
                
                <button className="w-full bg-deep-gold text-deep-navy py-3 rounded-lg font-semibold hover:bg-creamy-white transition-colors">
                  Enter Orb Field
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="absolute top-6 left-6 space-x-3">
        <button className="bg-deep-navy/90 backdrop-blur-sm text-creamy-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-deep-gold hover:text-deep-navy transition-all duration-300 border border-deep-gold/30 hover:border-deep-gold/60">
          View by Field
        </button>
        <button className="bg-deep-navy/90 backdrop-blur-sm text-creamy-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-deep-gold hover:text-deep-navy transition-all duration-300 border border-deep-gold/30 hover:border-deep-gold/60">
          View by Axis
        </button>
        <button className="bg-deep-navy/90 backdrop-blur-sm text-creamy-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-deep-gold hover:text-deep-navy transition-all duration-300 border border-deep-gold/30 hover:border-deep-gold/60">
          My Resonance Map
        </button>
      </div>
    </div>
  );
}
