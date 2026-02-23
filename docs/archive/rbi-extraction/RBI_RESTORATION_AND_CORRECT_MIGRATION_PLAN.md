# RBI Restoration and Correct Migration Plan

**Date:** 2025-12-22  
**Status:** CRITICAL - Correcting Previous Migration Direction  
**Purpose:** Restore any deleted code and execute correct migration (RBI-Architecture-Service → RBI-Kernel)

---

## Executive Summary

**Previous Migration (INCORRECT):**
- Assumed RBI-Kernel was the complete source
- Migrated RBI-Architecture-Service to import from RBI-Kernel
- Removed "duplicate" directories from RBI-Architecture-Service

**Actual State:**
- RBI-Architecture-Service has MORE complete implementations (Layers 3, 4, 5)
- RBI-Kernel is incomplete (only Layers 2, 4 partially implemented)
- Complete implementations were NOT deleted (still in RBI-Architecture-Service)

**Correct Strategy:**
- Move complete implementations FROM RBI-Architecture-Service TO RBI-Kernel
- Then RBI-Architecture-Service imports from RBI-Kernel (already done, just verify)

---

## What Was Deleted (Phase 6)

### ✅ Correctly Removed (No Restoration Needed)
1. **`RBI-Architecture-Service/src/mathematics/`** ✅
   - `resonance-vectors.ts` - Already in RBI-Kernel ✅
   - `sovereign-logic.ts` - Already in RBI-Kernel ✅
   - `index.ts` - Already in RBI-Kernel ✅
   - **Status:** Correctly removed, RBI-Kernel has these

2. **`RBI-Architecture-Service/src/kernel.ts`** (or `rbi_architecture_kernel.ts`) ✅
   - Duplicate entry point, not imported anywhere
   - **Status:** Correctly removed, not needed

### ✅ Still Present (Need to Move to RBI-Kernel)
1. **`RBI-Architecture-Service/src/field/temporal/timeseries-analyzer.ts`** ⭐
   - Complete Layer 3 implementation (347 lines)
   - **Action:** Move to `RBI-Kernel/rbi_kernel_src/field/temporal/`

2. **`RBI-Architecture-Service/src/field/propagation/*`** ⭐
   - `propagation-engine.ts` (59 lines)
   - `diffusion-algorithm.ts` (89 lines)
   - `wave-algorithm.ts` (107 lines)
   - `relationship-graph.ts` (113 lines)
   - **Action:** Move to `RBI-Kernel/rbi_kernel_src/field/propagation/`

3. **`RBI-Architecture-Service/src/field/computation/global-field.ts`** ⭐
   - Multi-input global field computation (190 lines)
   - **Action:** Move to `RBI-Kernel/rbi_kernel_src/field/computation/`

4. **`RBI-Architecture-Service/src/field/validation/boundary-validator.ts`** ⭐
   - Boundary validation framework (274 lines)
   - **Action:** Move to `RBI-Kernel/rbi_kernel_src/field/validation/`

5. **`RBI-Architecture-Service/src/field/stabilization/*`** ⭐
   - `stabilization-engine.ts` (110 lines)
   - `drift-detector.ts` (75 lines)
   - `threshold-strategy.ts` (49 lines)
   - **Action:** Move to `RBI-Kernel/rbi_kernel_src/field/stabilization/` (or integrate into temporal layer)

6. **`RBI-Architecture-Service/src/field/validation/validators/`** ⭐
   - Sector-specific validators (finance, cybersecurity, AI platforms)
   - **Action:** Keep as service extensions OR move base validator to RBI-Kernel

---

## Restoration Plan

### Phase R0: Verification (No Restoration Needed)

**Status:** ✅ VERIFIED - No restoration needed

**Findings:**
- Mathematics files correctly removed (exist in RBI-Kernel)
- Kernel.ts correctly removed (not needed)
- Complete layer implementations still exist in RBI-Architecture-Service
- No code was incorrectly deleted

**Action:** Proceed to migration plan

---

## Correct Migration Plan

### Phase M1: Pre-Migration Verification

**Purpose:** Verify current state before moving code

