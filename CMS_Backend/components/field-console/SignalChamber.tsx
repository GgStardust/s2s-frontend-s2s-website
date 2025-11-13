/**
 * SIGNAL CHAMBER
 *  - Participant input interface that feeds RBI kernel
 *  - Initializes field state from participant input vector
 *  - Field gestures (not traditional forms)
 *  - Input creates resonance in field
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFieldStore } from '../../src/lib/store/fieldStore';
import { updateCoherenceField } from '@/src/lib/rbi';
import { COLORS, TYPOGRAPHY } from '../../src/styles/theme';
import { OrbPersonalitySelector } from './OrbPersonalitySelector';

interface SignalChamberProps {
  onFieldStateUpdate?: (fieldState: any) => void;
  className?: string;
}

const PRESET_INPUTS = [
  'How are you arriving?',
  'What resonates?',
  'What seeks clarity?',
  'What wants to emerge?',
];

export const SignalChamber: React.FC<SignalChamberProps> = ({
  onFieldStateUpdate,
  className,
}) => {
  const { setFieldState, setCoherenceMetrics, setResonanceMatrix } = useFieldStore();
  const [input, setInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOrbPersonality, setSelectedOrbPersonality] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!input.trim()) return;

    // Update field state with participant input
    const newFieldState = updateCoherenceField(input);
    
    // Recompute resonance and coherence based on input
    const { computeResonance, calculateCoherence } = require('@/src/lib/rbi');
    const resonance = computeResonance();
    const coherence = calculateCoherence();

    setFieldState(newFieldState);
    setResonanceMatrix(resonance);
    setCoherenceMetrics(coherence);
    setSubmitted(true);

    // Reset after feedback
    setTimeout(() => {
      setInput('');
      setSubmitted(false);
      setIsActive(false);
    }, 2000);

    onFieldStateUpdate?.(newFieldState);
  };

  const handlePresetClick = (preset: string) => {
    setInput(preset);
    setIsActive(true);
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={className}
          style={{
            position: 'fixed',
            bottom: '200px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            maxWidth: '90vw',
            zIndex: 200,
            pointerEvents: 'auto',
          }}
        >
          {/* Input field (field gesture, not traditional form) */}
          <motion.div
            style={{
              backgroundColor: COLORS.deepNavy,
              border: `2px solid ${COLORS.deepGold}`,
              borderRadius: '8px',
              padding: '20px',
              boxShadow: `0 0 20px ${COLORS.deepGold}40`,
            }}
            animate={{
              boxShadow: submitted
                ? [
                    `0 0 20px ${COLORS.deepGold}40`,
                    `0 0 40px ${COLORS.deepGold}80`,
                    `0 0 20px ${COLORS.deepGold}40`,
                  ]
                : `0 0 20px ${COLORS.deepGold}40`,
            }}
            transition={{ duration: 1, repeat: submitted ? Infinity : 0 }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Enter your field state..."
              style={{
                width: '100%',
                minHeight: '100px',
                backgroundColor: 'transparent',
                border: 'none',
                color: COLORS.creamyWhite,
                fontFamily: TYPOGRAPHY.serif,
                fontSize: '16px',
                resize: 'none',
                outline: 'none',
                padding: '10px',
              }}
            />

            {/* Orb Personality Selector */}
            <div style={{ marginBottom: '15px' }}>
              <OrbPersonalitySelector
                onSelect={setSelectedOrbPersonality}
                selectedOrb={selectedOrbPersonality}
              />
            </div>

            {/* Preset buttons (field gestures) */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '15px',
                flexWrap: 'wrap',
              }}
            >
              {PRESET_INPUTS.map((preset) => (
                <motion.button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${COLORS.deepGold}`,
                    borderRadius: '4px',
                    color: COLORS.creamyWhite,
                    fontFamily: TYPOGRAPHY.sans,
                    fontSize: '12px',
                    cursor: 'pointer',
                    opacity: 0.7,
                  }}
                >
                  {preset}
                </motion.button>
              ))}
            </div>

            {/* Submit feedback */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  marginTop: '15px',
                  textAlign: 'center',
                  color: COLORS.deepGold,
                  fontFamily: TYPOGRAPHY.sans,
                  fontSize: '14px',
                }}
              >
                Field state updated
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Toggle button */}
      {!isActive && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsActive(true)}
          style={{
            position: 'fixed',
            bottom: '200px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            backgroundColor: COLORS.deepGold,
            border: 'none',
            borderRadius: '8px',
            color: COLORS.deepNavy,
            fontFamily: TYPOGRAPHY.sans,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            zIndex: 200,
            boxShadow: `0 0 20px ${COLORS.deepGold}40`,
          }}
          whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${COLORS.deepGold}60` }}
          whileTap={{ scale: 0.95 }}
        >
          Enter Field State
        </motion.button>
      )}
    </AnimatePresence>
  );
};

