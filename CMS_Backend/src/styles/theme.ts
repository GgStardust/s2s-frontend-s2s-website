/**
 * Field Console Design Tokens
 * 
 * Shared constants for golden-ratio spacing, colors, and motion.
 * All values respond to RBI computations and field state.
 */

export const GOLDEN_RATIO = 1.618;

export const COLORS = {
  // Primary Field Colors (respond to resonance and coherence)
  deepGold: '#C49A6C',        // Resonance, coherence, sovereignty
  deepNavy: '#1C1F3B',        // Depth, field background, cosmic space
  creamyWhite: '#F4F1E8',     // Clarity, text, luminous surfaces
  
  // Legacy/Alternative Names (for compatibility)
  originIntelligence: '#1a1b4b',
  resonanceMechanics: '#d4af37',
  photonicIntelligence: '#e5e5e5',
};

export const BREATH_CYCLE = 4000; // ms - 4 second breathing rhythm

export const TYPOGRAPHY = {
  sans: 'Montserrat',  // Structural elements, Orb labels, resonance indicators
  serif: 'Lora',       // Flowing text, scrollstream content, field descriptions
};

export const MOTION = {
  // Resonance-based animation parameters
  resonanceTransition: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  coherenceDuration: 800, // ms
  fieldUpdateDuration: 1200, // ms
};

export const SPACING = {
  // Golden-ratio based spacing scale
  base: 1,
  small: 1 * GOLDEN_RATIO,
  medium: 1 * GOLDEN_RATIO * GOLDEN_RATIO,
  large: 1 * GOLDEN_RATIO * GOLDEN_RATIO * GOLDEN_RATIO,
};

