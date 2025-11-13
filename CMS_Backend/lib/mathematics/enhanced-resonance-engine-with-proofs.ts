/**
 * Enhanced Resonance Engine with Proofs - Wrapper for RBI-Kernel
 * 
 * This file is a wrapper that delegates to the consolidated RBI-Kernel.
 * It preserves the existing interface while using RBI-Kernel as the implementation.
 * 
 * MIGRATION NOTE: This wrapper maintains backward compatibility.
 * Future code should import directly from 'rbi-kernel'.
 */

// Re-export from the main enhanced-resonance-engine wrapper
export { EnhancedResonanceEngine, type EnhancedResonanceAnalysis } from './enhanced-resonance-engine';
