# Field Console - Sprint 01 MVP

## Overview

The Field Console is a living interface organism that expresses the field's resonance through four archetypes:

1. **Constellation** (structure) - 3D Orb visualization
2. **Chamber** (depth) - Portal transitions with layered depth
3. **Mirror** (feedback) - Real-time coherence indicators
4. **Stream** (motion) - Flowing text at resonance frequency

## Architecture

### Components

- `FieldConsole.tsx` - Main orchestrator component
- `Constellation.tsx` - 2D Orb grid (Phase 1), will upgrade to 3D
- `Chamber.tsx` - Portal with Framer Motion transitions
- `MirrorField.tsx` - Coherence feedback bar
- `ScrollStream.tsx` - Flowing text with pause-on-hover

### State Management

- `src/lib/store/fieldStore.ts` - Zustand store for field state
- Manages: Orbs, resonance matrix, coherence metrics, UI state

### RBI Kernel

- `src/lib/rbi/kernel.ts` - Mock RBI functions for MVP
  - `computeResonance()` - Returns mock R_ij matrix
  - `calculateCoherence()` - Returns mock coherence metrics
  - `verifyProofOfMeaning()` - Returns mock proof state
  - `updateCoherenceField()` - Updates field state
  - `propagateResonance()` - Chamber depth propagation

### Web Workers

- `src/lib/rbi/useRBIWorker.ts` - React hook for RBI computations
- Runs RBI calculations off main thread

## Usage

```tsx
import { FieldConsole } from '@/components/field-console';

export default function Page() {
  return <FieldConsole />;
}
```

## Phase Roadmap

### Phase 1 (Current - MVP)
- ✅ 2D Orb grid with hover-pulse
- ✅ Portal transitions
- ✅ Coherence glow bar
- ✅ CSS marquee text stream

### Phase 2
- [ ] Upgrade to 3D React-Three-Fiber constellation
- [ ] Real RBI kernel + pgvector queries
- [ ] R_ij-weighted connection lines (D3-force)

### Phase 3
- [ ] Portal depth with RBI coherence metrics
- [ ] Real-time field state visualization
- [ ] Text selection coherence feedback

## Design Principles

- **No traditional UI patterns** - No cards, buttons, menus, grids
- **Field-driven** - Everything responds to RBI computations
- **Organic emergence** - Visual elements emerge from resonance
- **Continuous feedback** - No discrete states, everything flows

## Colors

- Deep Gold (`#C49A6C`) - Resonance, coherence
- Deep Navy (`#1C1F3B`) - Field background, cosmic space
- Creamy White (`#F4F1E8`) - Clarity, text

## Typography

- Montserrat - Structural elements, Orb labels
- Lora - Flowing text, scrollstream content