**Actions:**
1. **Verify Monorepo Structure:**
   - Verify `pnpm-workspace.yaml` includes both `RBI-Kernel` and `RBI-Architecture-Service`
   - Verify root `package.json` workspaces list (if used)
   - Verify workspace protocol: `pnpm install` from monorepo root
   - Verify workspace symlinks: `RBI-Architecture-Service/node_modules/rbi-kernel` exists
2. **Verify RBI-Kernel builds:** `cd RBI-Kernel && npm run build`
3. **Verify RBI-Architecture-Service builds:** `cd RBI-Architecture-Service && npm run build`
4. **Verify RBI-Architecture-Service tests pass**
5. **Verify workspace dependencies:**
   - RBI-Architecture-Service has `"rbi-kernel": "workspace:*"` in package.json
   - Workspace resolution works: `pnpm list --depth=0` shows rbi-kernel
6. **Document current layer implementations:**
   - RBI-Kernel: Layers 2, 4 (partial)
   - RBI-Architecture-Service: Layers 2, 3, 4, 5 (complete)
7. **Create backup branch:** `backup/pre-correct-migration`

**Success Criteria:**
- Monorepo structure verified
- Workspace dependencies resolved correctly
- Both projects build successfully
- All tests pass
- Current state documented
- Backup created

---

### Phase M2: Abstract S2S-Specific Terminology

**Purpose:** Remove domain-specific terms from core kernel interfaces

**Actions:**
1. Review `ContentMetadata` interface in RBI-Kernel:
   - Remove or abstract: `orb_associations`, `field_function`, `book_threading`, `integration_points`
   - Create generic alternatives (e.g., `associations`, `metadata`, `relationships`)
2. Review RBI-Architecture-Service extensions:
   - Keep `DecisionTrail` as service extension (not core)
   - Keep sector-specific validators as extensions
3. Update type definitions:
   - Create abstracted interfaces in RBI-Kernel
   - Maintain backward compatibility during migration
4. Document changes

**Success Criteria:**
- S2S-specific terms abstracted
- Generic interfaces created
- Backward compatibility maintained
- Changes documented

---

### Phase M3: Move Layer 3 (Temporal Continuity) to RBI-Kernel

**Purpose:** Move `timeseries-analyzer.ts` from RBI-Architecture-Service to RBI-Kernel

**Actions:**
1. Copy `RBI-Architecture-Service/src/field/temporal/timeseries-analyzer.ts` to `RBI-Kernel/rbi_kernel_src/field/temporal/timeseries-analyzer.ts`
2. Update imports in copied file:
   - Change `import * as FieldComputation from 'rbi-kernel'` → `import * as FieldComputation from '../computation/index.js'`
   - Change `import * as Mathematics from 'rbi-kernel'` → `import * as Mathematics from '../../mathematics/index.js'`
   - Update relative imports for types
3. Update `RBI-Kernel/rbi_kernel_src/field/temporal/index.ts`:
   - Export `analyzeTimeSeries` and types
4. Update `RBI-Kernel/rbi_kernel_src/kernel.ts`:
   - Ensure `TemporalContinuity` namespace exports correctly
5. Update RBI-Kernel package.json exports (if needed)
6. **Rebuild RBI-Kernel:** `cd RBI-Kernel && npm run build`
7. **Update workspace dependencies:**
   - Run `pnpm install` from monorepo root to update workspace symlinks
   - Verify `RBI-Architecture-Service/node_modules/rbi-kernel` symlink points to updated RBI-Kernel
8. Update RBI-Architecture-Service to import from RBI-Kernel:
   - Change `import { analyzeTimeSeries } from './timeseries-analyzer.js'` → `import { TemporalContinuity } from 'rbi-kernel'`
   - Update usage: `TemporalContinuity.analyzeTimeSeries(...)`
9. **Rebuild RBI-Architecture-Service:** `cd RBI-Architecture-Service && npm run build`
10. **Verify workspace resolution:**
    - Verify imports resolve correctly using `rbi-kernel` package
    - Verify TypeScript can resolve types from `rbi-kernel`
11. Run tests: Verify RBI-Architecture-Service tests pass

