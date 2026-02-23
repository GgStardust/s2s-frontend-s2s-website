# RBI Extraction Inquiry & Implementation Plan

**Date:** 2025-12-22  
**Purpose:** Identify canonical RBI kernel, map lineage, design extraction strategy, and plan implementation  
**Status:** Complete Inquiry + Design + Safety Check + Implementation Plan

---

## Clarification: Extraction vs Embedding (Non-Destructive Intent)

This inquiry does not propose removing RBI or Orbital-Brain from any existing projects.

### Definitions

**"Extraction" in this document refers to:**
- Defining a clean, standalone RBI-Kernel package boundary for distribution and licensing
- Establishing clear product boundaries (what is RBI vs. what is not)
- Preparing RBI-Kernel for optional external distribution (npm, git, tarball)
- **NOT removing RBI-Kernel from any existing projects**

**Embedding (Intended Pattern):**
- RBI-Kernel and Orbital-Brain are intended to remain embedded in all internal projects via package dependencies
- Projects continue to depend on RBI-Kernel via package imports (`"rbi-kernel": "workspace:*"`)
- Orbital-Brain remains embedded as a consumer of RBI output
- Existing systems remain operational and intact

**Migration Intent:**
- Extended embeds (RBI-Architecture-Service) should migrate to use monorepo package dependency
- Legacy embeds (CMS_Backend/lib/rbi/core) should migrate to use monorepo package dependency
- These are no longer "frozen" - they should be fully available through the monorepo package

### Intent

- **Clean boundaries, not removal**
- **Canonical packaging, not architectural disruption**
- **Incremental migration from frozen snapshots to package dependency**
- **All existing integrations are intentional, owned, and preserved**
- **Goal: Clean boundaries + optional external distribution, NOT removal from existing systems**

---

## Authority Statement

**RBI-Kernel is the sole authoritative source for RBI computation logic.** Any duplicate logic outside the kernel must either (a) import from it via package dependency or (b) be explicitly marked as legacy/mock with documented removal timeline. This prevents future ambiguity and ensures all RBI implementations trace back to the canonical source.

---

## Phase 1: Inquiry & Analysis

**Date:** 2025-12-22  
**Status:** Complete  
**Purpose:** Identify canonical RBI kernel and map lineage across monorepo

---

## 1. Architecture Reference: Intended vs. Actual State

### Documented Architecture (S2S_SYSTEM_ARCHITECTURE.md)

**Intended Structure:**
```
RBI-Kernel (no dependencies)
    ↓
Orbital-Brain (depends on rbi-kernel)
    ↓
CMS_Backend (depends on rbi-kernel, orbital-brain)
S2S_Console (depends on orbital-brain/types only - NO rbi-kernel)
```

**Intended Package Dependencies:**
- `RBI-Kernel` - Core mathematical computation engine
- `Orbital-Brain` - Depends on `rbi-kernel` package
- `CMS_Backend` - Depends on `rbi-kernel` and `orbital-brain` packages
- `RBI-Architecture-Service` - Should follow same pattern

**Intended Import Patterns:**
- `import { FieldComputation } from 'rbi-kernel'` ✅
- `import { ResonanceVectorMath } from 'rbi-kernel'` ✅
- `import { EnhancedResonanceEngine } from 'rbi-kernel'` ✅

### Actual State Found

**Actual Structure:**
```
RBI-Kernel (canonical source)
    ↓
├─→ Orbital-Brain (✅ CORRECT - consumes RBI output, doesn't implement)
├─→ CMS_Backend/lib/mathematics/ (✅ CORRECT - wrapper importing from package)
├─→ CMS_Backend/lib/rbi/core/ (⚠️ DEVIATION - legacy embed, should migrate to package)
├─→ CMS_Backend/src/lib/rbi/kernel.ts (🎭 MOCK - intentionally temporary)
└─→ RBI-Architecture-Service/src/ (⚠️ DEVIATION - extended embed, should migrate to package)
```

**Gap Analysis:**

| Component | Intended | Actual | Status |
|-----------|----------|--------|--------|
| **RBI-Kernel** | Canonical source | ✅ Canonical source | ✅ MATCHES |
| **Orbital-Brain** | Consumer (package dependency) | ✅ Consumer (receives RBIOutput) | ✅ MATCHES |
| **CMS_Backend Console V3** | Uses rbi-kernel package | ✅ Uses wrapper importing from package | ✅ MATCHES |
| **CMS_Backend Book Compiler** | Should use rbi-kernel package | ⚠️ Uses legacy embed (should migrate) | ⚠️ DEVIATION |
| **CMS_Backend Field Console** | Should use rbi-kernel package | 🎭 Uses mock (intentionally temporary) | 🎭 INTENTIONAL |
| **RBI-Architecture-Service** | Should use rbi-kernel package | ⚠️ Uses extended embed (should migrate) | ⚠️ DEVIATION |

### Key Findings

