/**
 * Orb Personality Selector
 * 
 * UI component for selecting which Orb personality to use in Console conversations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../../src/styles/theme';

interface OrbPersonality {
  number: number;
  name: string;
  coreTraits: string[];
  communicationStyle: string[];
  culturalArchetype: string;
  uniqueGift: string;
}

interface OrbPersonalitySelectorProps {
  onSelect: (orbNumber: number | null) => void;
  selectedOrb?: number | null;
  className?: string;
}

export const OrbPersonalitySelector: React.FC<OrbPersonalitySelectorProps> = ({
  onSelect,
  selectedOrb,
  className
}) => {
  const [personalities, setPersonalities] = useState<OrbPersonality[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadPersonalities = async () => {
      try {
        const response = await fetch('/api/orbital/personalities');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.personalities) {
            setPersonalities(data.data.personalities);
          }
        }
      } catch (error) {
        console.error('Error loading orb personalities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPersonalities();
  }, []);

  const selectedPersonality = personalities.find(p => p.number === selectedOrb);

  if (loading) {
    return (
      <div className={className}>
        <div className="text-sm text-gray-400">Loading personalities...</div>
      </div>
    );
  }

  return (
    <div className={className} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '8px 16px',
            backgroundColor: COLORS.deepNavy,
            color: COLORS.creamyWhite,
            borderRadius: '8px',
            border: `1px solid ${COLORS.deepGold}40`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${COLORS.deepNavy}CC`;
            e.currentTarget.style.borderColor = COLORS.deepGold;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.deepNavy;
            e.currentTarget.style.borderColor = `${COLORS.deepGold}40`;
          }}
        >
          <span>
            {selectedPersonality 
              ? `Orb ${selectedPersonality.number}: ${selectedPersonality.name}`
              : 'Select Orb Personality'}
          </span>
          <span style={{ fontSize: '12px' }}>▼</span>
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '100%',
              marginTop: '8px',
              backgroundColor: `${COLORS.deepNavy}CC`,
              border: `1px solid ${COLORS.deepGold}40`,
              borderRadius: '8px',
              boxShadow: `0 8px 32px ${COLORS.deepGold}20`,
              zIndex: 50,
              maxHeight: '384px',
              overflowY: 'auto',
              width: '100%',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ padding: '8px' }}>
              <button
                onClick={() => {
                  onSelect(null);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: COLORS.creamyWhite,
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${COLORS.deepNavy}80`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                No Personality (Default)
              </button>
              {personalities.map((orb) => (
                <button
                  key={orb.number}
                  onClick={() => {
                    onSelect(orb.number);
                    setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    backgroundColor: selectedOrb === orb.number ? `${COLORS.deepNavy}80` : 'transparent',
                    border: 'none',
                    color: COLORS.creamyWhite,
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${COLORS.deepNavy}80`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = selectedOrb === orb.number ? `${COLORS.deepNavy}80` : 'transparent';
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Orb {orb.number}: {orb.name}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>{orb.culturalArchetype}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {selectedPersonality && (
        <div style={{
          marginTop: '8px',
          padding: '12px',
          backgroundColor: `${COLORS.deepNavy}80`,
          borderRadius: '8px',
          fontSize: '14px',
          border: `1px solid ${COLORS.deepGold}30`,
        }}>
          <div style={{ fontWeight: 600, marginBottom: '4px', color: COLORS.creamyWhite }}>{selectedPersonality.culturalArchetype}</div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '8px', color: COLORS.creamyWhite }}>{selectedPersonality.uniqueGift}</div>
          <div style={{ fontSize: '12px', color: COLORS.creamyWhite }}>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ opacity: 0.7 }}>Traits:</span> {selectedPersonality.coreTraits.slice(0, 3).join(', ')}
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>Style:</span> {selectedPersonality.communicationStyle.slice(0, 2).join(', ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