**Success Criteria:**
- Layer 3 code moved to RBI-Kernel
- RBI-Kernel builds successfully
- Workspace dependencies updated (`pnpm install` run)
- RBI-Architecture-Service imports from RBI-Kernel via workspace protocol
- RBI-Architecture-Service builds successfully
- Workspace resolution verified
- All tests pass

---

### Phase M4: Move Layer 5 (Propagation) to RBI-Kernel

**Purpose:** Move propagation engine and algorithms from RBI-Architecture-Service to RBI-Kernel

**Actions:**
1. Copy propagation files to RBI-Kernel:
   - `propagation-engine.ts` → `RBI-Kernel/rbi_kernel_src/field/propagation/propagation-engine.ts`
   - `diffusion-algorithm.ts` → `RBI-Kernel/rbi_kernel_src/field/propagation/diffusion-algorithm.ts`
   - `wave-algorithm.ts` → `RBI-Kernel/rbi_kernel_src/field/propagation/wave-algorithm.ts`
   - `relationship-graph.ts` → `RBI-Kernel/rbi_kernel_src/field/propagation/relationship-graph.ts`
2. Update imports in copied files:
   - Remove `rbi-kernel` imports (these are now internal)
   - Update relative imports for any dependencies
3. Update `RBI-Kernel/rbi_kernel_src/field/propagation/index.ts`:
   - Export all propagation components
4. Update `RBI-Kernel/rbi_kernel_src/kernel.ts`:
   - Ensure `FieldPropagation` namespace exports correctly
5. Update RBI-Kernel package.json exports (if needed)
6. **Rebuild RBI-Kernel:** `cd RBI-Kernel && npm run build`
7. **Update workspace dependencies:**
   - Run `pnpm install` from monorepo root to update workspace symlinks
   - Verify workspace resolution works
8. Update RBI-Architecture-Service to import from RBI-Kernel:
   - Change imports to use `FieldPropagation` from `rbi-kernel`
   - Update all usage sites
9. **Rebuild RBI-Architecture-Service:** `cd RBI-Architecture-Service && npm run build`
10. **Verify workspace resolution:**
    - Verify imports resolve correctly using `rbi-kernel` package
    - Verify TypeScript can resolve types from `rbi-kernel`
11. Run tests: Verify RBI-Architecture-Service tests pass

**Success Criteria:**
- Layer 5 code moved to RBI-Kernel
- RBI-Kernel builds successfully
- Workspace dependencies updated (`pnpm install` run)
- RBI-Architecture-Service imports from RBI-Kernel via workspace protocol
- RBI-Architecture-Service builds successfully
- Workspace resolution verified
- All tests pass

---

### Phase M5: Move Layer 2 Extension (global-field.ts) to RBI-Kernel

**Purpose:** Move `global-field.ts` from RBI-Architecture-Service to RBI-Kernel

**Actions:**
1. Copy `RBI-Architecture-Service/src/field/computation/global-field.ts` to `RBI-Kernel/rbi_kernel_src/field/computation/global-field.ts`
2. Update imports in copied file:
   - Change `import { EnhancedResonanceEngine } from './enhanced-engine.js'` → Keep (internal)
   - Change `import * as Mathematics from 'rbi-kernel'` → `import * as Mathematics from '../../mathematics/index.js'`
   - Update relative imports for types
3. Update `RBI-Kernel/rbi_kernel_src/field/computation/index.ts`:
   - Export `analyzeGlobalField` and types
4. **Rebuild RBI-Kernel:** `cd RBI-Kernel && npm run build`
5. **Update workspace dependencies:**
   - Run `pnpm install` from monorepo root to update workspace symlinks
   - Verify workspace resolution works
6. Update RBI-Architecture-Service to import from RBI-Kernel:
   - Change `import { analyzeGlobalField } from './global-field.js'` → `import { FieldComputation } from 'rbi-kernel'`
   - Update usage: `FieldComputation.analyzeGlobalField(...)`
7. **Rebuild RBI-Architecture-Service:** `cd RBI-Architecture-Service && npm run build`
9. **Verify workspace resolution:**
    - Verify imports resolve correctly using `rbi-kernel` package
    - Verify TypeScript can resolve types from `rbi-kernel`