1. **Core Architecture is Correct:**
   - RBI-Kernel is properly structured as canonical source
   - Orbital-Brain correctly consumes RBI output
   - CMS_Backend Console V3 correctly uses package dependency

2. **Deviations from Intended Architecture:**
   - **RBI-Architecture-Service:** Missing `rbi-kernel` package dependency, using extended embed (should migrate)
   - **CMS_Backend Book Compiler:** Using legacy embed instead of package (should migrate)
   - **CMS_Backend Field Console:** Using mock (intentional, but should migrate eventually)

3. **These Are Not Accidental Duplications:**
   - Extended embeds are **service-specific extensions** that should use canonical kernel + extensions
   - Legacy embeds are **frozen snapshots** that should migrate to package dependency
   - Mock implementation is **intentionally temporary** for MVP

4. **Extraction Readiness:**
   - Core RBI-Kernel is ready for extraction (matches documented architecture)
   - Deviations are in **application/runtime layers**, not core kernel
   - Migration can proceed without breaking working systems

---

## 2. Canonical Kernel Identification

### 🥇 RBI-Kernel/rbi_kernel_src/ - CANONICAL SOURCE

**Location:** `RBI-Kernel/rbi_kernel_src/`

**5-Layer Architecture Completeness:**
- ✅ **Layer 1 (Representation):** `field/representation/index.ts`
- ✅ **Layer 2 (Computation):** `field/computation/` - Complete
- ✅ **Layer 3 (Temporal):** `field/temporal/index.ts`
- ✅ **Layer 4 (Validation):** `field/validation/` - Complete
- ✅ **Layer 5 (Propagation):** `field/propagation/index.ts`
- ✅ **Mathematics Foundation:** `mathematics/` - Complete

**Orchestration Entry Point:**
- `kernel.ts` - Exports all 5 layers + Mathematics + Types + Metadata
- `index.ts` - Server entry point (Fastify REST API)

**Status:** ✅ **CANONICAL SOURCE** - Most complete, mathematically backed, documented

### Other Implementations

