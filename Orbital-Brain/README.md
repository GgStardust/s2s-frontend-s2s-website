# Orbital Brain

Narrative Intelligence Layer for Stardust to Sovereignty System

## Overview

Orbital Brain is the intelligence layer that interprets RBI Kernel output and generates S2S-style narrative responses. It bridges the gap between mathematical validation (RBI) and narrative generation (Codex/Field context).

## Architecture

```
RBI_Kernel (mathematical computation)
  ↓
Orbital Brain (narrative synthesis + field memory)
  ↓
Unified Response (content + metadata + rbi_output + orbital_interpretation)
```

## Core Modules

- **context_manager.ts** - Manages session and field memory
- **resonance_interpreter.ts** - Maps RBI vectors to Codex semantics
- **narrative_generator.ts** - Composes S2S-style responses

## Usage

### CMS_Backend (Full Functionality)

```typescript
import { generateOrbitalResponse } from 'orbital-brain';

const response = await generateOrbitalResponse({
  inquiry: "Why do I feel disconnected?",
  metadata: { orb_associations: [7], ... },
  rbi_output: { coherence: 0.85, ... },
  session_id: "session_123"
});
```

### S2S_Console (Types Only)

```typescript
import type { OrbitalResponse } from 'orbital-brain/types';

const response: OrbitalResponse = await fetch(...).then(r => r.json());
```

## Metadata-First Architecture

Orbital Brain receives:
- **Metadata** (from content files) - anchors the interpretation
- **RBI Output** (from RBI Kernel) - provides mathematical validation
- **Inquiry** (from user) - the question being answered

This ensures metadata always anchors the computation, with RBI providing validation.

## Installation

```bash
npm install
npm run build
```

## Development

```bash
npm run typecheck
```