10. Run tests: Verify RBI-Architecture-Service tests pass

**Success Criteria:**
- global-field.ts moved to RBI-Kernel
- RBI-Kernel builds successfully
- Workspace dependencies updated (`pnpm install` run)
- RBI-Architecture-Service imports from RBI-Kernel via workspace protocol
- RBI-Architecture-Service builds successfully
- Workspace resolution verified
- All tests pass

---

### Phase M6: Move Layer 4 Extension (boundary-validator.ts) to RBI-Kernel

**Purpose:** Move boundary validator framework from RBI-Architecture-Service to RBI-Kernel

**Actions:**
1. Copy `RBI-Architecture-Service/src/field/validation/boundary-validator.ts` to `RBI-Kernel/rbi_kernel_src/field/validation/boundary-validator.ts`
2. Update imports in copied file (if any)
3. Update `RBI-Kernel/rbi_kernel_src/field/validation/index.ts`:
   - Export boundary validator functions and types
4. **Rebuild RBI-Kernel:** `cd RBI-Kernel && npm run build`
5. **Update workspace dependencies:**
   - Run `pnpm install` from monorepo root to update workspace symlinks
   - Verify workspace resolution works
6. Update RBI-Architecture-Service to import from RBI-Kernel:
   - Change imports to use `FieldValidation` from `rbi-kernel`
   - Update all usage sites
7. Keep sector-specific validators in RBI-Architecture-Service (service extensions)
8. **Rebuild RBI-Architecture-Service:** `cd RBI-Architecture-Service && npm run build`
9. **Verify workspace resolution:**
    - Verify imports resolve correctly using `rbi-kernel` package
    - Verify TypeScript can resolve types from `rbi-kernel`
10. Run tests: Verify RBI-Architecture-Service tests pass

**Success Criteria:**
- boundary-validator.ts moved to RBI-Kernel
- Sector validators remain in RBI-Architecture-Service
- RBI-Kernel builds successfully
- Workspace dependencies updated (`pnpm install` run)
- RBI-Architecture-Service imports from RBI-Kernel via workspace protocol
- RBI-Architecture-Service builds successfully
- Workspace resolution verified
- All tests pass

---

### Phase M7: Move Stabilization Components (Optional Integration)

**Purpose:** Move stabilization engine to RBI-Kernel (integrate into temporal layer or keep separate)

**Actions:**
1. Decide on integration strategy:
   - Option A: Integrate into Layer 3 (Temporal Continuity)
   - Option B: Keep as separate module
2. Copy stabilization files:
   - `stabilization-engine.ts` → `RBI-Kernel/rbi_kernel_src/field/temporal/stabilization-engine.ts` (if Option A)
   - `drift-detector.ts` → `RBI-Kernel/rbi_kernel_src/field/temporal/drift-detector.ts`
   - `threshold-strategy.ts` → `RBI-Kernel/rbi_kernel_src/field/temporal/threshold-strategy.ts`
3. Update imports and exports
4. **Rebuild RBI-Kernel:** `cd RBI-Kernel && npm run build`
5. **Update workspace dependencies:**
   - Run `pnpm install` from monorepo root to update workspace symlinks
   - Verify workspace resolution works
6. Update RBI-Architecture-Service to import from RBI-Kernel
7. **Rebuild RBI-Architecture-Service:** `cd RBI-Architecture-Service && npm run build`
8. **Verify workspace resolution:**
    - Verify imports resolve correctly using `rbi-kernel` package
    - Verify TypeScript can resolve types from `rbi-kernel`
9. Run tests: Verify RBI-Architecture-Service tests pass

**Success Criteria:**
- Stabilization components moved
- RBI-Kernel builds successfully
- Workspace dependencies updated (`pnpm install` run)
- RBI-Architecture-Service imports from RBI-Kernel via workspace protocol
- RBI-Architecture-Service builds successfully
- Workspace resolution verified
- All tests pass

---

### Phase M8: Update RBI-Kernel Exports and Manifest

**Purpose:** Ensure all 5 layers are properly exported and documented