- **RBI-Architecture-Service/src/** - ⚠️ Extended embed (should migrate to package + extensions)
- **CMS_Backend/lib/mathematics/** - ✅ Wrapper layer (correct usage)
- **CMS_Backend/lib/rbi/core/** - ⚠️ Legacy embed (should migrate to package)
- **CMS_Backend/src/lib/rbi/kernel.ts** - 🎭 Mock (intentionally temporary)

---

## 3. Lineage Mapping

### RBI Flow Through Projects

```
RBI-Kernel (canonical source)
    ↓
├─→ Orbital-Brain (✅ Consumer only)
├─→ CMS_Backend/lib/mathematics/ (✅ Wrapper - correct)
├─→ RBI-Architecture-Service/ (⚠️ Extended embed - migrate)
├─→ CMS_Backend/lib/rbi/core/ (⚠️ Legacy embed - migrate)
└─→ CMS_Backend/src/lib/rbi/kernel.ts (🎭 Mock - temporary)
```

**Migration Targets:**
- RBI-Architecture-Service: Migrate to `rbi-kernel` package, keep service-specific extensions
- CMS_Backend/lib/rbi/core: Migrate to `rbi-kernel` package (legacy embed - see Decision Record)
- CMS_Backend/src/lib/rbi/kernel.ts: Migrate when field-console ready (mock - see Decision Record)

**Decision Record: Legacy + Mock Lifetimes**

**CMS_Backend/lib/rbi/core/ (Legacy Embed):**
- **Expected Removal:** After book-compiler and API routes migration complete (Phase 2.5.2)
- **Replacement:** Direct import from `rbi-kernel` package
- **Status:** Actively used, migrate before removal

**CMS_Backend/src/lib/rbi/kernel.ts (Mock Implementation):**
- **Expected Removal:** When field-console UI is ready for production (low priority)
- **Replacement:** Direct import from `rbi-kernel` package or adapter layer
- **Status:** Intentionally temporary for MVP prototyping

---

## 4. Stability Assessment

### Actively Depended On (DO NOT TOUCH)

**Production/Stable Systems:**
- ✅ `CMS_Backend/lib/services/console-v3/*` - Production Console V3 (correct usage)
- ✅ `CMS_Backend/lib/mathematics/*` - Correct wrapper layer
- ⚠️ `CMS_Backend/lib/rbi/core/*` - Legacy but actively used (migrate, don't remove)
- ⚠️ `CMS_Backend/app/api/ai/*` - API routes in use (migrate, don't remove)
- ⚠️ `RBI-Architecture-Service/src/server/*` - Active service (migrate, don't remove)

**Experimental/Prototype (SAFE TO MODIFY):**
- 🎭 `CMS_Backend/src/lib/rbi/kernel.ts` - Mock, documented as temporary
- 🎭 `CMS_Backend/components/field-console/*` - Prototype/MVP

---

## 5. Extraction Readiness

### ✅ Ready for Extraction

**Core Kernel:**
- `RBI-Kernel/rbi_kernel_src/kernel.ts` - Main entry point
- `RBI-Kernel/rbi_kernel_src/field/` - All 5 layers
- `RBI-Kernel/rbi_kernel_src/mathematics/` - Math foundations
- `RBI-Kernel/rbi_kernel_src/types.ts` - Type definitions
- `RBI-Kernel/rbi_kernel_src/metadata/` - Format parsers

**Dependencies:** Only `fastify` (for optional server mode) - Pure computation

### ❌ Keep in Projects

**Service-Specific Extensions:**
- RBI-Architecture-Service: Boundary validators, time-series analyzers, stabilization engines

**Application-Specific Adapters:**
- CMS_Backend/lib/mathematics/ - Singleton wrapper (keep as adapter)

### ⚠️ Remove After Migration

- RBI-Architecture-Service: Core kernel directories (after import migration)
- CMS_Backend/lib/rbi/core/ (after book-compiler migration - see Decision Record in Lineage Mapping section for details)

---

## Phase 2: Design Proposal

**Date:** 2025-12-22  
**Status:** Complete  
**Purpose:** Propose clean RBI product boundary and non-breaking extraction strategy

---

## 2.1 Clean RBI Product Boundary

### What IS RBI (Core Kernel)

**RBI-Kernel is:**
- Field-level coherence computation
- 5-layer architecture (Representation, Computation, Temporal, Validation, Propagation)
- Mathematics foundation (Resonance vectors, sovereign logic)
- Proof-of-Meaning verification
- Pure computation (no infrastructure dependencies)

**RBI-Kernel provides:**
- `FieldComputation`, `FieldValidation`, `FieldRepresentation`, `TemporalContinuity`, `FieldPropagation`
- `Mathematics` (ResonanceVectorMath, SovereignLogic)
- `Types` (All TypeScript type definitions)
- `Metadata` (Format parsers)

### What is NOT RBI

- Runtime/Infrastructure (HTTP servers, REST APIs, middleware, caching)
- Service-Specific Extensions (domain validators, time-series analyzers)
- Application-Specific Adapters (singleton wrappers, UI interfaces)
- Domain Logic (S2S-specific Orb system, book compiler rules)

**Key Principle:** RBI-Kernel is a **computation library**, not a service, not an application.

---

## 2.2 Non-Breaking Extraction Strategy

### Recommended Approach: Workspace Package Dependency

**Strategy:** Continue using pnpm workspace dependency pattern.

**Current State:**
- `CMS_Backend/package.json`: `"rbi-kernel": "file:../RBI-Kernel"` ✅
- `Orbital-Brain/package.json`: Has dependency ✅
- `RBI-Architecture-Service/package.json`: Missing dependency ❌

**After Extraction:**
- All projects use: `"rbi-kernel": "workspace:*"` (or `"file:../RBI-Kernel"`)
- RBI-Kernel has proper `package.json` with correct `main` and `exports`
- No breaking changes to existing imports

**Advantages:**
- ✅ Non-breaking (projects already use this pattern)
- ✅ Works with current monorepo structure
- ✅ Simple migration path

---

## 2.3 Two-Track Model

### Track A: Embedded RBI (Existing Projects)

**Purpose:** RBI-Kernel continues powering all existing projects via package dependency.

**Projects:**
- CMS_Backend, RBI-Architecture-Service, Orbital-Brain, S2S_Console

**Status:** ✅ **PRESERVED** - All existing integrations continue working

### Track B: Standalone RBI Product

**Purpose:** RBI-Kernel becomes a licensable, standalone product.

**Distribution:**
- Published as `@rbi/kernel` on npm (if desired)
- Or distributed as workspace package (current)
- Or distributed as git submodule or tarball

**Status:** ⏳ **TO BE CREATED** - Clean package from RBI-Kernel/rbi_kernel_src/

**Both tracks use the same source** - No duplication required.

**Commercial Intent Lock:** Internal projects will always embed RBI via workspace dependency; external commercialization will distribute the same kernel without altering internal usage.

---

## 2.4 Package Structure Proposal

### Package.json Configuration

```json
{
  "name": "rbi-kernel",
  "version": "1.0.0",
  "type": "module",
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
    },
    "./runtime": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

**Note:** Current `package.json` has `"main": "dist/index.js"` (server). Should change to `"main": "dist/kernel.js"` (library).

---

## 2.5 Integration Patterns

### Pattern 1: Direct Import (Recommended)

```typescript
import { FieldComputation, FieldValidation, Mathematics } from 'rbi-kernel';
```

### Pattern 2: Adapter Layer (For Existing Code)

```typescript
// lib/mathematics/enhanced-resonance-engine.ts (adapter)
import { EnhancedResonanceEngine as RBIEngine } from 'rbi-kernel';

export class EnhancedResonanceEngine {
  // Singleton wrapper delegating to RBI-Kernel
}
```

### Pattern 3: Service Extension

```typescript
// Import core from package
import { FieldValidation } from 'rbi-kernel';

// Add service-specific extensions
import { BoundaryValidator } from './field/validation/boundary-validator';
```

---

## Phase 0.5: Pre-Migration Verification

**Date:** 2025-12-22  
**Status:** Required Before Any Migration  
**Purpose:** Verify technical prerequisites before starting migration

---

## 0.5.1 Build Verification

### Checklist

- [ ] **Verify RBI-Kernel builds correctly:**
  ```bash
  cd RBI-Kernel
  npm run build
  ```
  - [ ] `dist/kernel.js` exists
  - [ ] `dist/index.js` exists (server entry)
  - [ ] Type definitions (`.d.ts`) generated
  - [ ] No build errors

- [ ] **Verify TypeScript configuration:**
  - [ ] `tsconfig.json` compiles without errors
  - [ ] Module resolution works correctly
  - [ ] Type exports are accessible

- [ ] **Verify package.json structure:**
  - [ ] `main` field points to correct entry
  - [ ] `exports` field configured (if needed)
  - [ ] `types` field points to type definitions

---

## 0.5.2 Workspace Protocol Verification

### Checklist

- [ ] **Verify pnpm workspace resolution:**
  ```bash
  cd RBI-Kernel
  pnpm install
  cd ../CMS_Backend
  pnpm install
  ```
  - [ ] Workspace dependency resolves correctly
  - [ ] No version conflicts
  - [ ] Symlinks created correctly

- [ ] **Test import resolution:**
  ```typescript
  // In CMS_Backend, test import
  import { FieldComputation } from 'rbi-kernel';
  ```
  - [ ] Import resolves without errors
  - [ ] Types are accessible
  - [ ] No module resolution errors

- [ ] **Verify workspace protocol syntax:**
  - [ ] `"rbi-kernel": "workspace:*"` works
  - [ ] `"rbi-kernel": "file:../RBI-Kernel"` works (backward compatible)
  - [ ] Both resolve to same package

---

## 0.5.3 Export Verification

### Checklist

- [ ] **Verify all exports are accessible:**
  ```typescript
  import { 
    FieldComputation, 
    FieldValidation, 
    FieldRepresentation,
    TemporalContinuity,
    FieldPropagation,
    Mathematics,
    EnhancedResonanceEngine
  } from 'rbi-kernel';
  ```
  - [ ] All exports resolve
  - [ ] Types are correct
  - [ ] No missing exports

- [ ] **Verify subpath exports (if configured):**
  ```typescript
  import { ResonanceVectorMath } from 'rbi-kernel/mathematics';
  ```
  - [ ] Subpath exports work
  - [ ] Types resolve correctly

- [ ] **Verify ContentMetadata type export:**
  ```typescript
  import type { ContentMetadata } from 'rbi-kernel';
  ```
  - [ ] Type is accessible
  - [ ] Type definition is correct

---

## 0.5.4 Test Suite Verification

### Checklist

- [ ] **Run existing RBI-Kernel tests:**
  ```bash
  cd RBI-Kernel
  npm test  # If tests exist
  ```
  - [ ] All tests pass
  - [ ] No regressions

- [ ] **Run CMS_Backend tests that use RBI:**
  ```bash
  cd CMS_Backend
  npm test
  ```
  - [ ] Tests that import from `rbi-kernel` pass
  - [ ] No import errors

- [ ] **Verify test coverage:**
  - [ ] Core functions have test coverage
  - [ ] Migration won't break existing tests

---

## 0.5.5 CI/CD Verification

### Checklist

- [ ] **Verify build pipeline:**
  - [ ] CI builds RBI-Kernel correctly
  - [ ] CI builds dependent projects correctly
  - [ ] Build order is correct (RBI-Kernel → Orbital-Brain → CMS_Backend)

- [ ] **Verify deployment:**
  - [ ] Vercel build works with workspace dependencies
  - [ ] Production builds succeed
  - [ ] No deployment regressions

---

## 0.5.6 Function Availability Verification

### Checklist

- [ ] **Verify required functions exist in RBI-Kernel:**
  - [x] `computeResonance` - ✅ Available
  - [x] `scoreVectors` - ✅ Available
  - [x] `normalizeVector` - ✅ Available in `coherence-calculator.ts`
  - [x] `findNeighbors` - ✅ Available
  - [x] `calculateTextSimilarity` - ✅ Available
  - [ ] `calculateJaccardSimilarity` (for arrays) - ⚠️ Needs adapter (see Phase 3)

- [ ] **Create adapter for missing function:**
  - [ ] Create `calculateJaccardSimilarity` adapter in `CMS_Backend/lib/rbi/core/` (temporary)
  - [ ] Or verify alternative approach in RBI-Kernel

---

## Phase 2.5: Migration Execution Templates

**Date:** 2025-12-22  
**Status:** Ready for Use  
**Purpose:** Step-by-step templates for executing migrations

---

## 2.5.1 RBI-Architecture-Service Migration Template

### Pre-Migration Checklist

- [ ] Phase 0.5 verification complete
- [ ] Backup current code (git commit)
- [ ] Create feature branch: `migrate/rbi-architecture-service-to-package`

### Step 1: Add Package Dependency

**File:** `RBI-Architecture-Service/package.json`

```json
{
  "dependencies": {
    "rbi-kernel": "workspace:*"
  }
}
```

**Action:**
1. Add dependency to `package.json`
2. Run `pnpm install`
3. Verify dependency resolves

**Verification:**
- [ ] `pnpm install` succeeds
- [ ] `node_modules/rbi-kernel` exists (symlink)
- [ ] No dependency conflicts

---

### Step 2: Update Core Imports

**Files to Update:**
- `src/server/server.ts` (line 10)
- `src/server/orchestration/temporal-loop.ts` (line 6)

**Change:**
```typescript
// Before
import { FieldComputation, FieldValidation, Mathematics } from '../kernel.js';

// After
import { FieldComputation, FieldValidation, Mathematics } from 'rbi-kernel';
```

**Action:**
1. Update imports one file at a time
2. Test after each file
3. Verify no TypeScript errors

**Verification:**
- [ ] TypeScript compiles without errors
- [ ] Imports resolve correctly
- [ ] No runtime errors

---

### Step 3: Update Type Imports

**Files to Update:**
- `src/server/utils/content-detector.ts` (line 10)
- `src/server/server.ts` (line 52)
- `src/metadata/*.ts` (4 files)

**Change:**
```typescript
// Before
import type { ContentMetadata } from '../../field/computation/enhanced-engine.js';

// After
import type { ContentMetadata } from 'rbi-kernel';
```

**Action:**
1. Update type imports
2. Verify types are accessible
3. Test compilation

**Verification:**
- [ ] Types resolve correctly
- [ ] No type errors
- [ ] Type definitions match

---

### Step 4: Update Mathematics Imports

**Files to Update:**
- `src/server/baseline/baseline-manager.ts` (line 11)
- `src/field/temporal/timeseries-analyzer.ts` (line 12)
- `src/field/computation/global-field.ts` (line 12)
- `src/field/validation/proof-of-meaning.ts` (line 10)

**Change:**
```typescript
// Before
import * as Mathematics from '../../mathematics/index.js';

// After
import * as Mathematics from 'rbi-kernel';
```

**Action:**
1. Update mathematics imports
2. Test each file individually
3. Verify functionality preserved

**Verification:**
- [ ] Mathematics namespace accessible
- [ ] Functions work correctly
- [ ] No runtime errors

---

### Step 5: Update Internal Computation Imports

**Files to Update:**
- `src/field/computation/field-operators.ts`
- `src/field/computation/coherence-calculator.ts`
- `src/field/computation/enhanced-engine.ts`

**Change:**
```typescript
// Before
import { ResonanceVectorMath } from '../../mathematics/resonance-vectors.js';

// After
import { ResonanceVectorMath } from 'rbi-kernel';
```

**Action:**
1. Update internal imports
2. Test computation functions
3. Verify no breaking changes

**Verification:**
- [ ] Computation functions work
- [ ] No performance regressions
- [ ] Results match previous behavior

---

### Step 6: Test Service

**Action:**
1. Start service: `npm run dev`
2. Test all endpoints
3. Verify functionality

**Verification:**
- [ ] Service starts without errors
- [ ] All endpoints respond
- [ ] RBI computation works correctly
- [ ] No performance regressions

---

### Step 7: Remove Core Directories (After Verification)

**Only after all imports migrated and tested:**

**Directories to Remove:**
- `src/field/computation/` (core - keep service-specific extensions)
- `src/mathematics/` (core)
- `src/rbi_architecture_kernel.ts`

**Action:**
1. Remove core directories
2. Verify service still works
3. Run full test suite

**Verification:**
- [ ] Service still works
- [ ] No broken imports
- [ ] All tests pass

---

## 2.5.2 CMS_Backend Book Compiler Migration Template

### Pre-Migration Checklist

- [ ] Phase 0.5 verification complete
- [ ] Backup current code (git commit)
- [ ] Create feature branch: `migrate/cms-backend-book-compiler-to-package`

### Step 1: Create calculateJaccardSimilarity Adapter

**File:** `CMS_Backend/lib/rbi/core/jaccard-adapter.ts` (temporary)

```typescript
/**
 * Temporary adapter for calculateJaccardSimilarity (arrays)
 * TODO: Evaluate if this should be added to RBI-Kernel
 */
