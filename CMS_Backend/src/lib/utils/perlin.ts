/**
 * Perlin Noise Implementation
 * 
 * Used for organic drift animation in 3D constellation
 * Creates smooth, natural movement patterns
 */

// Simple Perlin noise implementation
class PerlinNoise {
  private permutation: number[];
  private p: number[];

  constructor(seed: number = 0) {
    this.permutation = [];
    this.p = [];
    
    // Initialize permutation array
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }
    
    // Shuffle based on seed
    let rng = seed;
    for (let i = 255; i > 0; i--) {
      rng = (rng * 9301 + 49297) % 233280;
      const j = Math.floor((rng / 233280) * (i + 1));
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }
    
    // Duplicate permutation array
    for (let i = 0; i < 512; i++) {
      this.p[i] = this.permutation[i % 256];
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x: number, y: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const A = this.p[X] + Y;
    const AA = this.p[A] + Z;
    const AB = this.p[A + 1] + Z;
    const B = this.p[X + 1] + Y;
    const BA = this.p[B] + Z;
    const BB = this.p[B + 1] + Z;

    return this.lerp(
      this.lerp(
        this.lerp(
          this.grad(this.p[AA], x, y, z),
          this.grad(this.p[BA], x - 1, y, z),
          u
        ),
        this.lerp(
          this.grad(this.p[AB], x, y - 1, z),
          this.grad(this.p[BB], x - 1, y - 1, z),
          u
        ),
        v
      ),
      this.lerp(
        this.lerp(
          this.grad(this.p[AA + 1], x, y, z - 1),
          this.grad(this.p[BA + 1], x - 1, y, z - 1),
          u
        ),
        this.lerp(
          this.grad(this.p[AB + 1], x, y - 1, z - 1),
          this.grad(this.p[BB + 1], x - 1, y - 1, z - 1),
          u
        ),
        v
      ),
      w
    );
  }
}

// Create singleton instance
let perlinInstance: PerlinNoise | null = null;

export function getPerlinNoise(seed: number = 0): PerlinNoise {
  if (!perlinInstance) {
    perlinInstance = new PerlinNoise(seed);
  }
  return perlinInstance;
}

/**
 * Generate drift offset using Perlin noise
 * @param orbId - Unique identifier for the Orb
 * @param time - Current time in seconds
 * @param scale - Scale factor for drift (default: 0.5)
 * @returns [x, y, z] drift offset
 */
export function getDriftOffset(orbId: number, time: number, scale: number = 0.5): [number, number, number] {
  const noise = getPerlinNoise(orbId);
  const frequency = 0.1; // Slow drift
  const x = noise.noise(orbId * 10, time * frequency, 0) * scale;
  const y = noise.noise(orbId * 10 + 100, time * frequency, 0) * scale;
  const z = noise.noise(orbId * 10 + 200, time * frequency, 0) * scale;
  return [x, y, z];
}