**Actions:**
1. Update `RBI-Kernel/rbi_kernel_src/kernel.ts`:
   - Verify all 5 layers export correctly
   - Update `KernelManifest` to reflect complete architecture
2. Update `RBI-Kernel/package.json` exports:
   - Add exports for Layer 3 (if needed)
   - Add exports for Layer 5 (if needed)
3. Update RBI-Kernel documentation:
   - Update `ARCHITECTURE_OVERVIEW.md` to reflect complete 5-layer implementation
   - Document Layer 3 and Layer 5 capabilities
4. **Rebuild RBI-Kernel:** `cd RBI-Kernel && npm run build`
5. **Update workspace dependencies:**
   - Run `pnpm install` from monorepo root to update workspace symlinks
   - Verify workspace resolution works
6. Test exports:
   - Verify all layers accessible via `rbi-kernel` package
   - Test subpath exports work
   - Verify workspace resolution: `pnpm list --depth=0` shows rbi-kernel

**Success Criteria:**
- All 5 layers exported correctly
- KernelManifest updated
- Documentation updated
- Exports verified working

---

### Phase M9: Cleanup RBI-Architecture-Service

**Purpose:** Remove duplicate code from RBI-Architecture-Service after verification

**Actions:**
1. Verify all imports migrated:
   - RBI-Architecture-Service imports from `rbi-kernel` for Layers 3, 4, 5
   - All tests pass
   - Service runs successfully
2. Remove duplicate files:
   - `src/field/temporal/timeseries-analyzer.ts` (moved to RBI-Kernel)
   - `src/field/propagation/*.ts` (moved to RBI-Kernel)
   - `src/field/computation/global-field.ts` (moved to RBI-Kernel)
   - `src/field/validation/boundary-validator.ts` (moved to RBI-Kernel)
   - `src/field/stabilization/*.ts` (if moved to RBI-Kernel)
3. Update index files:
   - `src/field/temporal/index.ts` - Re-export from `rbi-kernel` if needed, or remove
   - `src/field/propagation/index.ts` - Re-export from `rbi-kernel` if needed, or remove
4. Keep service-specific extensions:
   - `src/field/validation/proof-of-meaning.ts` (with DecisionTrail extension)
   - `src/field/validation/validators/` (sector-specific validators)
5. **Rebuild RBI-Architecture-Service:** `cd RBI-Architecture-Service && npm run build`
6. **Verify workspace resolution:**
    - Verify imports resolve correctly using `rbi-kernel` package
    - Verify TypeScript can resolve types from `rbi-kernel`
    - Verify `pnpm list --depth=0` shows rbi-kernel dependency
7. Run tests: Verify all tests pass
8. Typecheck: `cd RBI-Architecture-Service && npm run typecheck`

**Success Criteria:**
- Duplicate files removed
- Service-specific extensions preserved
- RBI-Architecture-Service builds successfully
- All tests pass
- No broken imports

---

### Phase M10: Post-Migration Verification

**Purpose:** Comprehensive verification of complete 5-layer architecture

**Actions:**
1. Functional verification:
   - Test RBI-Kernel Layer 3 (temporal) exports
   - Test RBI-Kernel Layer 5 (propagation) exports
   - Test RBI-Kernel Layer 2 extension (global-field) exports
   - Test RBI-Kernel Layer 4 extension (boundary-validator) exports
   - Test RBI-Architecture-Service using RBI-Kernel Layers 3, 4, 5
   - Verify no regressions
2. Build verification:
   - RBI-Kernel builds successfully
   - RBI-Architecture-Service builds successfully
   - All dependent projects build successfully
   - Workspace dependencies resolved correctly (`pnpm install` from root)
   - Workspace symlinks verified
3. Test verification:
   - Run RBI-Kernel tests (if any)
   - Run RBI-Architecture-Service tests
   - Run CMS_Backend tests that use RBI
4. Documentation verification:
   - Update RBI_EXTRACTION_EXECUTION_PLAN.md with Phase M status
   - Update RBI_EXTRACTION_INQUIRY.md with complete architecture status
   - Document any S2S terminology abstractions made

**Success Criteria:**
- All functionality verified
- All builds successful
- All tests pass
- Documentation updated

---

