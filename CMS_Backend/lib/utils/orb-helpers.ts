/**
 * Helper functions for working with Orb associations
 */

/**
 * Extract orb number from string like "Orb 1: Origin Intelligence" or "Orb 12: Sovereign Field"
 */
export function extractOrbNumber(orbString: string): number | null {
  if (typeof orbString !== 'string') return null;
  
  // Match "Orb {number}" pattern
  const match = orbString.match(/Orb\s+(\d+)/i);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    if (num >= 1 && num <= 13) {
      return num;
    }
  }
  
  return null;
}

/**
 * Check if an orb association array contains a specific orb number
 */
export function orbArrayContains(orbAssociations: string[] | null | undefined, orbNumber: number): boolean {
  if (!orbAssociations || !Array.isArray(orbAssociations)) return false;
  
  return orbAssociations.some(orb => {
    const extracted = extractOrbNumber(orb);
    return extracted === orbNumber;
  });
}

/**
 * Generate orb search patterns for Supabase queries
 * Returns array of strings like ["Orb 1: Origin Intelligence", "Orb 1:", ...]
 */
export function generateOrbSearchPatterns(orbNumber: number): string[] {
  // Common orb names (can be extended)
  const orbNames: Record<number, string[]> = {
    1: ['Origin Intelligence'],
    2: ['Resonance Mechanics'],
    3: ['Photonic Intelligence'],
    4: ['Harmonic Architectures'],
    5: ['Temporal Sovereignty'],
    6: ['Starline Memory'],
    7: ['Alchemical Current'],
    8: ['Quantum Intuition'],
    9: ['Sovereign Disintegration'],
    10: ['Language as Sonic Grid'],
    11: ['Sacred Architecture'],
    12: ['Sovereign Field'],
    13: ['Bridging Intelligence'],
  };
  
  const patterns: string[] = [`Orb ${orbNumber}:`];
  
  // Add full names if available
  const names = orbNames[orbNumber];
  if (names) {
    names.forEach(name => {
      patterns.push(`Orb ${orbNumber}: ${name}`);
    });
  }
  
  return patterns;
}

