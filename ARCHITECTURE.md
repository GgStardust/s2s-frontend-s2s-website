# S2S RBI System Architecture

**Last Updated:** 2025-01-XX  
**Status:** Single Source of Truth  
**Purpose:** Complete system architecture documentation

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Monorepo Structure](#monorepo-structure)
3. [Core Principles](#core-principles)
4. [Package Architecture](#package-architecture)
5. [Data Flow](#data-flow)
6. [Deployment Architecture](#deployment-architecture)

---

## System Overview

**S2S RBI System** is a metadata-driven consciousness technology prototype with:

- **Metadata-first architecture**: YAML frontmatter and inline tags define structure
- **Dual-mode operation**: Book Compiler (static) + S2S Console (dynamic)
- **Mathematical validation layer**: RBI-Kernel provides dynamic coherence scoring
- **Narrative intelligence**: Orbital-Brain interprets RBI output and generates responses
- **Content management**: CMS_Backend manages content library and API endpoints

---

## Monorepo Structure

```
S2S_RBI_System/
├── package.json              # Root workspace config (pnpm)
├── CMS_Backend/              # Main CMS and API server (Next.js)
├── S2S_Console/              # Field Console frontend (Next.js)
├── RBI-Kernel/              # Core RBI computation engine (TypeScript library)
├── Orbital-Brain/           # Narrative intelligence layer (TypeScript library)
├── RBI-Architecture-Service/ # Standalone RBI service
└── RBI_Editorial_Tools/      # Content processing tools
```

### Package Dependencies

```
RBI-Kernel (no dependencies)
    ↓
Orbital-Brain (depends on rbi-kernel)
    ↓
CMS_Backend (depends on rbi-kernel, orbital-brain)
S2S_Console (depends on orbital-brain/types only - NO rbi-kernel)
```

**Critical Rule:** S2S_Console must NEVER import RBI-Kernel directly. It only imports types from Orbital-Brain.

---

## Core Principles

### 1. Metadata-First Architecture

- **YAML frontmatter** functions as structural DNA
- **Inline tags** (`@orb_1`, `@scrollstream`, etc.) are architectural markers
- **RBI runs as validation layer** after metadata has organized content
- **Metadata anchors computation** - RBI is subordinate to Codex metadata

### 2. Essays as Atomic Unit

- All new content defaults to `type: "essay"`
- "Book chapter" only for compiled, locked outputs
- Essays flow into multiple outputs:
  - Books (via Book Compiler)
  - Console (via direct metadata reading)
  - Codex / Archive

### 3. Dual Outputs from One Library

- **Same content library** feeds both:
  - **Book Compiler** → produces static manuscripts
  - **S2S Console** → produces dynamic, interactive field views
- Both rely on identical YAML and inline tag structures

### 4. RBI as Dynamic Validation

- RBI metrics computed **dynamically at runtime**
- RBI does NOT act as primary content selector
- RBI reads the field created by metadata structure
- YAML may include placeholders (`resonance_metrics: null`) but not fixed scores

---

## Package Architecture

### RBI-Kernel

**Purpose:** Core mathematical computation engine for resonance scoring and field-level coherence

**Structure:**
- `src/kernel.ts` - Main library exports (FieldComputation, Mathematics, Types)
- `src/index.ts` - Fastify server application (standalone service)
- `src/mathematics/` - Resonance vectors, sovereign logic
- `src/field/computation/` - Enhanced resonance engine, field operators
- `src/types.ts` - Type definitions

**Package.json Configuration:**
```json
{
  "main": "dist/kernel.js",
  "types": "dist/kernel.d.ts",
  "exports": {
    ".": {
      "import": "./dist/kernel.js",
      "types": "./dist/kernel.d.ts"
    },
    "./mathematics": {
      "import": "./dist/mathematics/index.js",
      "types": "./dist/mathematics/index.d.ts"
    },
    "./field": {
      "import": "./dist/field/computation/index.js",
      "types": "./dist/field/computation/index.d.ts"
    }
  }
}
```

**Import Patterns:**
- `import { FieldComputation } from 'rbi-kernel'` ✅
- `import { ResonanceVectorMath } from 'rbi-kernel'` ✅
- `import { ResonanceVector } from 'rbi-kernel/mathematics'` ✅
- `import { EnhancedResonanceEngine } from 'rbi-kernel/field'` ✅

**Note:** `dist/index.js` is the Fastify server (for standalone service), `dist/kernel.js` is the library export.

### Orbital-Brain

**Purpose:** Narrative intelligence layer that interprets RBI output and generates S2S-style responses

**Structure:**
- `src/core/` - Context manager, resonance interpreter, narrative generator
- `src/types/` - Type definitions (NO RBI imports - safe for Console)
- `src/index.ts` - Main exports (generateOrbitalResponse, chatCompletions, etc.)

**Package.json Configuration:**
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./types": {
      "import": "./dist/types/index.js",
      "types": "./dist/types/index.d.ts"
    }
  }
}
```

**Import Patterns:**
- `import { generateOrbitalResponse } from 'orbital-brain'` ✅
- `import type { ContentMetadata } from 'orbital-brain/types'` ✅
- `import { chatCompletions } from 'orbital-brain'` ✅

### CMS_Backend

**Purpose:** Main CMS and API server (Next.js application)

**Dependencies:**
- `rbi-kernel` - For RBI computation
- `orbital-brain` - For narrative generation and AI services

**Key APIs:**
- `/api/ai/conversation` - Orbital Brain conversation endpoint
- `/api/books` - Book management
- `/api/chapters` - Chapter management
- `/api/console/content` - Console content API
- `/api/rbi/field-sense` - RBI field sensing

### S2S_Console

**Purpose:** Field Console frontend (Next.js application)

**Dependencies:**
- `orbital-brain` - Types only (NO runtime imports of RBI-Kernel)

**Architecture Rule:** Console is pure presentation layer - all business logic in CMS_Backend

---

## Data Flow

### Metadata-First Flow

```
Content File (YAML + Markdown)
    ↓
Extract Metadata (YAML frontmatter + inline tags)
    ↓
RBI Computation (uses metadata.orb_associations)
    ↓
Orbital Brain (receives metadata + RBI output)
    ↓
Unified Response (content + metadata + rbi_output + orbital_interpretation)
```

### Book Compiler Flow

```
Essays (type: "essay")
    ↓
Metadata Matching (book_threading, field_function, orb_associations)
    ↓
Content Assembly (preserves inline tags)
    ↓
Compiled Chapter (type: "book_chapter")
    ↓
RBI Validation (optional, post-compilation)
```

### Console Flow

```
Essays (type: "essay")
    ↓
Direct Metadata Reading (field_function, integration_points)
    ↓
Dynamic View Generation (Resonance Chamber, Field Map, etc.)
    ↓
RBI Field Wrapping (measures resonance between visible pieces)
```

---

## Deployment Architecture

### Vercel Configuration (CMS_Backend)

**Root Directory:** Empty (monorepo root)

**Install Command:**
```bash
pnpm install --frozen-lockfile && pnpm --filter=rbi-kernel... --filter=orbital-brain... build
```

**Build Command:**
```bash
pnpm --filter=s2s-dashboard build
```

**Output Directory:** `CMS_Backend/.next`

**Why This Works:**
- Runs from monorepo root (pnpm workspace detected)
- Builds dependencies in correct order (RBI-Kernel → Orbital-Brain → CMS_Backend)
- Uses pnpm filter syntax for dependency resolution

### Build Order

1. **RBI-Kernel** (no dependencies) - `pnpm --filter=rbi-kernel build`
2. **Orbital-Brain** (depends on RBI-Kernel) - `pnpm --filter=orbital-brain build`
3. **CMS_Backend** (depends on both) - `pnpm --filter=s2s-dashboard build`

---

## Key Files Reference

### Architecture Documents
- `ARCHITECTURE.md` (this file) - Single source of truth
- `CMS_Backend/ARCHITECTURE_OVERVIEW.md` - Metadata-first principles
- `CMS_Backend/docs/S2S_ACTUAL_ARCHITECTURE.md` - Current system state
- `README_MONOREPO.md` - Monorepo setup and workspace structure

### Package Configurations
- `RBI-Kernel/package.json` - Library exports configuration
- `Orbital-Brain/package.json` - Type-safe exports
- `CMS_Backend/vercel.json` - Vercel deployment config
- `package.json` (root) - pnpm workspace configuration

---

## Migration Notes

### From Old Architecture

- **Old:** RBI-Kernel `main` pointed to `dist/index.js` (server)
- **New:** RBI-Kernel `main` points to `dist/kernel.js` (library)
- **Old:** No `exports` field in RBI-Kernel
- **New:** Proper `exports` field with subpath support

### Import Migration

- ✅ `from 'rbi-kernel'` - Main exports (FieldComputation, Mathematics, Types)
- ✅ `from 'rbi-kernel/mathematics'` - Mathematics subpath
- ✅ `from 'rbi-kernel/field'` - Field computation subpath
- ❌ `from 'rbi-kernel/field'` - OLD (no longer valid, use main export)

---

**This document supersedes all previous architecture documentation. For specific component details, see the referenced files above.**