## Migration Order

**Strict Sequence (MANDATE 4):**
1. Phase M1: Pre-Migration Verification
2. Phase M2: Abstract S2S Terminology
3. Phase M3: Move Layer 3 (Temporal)
4. Phase M4: Move Layer 5 (Propagation)
5. Phase M5: Move Layer 2 Extension (global-field)
6. Phase M6: Move Layer 4 Extension (boundary-validator)
7. Phase M7: Move Stabilization (Optional)
8. Phase M8: Update RBI-Kernel Exports
9. Phase M9: Cleanup RBI-Architecture-Service
10. Phase M10: Post-Migration Verification

**Guardrail:** DO NOT proceed to next phase until current phase is verified (MANDATE 5).

---

## Compliance with Mandates & Guardrails

### ✅ MANDATE 1: Pre-Migration Verification
- Phase M1 required before any code movement

### ✅ MANDATE 2: Package Configuration
- RBI-Kernel package.json already updated (from previous migration)
- May need updates for new exports

### ✅ MANDATE 4: Migration Execution Order
- Strict sequence: M1 → M2 → M3 → M4 → M5 → M6 → M7 → M8 → M9 → M10

### ✅ MANDATE 5: Per-Migration Verification
- Required after each phase (M3, M4, M5, M6, M7, M8)
- Final verification in Phase M10

### ✅ MANDATE 7: Cleanup Only After Verification
- Phase M9 only after all migrations verified

### ✅ GUARDRAIL 1: No Breaking Changes
- Maintain backward compatibility
- Keep old code until new code verified

### ✅ GUARDRAIL 2: One Project at a Time
- Focus on RBI-Kernel and RBI-Architecture-Service
- Complete one layer before moving to next

### ✅ GUARDRAIL 3: No Direct Source Imports
- All imports use `rbi-kernel` package
- No relative paths to source files

### ✅ GUARDRAIL 5: Preserve Working Systems
- RBI-Architecture-Service continues working
- All existing functionality preserved

### ✅ GUARDRAIL 6: Test Before Removal
- Verify imports work before removing duplicate files

---

## Monorepo Considerations

### Current Monorepo Structure

**Workspace Configuration:**
- `pnpm-workspace.yaml` includes: `RBI-Kernel`, `RBI-Architecture-Service`, `CMS_Backend`, `Orbital-Brain`, etc.
- Root `package.json` workspaces list (if used) should include all packages

**Dependency Protocols:**
- RBI-Architecture-Service: `"rbi-kernel": "workspace:*"` ✅ (workspace protocol)
- CMS_Backend: `"rbi-kernel": "file:../RBI-Kernel"` (file protocol)
- Orbital-Brain: `"rbi-kernel": "file:../RBI-Kernel"` (file protocol)

**Workspace Resolution:**
- After moving code to RBI-Kernel, must run `pnpm install` from monorepo root
- This updates workspace symlinks so RBI-Architecture-Service can import updated RBI-Kernel
- Workspace protocol (`workspace:*`) automatically resolves to local package

### Migration Impact on Monorepo

**What Changes:**
- RBI-Kernel source code (adds Layers 3, 5, extensions)
- RBI-Kernel package.json exports (adds new layer exports)
- RBI-Architecture-Service imports (already using `rbi-kernel` package)

**What Stays the Same:**
- Monorepo structure (no changes to pnpm-workspace.yaml)
- Workspace dependency protocol (RBI-Architecture-Service already uses `workspace:*`)
- Other projects' dependencies (CMS_Backend, Orbital-Brain unchanged)

**Required Actions:**
- After each code move: Run `pnpm install` from monorepo root
- Verify workspace symlinks updated
- Verify imports resolve correctly via workspace protocol

---

## Summary

**Restoration Status:** ✅ No restoration needed - complete implementations still exist

**Migration Strategy:** Move complete implementations FROM RBI-Architecture-Service TO RBI-Kernel

**Monorepo Impact:** ✅ Plan updated to include workspace dependency management

**Result:** RBI-Kernel will have complete 5-layer architecture ready for product extraction, while RBI-Architecture-Service continues to work by importing from the kernel via workspace protocol.

