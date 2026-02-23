# RBI-Kernel Boundary Rules

**Date:** 2025-12-22  
**Status:** Active  
**Purpose:** Enforce clean package boundaries and prevent direct source imports

---

## Overview

RBI-Kernel must be used as a package dependency, not imported directly from source files. This document defines the boundary rules and enforcement mechanisms.

---

## Rules

### Rule 1: Use Package Exports Only

**✅ CORRECT:**
```typescript
// Main export
import { FieldComputation, Mathematics } from 'rbi-kernel';

// Subpath exports
import { ResonanceVectorMath } from 'rbi-kernel/mathematics';
import { EnhancedResonanceEngine } from 'rbi-kernel/field/computation/enhanced-engine';
```

**❌ INCORRECT:**
```typescript
// Direct dist imports
import { FieldComputation } from 'rbi-kernel/dist/kernel.js';
import { ResonanceVectorMath } from 'rbi-kernel/dist/mathematics/index.js';

// Direct source imports
import { FieldComputation } from 'rbi-kernel/rbi_kernel_src/kernel.js';

// Relative path imports
import { FieldComputation } from '../RBI-Kernel/rbi_kernel_src/kernel.js';
```

### Rule 2: S2S_Console Must Not Import RBI-Kernel

**✅ CORRECT:**
```typescript
// S2S_Console should use orbital-brain/types only
import type { ContentMetadata, RBIOutput } from 'orbital-brain/types';
```

**❌ INCORRECT:**
```typescript
// S2S_Console must not import rbi-kernel
import { FieldComputation } from 'rbi-kernel';
```

### Rule 3: No Direct Source File Access

**✅ CORRECT:**
```typescript
// Use package exports
import { FieldComputation } from 'rbi-kernel';
```

**❌ INCORRECT:**
```typescript
// Do not access source files directly
import { FieldComputation } from '../RBI-Kernel/rbi_kernel_src/kernel.js';
import { FieldComputation } from 'rbi-kernel/rbi_kernel_src/kernel.js';
```

---

## Enforcement

### ESLint Rules

ESLint rules are configured in:
- `CMS_Backend/.eslintrc.json` - Prevents direct imports from rbi-kernel dist/source
- Project-specific overrides for S2S_Console

**Rule:** `no-restricted-imports`

**Patterns Blocked:**
- `rbi-kernel/dist/**`
- `rbi-kernel/rbi_kernel_src/**`
- `**/RBI-Kernel/rbi_kernel_src/**`
- `**/RBI-Kernel/dist/**`

### CI/CD Checks

(To be implemented if GitHub Actions is used)

**Checks:**
1. ESLint runs on all PRs
2. Boundary violation checks
3. S2S_Console import checks

---

## Package Exports

RBI-Kernel defines the following exports in `package.json`:

```json
{
  "exports": {
    ".": "./dist/kernel.js",
    "./mathematics": "./dist/mathematics/index.js",
    "./mathematics/resonance-vectors": "./dist/mathematics/resonance-vectors.js",
    "./mathematics/sovereign-logic": "./dist/mathematics/sovereign-logic.js",
    "./field": "./dist/field/computation/index.js",
    "./field/computation/enhanced-engine": "./dist/field/computation/enhanced-engine.js",
    "./field/computation/coherence-calculator": "./dist/field/computation/coherence-calculator.js",
    "./field/computation/field-operators": "./dist/field/computation/field-operators.js",
    "./runtime": "./dist/index.js"
  }
}
```

**Use these exports, not direct file paths.**

---

## Migration Notes

### Wrappers and Adapters

Some projects use wrapper modules that import from rbi-kernel:

**✅ CORRECT (Wrapper Pattern):**
```typescript
// CMS_Backend/lib/mathematics/enhanced-resonance-engine.ts
import { EnhancedResonanceEngine } from 'rbi-kernel';

export class EnhancedResonanceEngine {
  // Wrapper implementation
}
```

**✅ CORRECT (Adapter Pattern):**
```typescript
// CMS_Backend/lib/rbi/core/compute.ts
// Temporary adapter - may be moved to RBI-Kernel in future
export function calculateJaccardSimilarity<T>(arr1: T[], arr2: T[]): number {
  // Implementation
}
```

These patterns are acceptable as they provide backward compatibility and project-specific extensions.

---

## Violations

If you see a violation:

1. **ESLint Error:** Fix the import to use package exports
2. **CI/CD Failure:** Update the import and push again
3. **Manual Check:** Run `npm run lint` to catch violations

---

## Questions?

See `RBI_EXTRACTION_INQUIRY.md` for detailed architecture decisions and migration history.

