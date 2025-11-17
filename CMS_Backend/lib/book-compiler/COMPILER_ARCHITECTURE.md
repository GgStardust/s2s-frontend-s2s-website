# Modular Book Compiler Architecture

## Overview

This is a modular, layer-based book compiler that integrates:
- **Metadata Matching** (base layer - always enabled)
- **RBI Discovery** (finds resonant content beyond metadata)
- **RBI Validation** (ensures coherence)
- **RBI Ordering** (optimal flow)
- **Orbital Brain** (narrative intelligence)
- **Style Training** (voice consistency)
- **Editorial Layer** (readability and recognition-first flow)

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│ Layer 7: Editorial/Readability                        │
│ - Recognition-first restructuring                      │
│ - Gap detection and bridging                           │
│ - Flow optimization                                    │
│ - Readability scoring                                  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 6: Style Training Integration                    │
│ - Load learned patterns                                │
│ - Generate style-aware prompts                        │
│ - Ensure voice consistency                             │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 5: Orbital Brain Narrative Generation            │
│ - Recognition-first openings                           │
│ - Narrative bridges between sections                   │
│ - Orb personality voice                                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 4: RBI Ordering                                  │
│ - Measure resonance between sources                     │
│ - Find optimal ordering                                │
│ - Build resonance flow chain                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 3: RBI Validation                                │
│ - Validate resonance between sources                  │
│ - Check coherence metrics                             │
│ - Proof-of-Meaning verification                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 2: RBI Discovery                                 │
│ - Search entire content library                        │
│ - Find neighbors based on resonance                    │
│ - Expand pool beyond metadata matches                  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Metadata Matching (Base)                     │
│ - book_threading matching                              │
│ - field_function matching                             │
│ - orb_associations matching                            │
│ - Initial source selection                             │
└─────────────────────────────────────────────────────────┘
```

## Module Structure

```
lib/book-compiler/
├── core/
│   ├── metadata-selector.ts      # Metadata-based source selection
│   ├── content-loader.ts          # Load content files from library
│   └── chapter-compiler.ts        # Basic chapter compilation
│
├── rbi/
│   ├── discovery.ts              # RBI neighbor finding
│   ├── validation.ts             # Resonance validation
│   └── ordering.ts               # Optimal ordering
│
├── orbital/
│   ├── narrative-generation.ts   # Orbital Brain integration
│   └── bridges.ts                 # Generate transitions
│
├── style/
│   └── style-integration.ts      # Style training integration
│
├── editorial/
│   ├── readability.ts            # Readability analysis
│   ├── recognition-first.ts       # Recognition-first restructuring
│   ├── gap-detection.ts          # Coherence gap detection
│   └── flow-optimization.ts      # Flow optimization
│
├── types.ts                      # Type definitions
├── config.ts                     # Configuration interface
└── index.ts                      # Main compiler
```

## Configuration

```typescript
export interface CompilerConfig {
  // Core (always enabled)
  useMetadataMatching: boolean;  // Always true
  
  // RBI Layers
  useRBIDiscovery: boolean;      // Find resonant content
  useRBIValidation: boolean;     // Validate resonance
  useRBIOrdering: boolean;       // Optimal ordering
  
  // Narrative Layers
  useOrbitalBrain: boolean;      // Narrative generation
  useStyleTraining: boolean;      // Voice consistency
  
  // Editorial Layer
  useEditorialLayer: boolean;     // Readability & recognition-first
  
  // Options
  maxSources?: number;           // Default: 3 (metadata) or 15 (with RBI)
  recognitionFirst?: boolean;    // Recognition-first flow
  minCoherence?: number;        // Minimum coherence threshold (0-1)
  enableGapBridging?: boolean;   // Auto-generate bridges for gaps
}
```

## Editorial Layer Details

The editorial layer provides:

1. **Recognition-First Restructuring**
   - Analyzes content for recognition quality (experience vs. concept)
   - Reorders sections to start with experience
   - Ensures concepts follow recognition

2. **Gap Detection**
   - Measures coherence between adjacent sections
   - Identifies abrupt transitions
   - Flags sections that don't flow

3. **Flow Optimization**
   - Suggests optimal section ordering
   - Validates smooth transitions
   - Ensures narrative coherence

4. **Readability Scoring**
   - Uses RBI Clarity dimension
   - Measures accessibility
   - Identifies dense sections needing simplification

## Usage

### Standalone Script
```typescript
import { compileBook } from '@/lib/book-compiler';

const config = {
  useMetadataMatching: true,
  useRBIDiscovery: true,
  useRBIValidation: true,
  useRBIOrdering: true,
  useOrbitalBrain: true,
  useStyleTraining: true,
  useEditorialLayer: true,
  recognitionFirst: true
};

await compileBook(config);
```

### API Endpoint
```typescript
import { compileChapter } from '@/lib/book-compiler';

export async function POST(request: NextRequest) {
  const { chapter_id, config } = await request.json();
  const result = await compileChapter(chapter_id, config);
  return NextResponse.json(result);
}
```

## Benefits

1. **Modular**: Enable/disable layers as needed
2. **Reusable**: Works for any book project
3. **Backward Compatible**: Can run in metadata-only mode
4. **Comprehensive**: Includes all enhancement layers
5. **Editorial**: Built-in readability and recognition-first support

