/**
 * SCROLLSTREAM
 *  - Curved flowing Lora text
 *  - Golden pulse on resonant words
 *  - Pause-on-hover creates field interaction
 *  - Text selection triggers coherence feedback
 *  - No fixed scrollbars — stream flows organically
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFieldStore } from '../../src/lib/store/fieldStore';
import { verifyProofOfMeaning } from '@/src/lib/rbi';
import { COLORS, TYPOGRAPHY, BREATH_CYCLE } from '../../src/styles/theme';
import {
  loadCodexContent,
  matchContentByResonance,
  extractScrollStreamSnippets,
} from '../../src/lib/content/codexLoader';
import { fetchConsoleContent } from '../../src/lib/api/console-api';

interface ScrollStreamProps {
  content?: string;
  className?: string;
}

// Resonant words that trigger golden pulse
const RESONANT_WORDS = ['resonance', 'coherence', 'field', 'sovereignty', 'orb', 'meaning', 'consciousness', 'frequency'];

export const ScrollStream: React.FC<ScrollStreamProps> = ({
  content,
  className,
}) => {
  const { coherenceMetrics, resonanceMatrix, selectedOrbId } = useFieldStore();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [flowSpeed, setFlowSpeed] = useState(50);
  const [textSnippets, setTextSnippets] = useState<string[]>([]);
  const [breathPhase, setBreathPhase] = useState(0);

  // Load Codex content and match by resonance
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Try to load from new console content API first
        if (selectedOrbId) {
          const consoleContent = await fetchConsoleContent({ orb_id: selectedOrbId });
          if (consoleContent.length > 0) {
            // Extract text snippets from console content
            const snippets = consoleContent
              .map(c => c.content)
              .join('\n\n')
              .split('\n')
              .filter(line => line.trim().length > 20)
              .slice(0, 10);
            setTextSnippets(snippets.length > 0 ? snippets : ['Loading content...']);
            return;
          }
        }

        // Fallback to original codex loader
        const codexContent = await loadCodexContent();
        
        if (resonanceMatrix) {
          const matchedContent = matchContentByResonance(
            codexContent,
            resonanceMatrix,
            selectedOrbId || undefined
          );
          
          const snippets = extractScrollStreamSnippets(matchedContent);
          setTextSnippets(snippets.length > 0 ? snippets : ['Loading Codex content...']);
        } else {
          const snippets = extractScrollStreamSnippets(codexContent);
          setTextSnippets(snippets.length > 0 ? snippets : ['Loading Codex content...']);
        }
      } catch (error) {
        console.error('Error loading content:', error);
        setTextSnippets(['Error loading content']);
      }
    };

    loadContent();
  }, [resonanceMatrix, selectedOrbId]);

  // 4-second breath cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev + 0.1) % (Math.PI * 2));
    }, BREATH_CYCLE / 60);

    return () => clearInterval(interval);
  }, []);

  // Calculate flow speed from coherence
  useEffect(() => {
    if (coherenceMetrics) {
      const baseSpeed = 30;
      const coherenceMultiplier = coherenceMetrics.overall;
      setFlowSpeed(baseSpeed + coherenceMultiplier * 40);
    }
  }, [coherenceMetrics]);

  // Verify proof of meaning when text is selected
  useEffect(() => {
    if (selectedText) {
      const proof = verifyProofOfMeaning();
      console.log('Proof of meaning:', proof, 'for text:', selectedText);
    }
  }, [selectedText]);

  // Use provided content or loaded snippets
  const displaySnippets = content
    ? content.split('\n').filter((line) => line.trim())
    : textSnippets.length > 0
    ? textSnippets
    : ['Loading Codex content...'];

  const currentSpeed = isPaused ? 0 : flowSpeed;
  const breathIntensity = 0.8 + Math.sin(breathPhase) * 0.2;

  // Split text into words and identify resonant words
  const renderCurvedText = (text: string, index: number) => {
    const words = text.split(' ');
    const curveHeight = 20; // Height of the curve
    const centerY = 0;

    return (
      <motion.g
        key={index}
        initial={{ x: 0 }}
        animate={{ x: -1000 }}
        transition={{
          x: {
            duration: 1000 / currentSpeed,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {words.map((word, wordIndex) => {
          const isResonant = RESONANT_WORDS.some((rw) =>
            word.toLowerCase().includes(rw.toLowerCase())
          );
          const x = wordIndex * 80;
          const y = centerY + Math.sin((wordIndex / words.length) * Math.PI * 2) * curveHeight;

          return (
            <motion.text
              key={wordIndex}
              x={x}
              y={y}
              fill={isResonant ? COLORS.deepGold : COLORS.creamyWhite}
              fontSize="18"
              fontFamily={TYPOGRAPHY.serif}
              opacity={isResonant ? 0.9 : 0.7}
              style={{
                cursor: 'text',
                userSelect: 'text',
              }}
              animate={
                isResonant
                  ? {
                      opacity: [0.9, 1, 0.9],
                      fill: [COLORS.deepGold, COLORS.deepGold, COLORS.deepGold],
                      filter: [
                        'drop-shadow(0 0 5px rgba(196, 154, 108, 0.5))',
                        'drop-shadow(0 0 15px rgba(196, 154, 108, 0.8))',
                        'drop-shadow(0 0 5px rgba(196, 154, 108, 0.5))',
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              onMouseDown={(e) => {
                const selection = window.getSelection();
                if (selection) {
                  const text = selection.toString();
                  if (text) {
                    setSelectedText(text);
                  }
                }
              }}
            >
              {word}
              {wordIndex < words.length - 1 ? ' ' : ''}
            </motion.text>
          );
        })}
      </motion.g>
    );
  };

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        bottom: '60px',
        left: 0,
        right: 0,
        height: '80px',
        overflow: 'hidden',
        zIndex: 50,
        pointerEvents: 'none',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          overflow: 'visible',
        }}
      >
        {/* Curved flowing text */}
        {[...displaySnippets, ...displaySnippets].map((snippet, idx) =>
          renderCurvedText(snippet, idx)
        )}
      </svg>

      {/* Selection Feedback */}
      {selectedText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          style={{
            position: 'absolute',
            bottom: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            background: `linear-gradient(135deg, ${COLORS.deepGold}80 0%, ${COLORS.deepGold}60 100%)`,
            backdropFilter: 'blur(10px)',
            color: COLORS.creamyWhite,
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: TYPOGRAPHY.sans,
            pointerEvents: 'none',
            boxShadow: `0 4px 20px ${COLORS.deepGold}40`,
          }}
          onAnimationComplete={() => {
            setTimeout(() => setSelectedText(null), 2000);
          }}
        >
          Selected: &quot;{selectedText.substring(0, 30)}...&quot;
        </motion.div>
      )}
    </div>
  );
};