export function calculateJaccardSimilarity<T>(arr1: T[], arr2: T[]): number {
  if (arr1.length === 0 && arr2.length === 0) return 1;
  if (arr1.length === 0 || arr2.length === 0) return 0;
  
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...arr1, ...arr2]);
  
  return intersection.size / union.size;
}
```

**Action:**
1. Create adapter file
2. Export from `lib/rbi/core/index.ts` (temporary)
3. Test adapter function

**Verification:**
- [ ] Adapter function works correctly
- [ ] Matches legacy embed behavior
- [ ] Tests pass

---

### Step 2: Update Book Compiler Imports

**Files to Update:**
- `lib/book-compiler/editorial/gap-detection.ts`
- `lib/book-compiler/orbital/narrative-generation.ts`
- `lib/book-compiler/rbi/discovery.ts`
- `lib/book-compiler/rbi/ordering.ts`

**Change:**
```typescript
// Before
import { computeResonance } from '@/lib/rbi/core/compute.js';
import { findNeighbors } from '@/lib/rbi/core/index.js';

// After
import { computeResonance, findNeighbors } from 'rbi-kernel';
import { calculateJaccardSimilarity } from '@/lib/rbi/core/jaccard-adapter'; // Temporary
```

**Action:**
1. Update imports one file at a time
2. Test after each file
3. Verify book compiler functionality

**Verification:**
- [ ] Book compiler builds without errors
- [ ] Book compilation works
- [ ] No functionality regressions

---

### Step 3: Test Book Compiler

**Action:**
1. Run book compiler on test content
2. Verify output matches previous behavior
3. Check for any regressions

**Verification:**
- [ ] Book compiler produces correct output
- [ ] Resonance calculations match
- [ ] No errors or warnings

---

### Step 4: Update API Route Imports

**Files to Update:**
- `app/api/ai/resonance-source-selection/route.ts`
- `app/api/ai/merge-chapter/route.ts`
- `app/api/resonance/discover/route.ts`

**Change:**
```typescript
// Before
import { computeResonance, calculateJaccardSimilarity } from '@/lib/rbi/core';

