/**
 * Concept Map View
 * 
 * Displays Orb relationships, axes, and pairings from concept map
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchConceptMap } from '../../src/lib/api/console-api';
import type { ConceptMapData } from '../../src/lib/api/console-api';
import { COLORS, TYPOGRAPHY } from '../../src/styles/theme';

interface ConceptMapViewProps {
  className?: string;
}

export const ConceptMapView: React.FC<ConceptMapViewProps> = ({ className }) => {
  const [conceptMap, setConceptMap] = useState<ConceptMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConceptMap()
      .then(data => {
        setConceptMap(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={className} style={{ padding: '20px', color: COLORS.creamyWhite }}>
        Loading concept map...
      </div>
    );
  }

  if (error || !conceptMap) {
    return (
      <div className={className} style={{ padding: '20px', color: COLORS.creamyWhite }}>
        Error: {error || 'Failed to load concept map'}
      </div>
    );
  }

  return (
    <div className={className} style={{ padding: '20px', color: COLORS.creamyWhite }}>
      <h2 style={{ fontFamily: TYPOGRAPHY.serif, marginBottom: '20px' }}>Orb Relationships</h2>

      {/* Primary Axes */}
      {conceptMap.primaryAxes.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px', opacity: 0.9 }}>Primary Axes</h3>
          {conceptMap.primaryAxes.map((axis, idx) => (
            <motion.div
              key={idx}
              style={{
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: `${COLORS.deepNavy}80`,
                border: `1px solid ${COLORS.deepGold}30`,
                borderRadius: '8px',
                fontSize: '14px',
              }}
              whileHover={{ borderColor: COLORS.deepGold, backgroundColor: `${COLORS.deepNavy}90` }}
            >
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                Orb {axis.orb1} ↔ Orb {axis.orb2}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{axis.description}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Secondary Pairings */}
      {conceptMap.secondaryPairings.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px', opacity: 0.9 }}>Secondary Pairings</h3>
          {conceptMap.secondaryPairings.slice(0, 5).map((pairing, idx) => (
            <motion.div
              key={idx}
              style={{
                padding: '10px',
                marginBottom: '6px',
                backgroundColor: `${COLORS.deepNavy}60`,
                border: `1px solid ${COLORS.deepGold}20`,
                borderRadius: '6px',
                fontSize: '13px',
              }}
              whileHover={{ borderColor: COLORS.deepGold, backgroundColor: `${COLORS.deepNavy}70` }}
            >
              <div style={{ fontWeight: 500 }}>
                Orb {pairing.orb1} + Orb {pairing.orb2}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
                {pairing.description}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

