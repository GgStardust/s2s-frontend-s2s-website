/**
 * Fibonacci Spiral Utilities
 * 
 * Generates 3D positions using Fibonacci ratios (golden angle)
 * Creates natural, organic constellation layouts
 */

export const GOLDEN_RATIO = 1.618033988749895;
export const GOLDEN_ANGLE = (2 * Math.PI) / GOLDEN_RATIO;

/**
 * Generate Fibonacci spiral positions for N points
 * @param n - Number of points
 * @param radius - Base radius
 * @returns Array of [x, y, z] positions
 */
export function generateFibonacciSpiral(n: number, radius: number = 5): Array<[number, number, number]> {
  const positions: Array<[number, number, number]> = [];
  
  for (let i = 0; i < n; i++) {
    const angle = i * GOLDEN_ANGLE;
    const r = radius * Math.sqrt(i / n); // Spread points evenly
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    const z = (i / n - 0.5) * radius * 0.5; // Add depth variation
    
    positions.push([x, y, z]);
  }
  
  return positions;
}

/**
 * Generate Fibonacci-based positions adjusted by resonance
 * @param n - Number of Orbs
 * @param resonanceMatrix - Resonance relationships
 * @param baseRadius - Base radius for constellation
 * @returns Array of [x, y, z] positions
 */
export function generateResonanceBasedPositions(
  n: number,
  resonanceMatrix: { [orbId: number]: { [targetId: number]: number } },
  baseRadius: number = 5
): Array<[number, number, number]> {
  // Start with Fibonacci spiral
  const basePositions = generateFibonacciSpiral(n, baseRadius);
  
  // Adjust positions based on resonance relationships
  const adjustedPositions: Array<[number, number, number]> = [];
  
  for (let i = 0; i < n; i++) {
    const orbId = i + 1;
    const basePos = basePositions[i];
    let [x, y, z] = basePos;
    
    // Calculate center of mass for resonant Orbs
    let totalResonance = 0;
    let weightedX = 0;
    let weightedY = 0;
    let weightedZ = 0;
    
    Object.entries(resonanceMatrix[orbId] || {}).forEach(([targetId, strength]) => {
      const target = parseInt(targetId);
      if (target !== orbId && strength > 0.3) {
        const targetPos = basePositions[target - 1];
        weightedX += targetPos[0] * strength;
        weightedY += targetPos[1] * strength;
        weightedZ += targetPos[2] * strength;
        totalResonance += strength;
      }
    });
    
    // Pull toward resonant neighbors (with damping)
    if (totalResonance > 0) {
      const pullStrength = 0.2; // How much to be pulled
      x = x * (1 - pullStrength) + (weightedX / totalResonance) * pullStrength;
      y = y * (1 - pullStrength) + (weightedY / totalResonance) * pullStrength;
      z = z * (1 - pullStrength) + (weightedZ / totalResonance) * pullStrength;
    }
    
    adjustedPositions.push([x, y, z]);
  }
  
  return adjustedPositions;
}