// After
import { computeResonance } from 'rbi-kernel';
import { calculateJaccardSimilarity } from '@/lib/rbi/core/jaccard-adapter'; // Temporary
```

**Action:**
1. Update API route imports
2. Test each endpoint
3. Verify API responses

**Verification:**
- [ ] API routes compile without errors
- [ ] Endpoints respond correctly
- [ ] RBI calculations work

---

### Step 5: Update Field Sensing

**File:** `lib/rbi/field-sensing.ts`

**Change:**
```typescript
// Before
import { computeResonance } from '../rbi/core';

// After
import { computeResonance } from 'rbi-kernel';
```

**Action:**
1. Update import
2. Test field sensing functionality
3. Verify no regressions

**Verification:**
- [ ] Field sensing works correctly
- [ ] No errors

---

### Step 6: Remove Legacy Embed (After All Migrations)

**Only after all imports migrated and tested:**

**Directories to Remove:**
- `lib/rbi/core/compute.ts`
- `lib/rbi/core/neighbors.ts`
- `lib/rbi/core/index.ts` (keep jaccard-adapter.ts temporarily)

**Action:**
1. Remove legacy files
2. Update `lib/rbi/core/index.ts` to only export adapter
3. Run full test suite

**Verification:**
- [ ] All imports still work
- [ ] No broken references
- [ ] All tests pass

---

## Phase 3: Safety Check

**Date:** 2025-12-22  
**Status:** Complete  
**Purpose:** Verify what would break before any refactoring

---

## 3.1 Dependency Analysis Summary

### RBI-Architecture-Service

**Total Imports:** 28 files importing from extended embed

**Migration Risk:** LOW - All imports can be updated incrementally

**Key Imports:**
- `src/server/server.ts` - Core kernel imports
- `src/server/utils/content-detector.ts` - Type imports
- `src/metadata/*.ts` - Type imports
- `src/server/baseline/baseline-manager.ts` - Mathematics imports

### CMS_Backend Legacy Embed

**Total Imports:** 9 files importing from `lib/rbi/core/`

**Migration Risk:** MEDIUM - Requires testing book-compiler and API routes

**Key Imports:**
- `lib/book-compiler/` (4 files)
- `app/api/ai/` routes (2 files)
- `app/api/resonance/` (1 file)
- `lib/rbi/field-sensing.ts` (1 file)

### CMS_Backend Mock

**Total Imports:** 9 files importing from `src/lib/rbi/`

**Migration Risk:** LOW - Mock is intentionally temporary

**Key Imports:**
- `components/field-console/*` (6 React components)
- Type imports (2 files)

---

## 3.2 API Compatibility Check

### ✅ Compatible

- `computeResonance` - ✅ Available
- `scoreVectors` - ✅ Available
- `normalizeVector` - ✅ Available
- `findNeighbors` - ✅ Available
- `calculateTextSimilarity` - ✅ Available
- All types - ✅ Available

### ⚠️ Needs Adapter

- `calculateJaccardSimilarity` (for arrays) - ⚠️ Not in RBI-Kernel
  - **Solution:** Create temporary adapter (see Phase 2.5.2)

---

## 3.3 Safety Summary

### Safe to Migrate (Low Risk)

1. RBI-Architecture-Service core imports
2. CMS_Backend book-compiler imports (with adapter)
3. CMS_Backend API route imports (with adapter)

### Needs Verification (Medium Risk)

1. Book compiler functionality - Test after migration
2. API route functionality - Test after migration

### Can Wait (Low Priority)

1. CMS_Backend field-console mock - Intentionally temporary

### Do Not Remove Until Verified

1. RBI-Architecture-Service core directories - Remove only after imports migrated
2. CMS_Backend lib/rbi/core/ - Remove only after book-compiler and API routes migrated
3. CMS_Backend src/lib/rbi/kernel.ts - Remove only after field-console migrated

---

## Phase 4: Boundary Enforcement

**Date:** 2025-12-22  
**Status:** Implementation Plan  
**Purpose:** Prevent future boundary violations and maintain clean architecture

---

## 4.1 ESLint Rules

### Rule: Prevent Direct RBI-Kernel Imports in Wrong Places

**File:** `.eslintrc.js` (or equivalent)

```javascript
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'rbi-kernel',
            message: 'S2S_Console must not import RBI-Kernel directly. Use orbital-brain/types only.',
            allowTypeImports: false,
          },
        ],
        patterns: [
          {
            group: ['**/RBI-Kernel/**'],
            message: 'Do not import directly from RBI-Kernel source. Use rbi-kernel package instead.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['S2S_Console/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'rbi-kernel',
                message: 'S2S_Console must not import RBI-Kernel. Use orbital-brain/types only.',
              },
            ],
          },
        ],
      },
    },
  ],
};
```

**Action:**
1. Add ESLint rule to root `.eslintrc.js`
2. Add project-specific overrides
3. Test rule enforcement

**Verification:**
- [ ] ESLint catches violations
- [ ] CI fails on violations
- [ ] Rule is documented

---

## 4.2 CI/CD Checks

### GitHub Actions / CI Pipeline

**File:** `.github/workflows/boundary-check.yml`

```yaml
name: Boundary Enforcement

on: [push, pull_request]

jobs:
  boundary-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm run lint
      - name: Check S2S_Console imports
        run: |
          if grep -r "from 'rbi-kernel'" S2S_Console/; then
            echo "ERROR: S2S_Console must not import rbi-kernel"
            exit 1
          fi
      - name: Check for direct RBI-Kernel source imports
        run: |
          if grep -r "from.*RBI-Kernel/rbi_kernel_src" --exclude-dir=node_modules .; then
            echo "ERROR: Do not import directly from RBI-Kernel source"
            exit 1
          fi
```

**Action:**
1. Create CI workflow
2. Add boundary checks
3. Test workflow

**Verification:**
- [ ] CI catches violations
- [ ] PRs fail on violations
- [ ] Workflow is documented

---

## 4.3 Documentation

### Architecture Decision Record

**File:** `docs/ARCHITECTURE_DECISIONS.md`

```markdown
## ADR-001: RBI-Kernel Package Boundary

**Status:** Accepted  
**Date:** 2025-12-22

### Context

RBI-Kernel must be used as a package dependency, not imported directly from source.

### Decision

- All projects must import from `rbi-kernel` package
- No direct imports from `RBI-Kernel/rbi_kernel_src/`
- S2S_Console must not import `rbi-kernel` (use `orbital-brain/types` only)

### Consequences

- Clean package boundaries
- Easier maintenance
- Clear dependency graph
```

**Action:**
1. Create ADR document
2. Document boundary rules
3. Add to project documentation

**Verification:**
- [ ] ADR is created
- [ ] Rules are documented
- [ ] Team is aware

---

## 4.4 TypeScript Path Mapping

### tsconfig.json Configuration

**File:** `tsconfig.json` (root or project-specific)

```json
{
  "compilerOptions": {
    "paths": {
      "rbi-kernel": ["./RBI-Kernel/dist/kernel.js"],
      "rbi-kernel/*": ["./RBI-Kernel/dist/*"]
    }
  }
}
```

**Action:**
1. Configure TypeScript paths
2. Verify path resolution
3. Test imports

**Verification:**
- [ ] TypeScript resolves paths correctly
- [ ] IDE autocomplete works
- [ ] No resolution errors

---

## Phase 5: Post-Migration Verification

**Date:** 2025-12-22  
**Status:** Verification Checklist  
**Purpose:** Verify migration success and system health

---

## 5.1 Functional Verification

### Checklist

- [ ] **RBI-Architecture-Service:**
  - [ ] Service starts without errors
  - [ ] All endpoints respond correctly
  - [ ] RBI computation works
  - [ ] No performance regressions

- [ ] **CMS_Backend Book Compiler:**
  - [ ] Book compilation works
  - [ ] Resonance calculations match previous behavior
  - [ ] No errors or warnings

- [ ] **CMS_Backend API Routes:**
  - [ ] All API endpoints work
  - [ ] RBI calculations correct
  - [ ] Response times acceptable

- [ ] **CMS_Backend Console V3:**
  - [ ] Console services work (already using package)
  - [ ] No regressions

---

## 5.2 Performance Verification

### Checklist

- [ ] **Baseline Metrics:**
  - [ ] Record baseline performance metrics before migration
  - [ ] Compare after migration
  - [ ] Verify no significant degradation

- [ ] **Key Metrics:**
  - [ ] API response times
  - [ ] Book compilation time
  - [ ] RBI computation time
  - [ ] Memory usage

- [ ] **Performance Tests:**
  - [ ] Run performance test suite
  - [ ] Compare results
  - [ ] Document any changes

---

## 5.3 Test Coverage Verification

### Checklist

- [ ] **Test Suite:**
  - [ ] All existing tests pass
  - [ ] No test failures
  - [ ] Test coverage maintained

- [ ] **New Tests:**
  - [ ] Add tests for adapter functions (if created)
  - [ ] Add tests for migration paths
  - [ ] Verify test coverage

- [ ] **Integration Tests:**
  - [ ] Run integration test suite
  - [ ] Verify end-to-end functionality
  - [ ] Document test results

---

## 5.4 Documentation Verification

### Checklist

- [ ] **Updated Documentation:**
  - [ ] Migration guide updated
  - [ ] Architecture documentation updated
  - [ ] API documentation updated (if needed)

- [ ] **New Documentation:**
  - [ ] Boundary enforcement rules documented
  - [ ] Adapter functions documented (if created)
  - [ ] Migration notes documented

- [ ] **Documentation Review:**
  - [ ] All documentation is accurate
  - [ ] Examples work
  - [ ] Links are valid

---

## 5.5 CI/CD Verification

### Checklist

- [ ] **Build Pipeline:**
  - [ ] CI builds succeed
  - [ ] Build times acceptable
  - [ ] No build errors

- [ ] **Deployment:**
  - [ ] Production builds work
  - [ ] Vercel deployment succeeds
  - [ ] No deployment errors

- [ ] **Boundary Checks:**
  - [ ] ESLint rules enforced
  - [ ] CI boundary checks pass
  - [ ] No violations

---

## 5.6 Cleanup Verification

### Checklist

- [ ] **Removed Code:**
  - [ ] Extended embeds removed (after migration)
  - [ ] Legacy embeds removed (after migration)
  - [ ] No orphaned files

- [ ] **Git History:**
  - [ ] Migration commits are clear
  - [ ] Rollback points identified
  - [ ] History is clean

- [ ] **Package Dependencies:**
  - [ ] All projects have `rbi-kernel` dependency
  - [ ] No duplicate dependencies
  - [ ] Workspace protocol works

---

## Success Criteria

### Phase 0.5 Complete When:
- ✅ All pre-migration verifications pass
- ✅ Build outputs verified
- ✅ Workspace protocol verified
- ✅ Exports verified

### Phase 2.5 Complete When:
- ✅ RBI-Architecture-Service migrated to package
- ✅ CMS_Backend book-compiler migrated to package
- ✅ CMS_Backend API routes migrated to package
- ✅ All tests pass
- ✅ No regressions

### Phase 4 Complete When:
- ✅ ESLint rules configured
- ✅ CI checks implemented
- ✅ Documentation updated
- ✅ Boundary enforcement active

### Phase 5 Complete When:
- ✅ All functional verifications pass
- ✅ Performance verified
- ✅ Test coverage maintained
- ✅ Documentation complete
- ✅ CI/CD verified
- ✅ Cleanup complete

---

## Migration Priority Order

1. **Phase 0.5: Pre-Migration Verification** (Required first)
2. **Phase 2A: Package Configuration** (Low risk, quick)
3. **Phase 2B: Add Missing Dependencies** (Low risk, quick)
4. **RBI-Architecture-Service Migration** (Isolated, low risk)
5. **CMS_Backend Book Compiler Migration** (Medium risk, requires testing)
6. **CMS_Backend API Routes Migration** (Medium risk, requires testing)
7. **Phase 4: Boundary Enforcement** (Can be done in parallel)
8. **Phase 5: Post-Migration Verification** (After all migrations)
9. **Cleanup** (After verification complete)

---

## Rollback Plan

### If Migration Fails

1. **Revert Git Commits:**
   ```bash
   git revert <migration-commit-hash>
   ```

2. **Restore Package Dependencies:**
   - Revert `package.json` changes
   - Run `pnpm install`

3. **Restore Imports:**
   - Revert import changes
   - Restore extended/legacy embeds if removed

4. **Verify System:**
   - Test all systems
   - Verify no regressions
   - Document issues

### Rollback Points

- After Phase 0.5: Before any code changes
- After Phase 2A: Package.json changes only
- After Phase 2B: Dependency additions only
- After each migration: Individual project rollback possible

---

**End of RBI Extraction Inquiry & Implementation Plan**
