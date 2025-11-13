'use client';

import { useState } from 'react';
import Link from 'next/link';

const ORBS = [
  { id: 1, name: 'Origin Intelligence', color: 'bg-orb-1', description: 'Photonic blueprinting meets biological activation' },
  { id: 2, name: 'Resonance Mechanics', color: 'bg-orb-2', description: 'Frequency becomes form' },
  { id: 3, name: 'Photonic Intelligence', color: 'bg-orb-3', description: 'Light as information, structure, and consciousness' },
  { id: 4, name: 'Harmonic Architectures', color: 'bg-orb-4', description: 'Geometry crystallizes consciousness' },
  { id: 5, name: 'Temporal Sovereignty', color: 'bg-orb-5', description: 'Time as spiral, parallel, permeable' },
  { id: 6, name: 'Starline Memory', color: 'bg-orb-6', description: 'Galactic recall and stellar navigation' },
  { id: 7, name: 'Alchemical Current', color: 'bg-orb-7', description: 'Density becomes light through heat, compression, pulse' },
  { id: 8, name: 'Quantum Intuition', color: 'bg-orb-8', description: 'Probability collapse through conscious observation' },
  { id: 9, name: 'Temporal Fluidity', color: 'bg-orb-9', description: 'Flow states and quantum timing' },
  { id: 10, name: 'Ancestral Repatterning', color: 'bg-orb-10', description: 'Breaking inherited loops' },
  { id: 11, name: 'Radiant Transparency', color: 'bg-orb-11', description: 'Luminous authenticity' },
  { id: 12, name: 'Sovereign Field', color: 'bg-orb-12', description: 'Authority from within' },
  { id: 13, name: 'Bridging Intelligence', color: 'bg-orb-13', description: 'Integration across dimensions' },
];

export default function OrbGrid() {
  const [hoveredOrb, setHoveredOrb] = useState<number | null>(null);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-void-black via-deep-indigo to-void-black p-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl">
        {ORBS.map((orb) => (
          <Link
            key={orb.id}
            href={`/orbs/${orb.id}`}
            onMouseEnter={() => setHoveredOrb(orb.id)}
            onMouseLeave={() => setHoveredOrb(null)}
            className="group relative"
          >
            {/* Orb Circle */}
            <div
              className={`
                w-32 h-32 rounded-full flex items-center justify-center
                ${orb.color}
                transition-all duration-300 ease-out
                ${hoveredOrb === orb.id ? 'scale-110 shadow-2xl' : 'scale-100 shadow-lg'}
                cursor-pointer
              `}
              style={{
                boxShadow: hoveredOrb === orb.id
                  ? `0 0 60px rgba(212, 175, 55, 0.6)`
                  : `0 0 30px rgba(212, 175, 55, 0.3)`
              }}
            >
              <span className="text-4xl font-bold text-white">{orb.id}</span>
            </div>

            {/* Orb Name */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-48 text-center">
              <p className="text-sm font-montserrat font-semibold text-bone-white mb-1">
                {orb.name}
              </p>
              {hoveredOrb === orb.id && (
                <p className="text-xs text-living-gold/70 font-lora italic">
                  {orb.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
