# RBI Hardwiring Remediation Plan

**Date:** 2025-12-22  
**Status:** REQUIRED - Correcting previous migration approach  
**Purpose:** Implement hardwiring/embedding of RBI-Kernel source code into monorepo projects, replacing workspace package dependencies

---

## Problem Statement

The original migration (Phases 0-8) implemented workspace package dependencies (`"rbi-kernel": "workspace:*"`), but the user's intent was to **hardwire/embed RBI-Kernel source code directly** into monorepo projects, eliminating package dependencies.

**User's Intent:**
- RBI-Kernel exists as standalone product (separate repo/folder)
- Monorepo projects (CMS_Backend, RBI-Architecture-Service, Orbital-Brain) should have RBI-Kernel source code **copied directly** into them
- No `package.json` dependencies on `rbi-kernel` within monorepo projects
- Monorepo should be self-contained

**Current State:**
- ✅ RBI-Kernel is complete and product-ready
- ❌ Projects use workspace package dependencies
- ❌ Imports use `from 'rbi-kernel'` package syntax
- ❌ Documentation recommends package dependencies

---

## Remediation Strategy

### Phase H1: Identify Target Projects

**Projects that need RBI-Kernel hardwired:**
1. **CMS_Backend** - Uses RBI-Kernel via wrappers and direct imports
2. **RBI-Architecture-Service** - Uses RBI-Kernel directly
3. **Orbital-Brain** - May use RBI-Kernel (needs verification)

**Projects that should NOT have RBI-Kernel:**
- **S2S_Console** - Should only use `orbital-brain/types` (per GUARDRAIL 4)
- **RBI_Website** - Standalone website, no RBI needed
- **RBI_Editorial_Tools** - Standalone tools

### Phase H2: Create Embedded Source Structure

**For each target project, create:**
```
<Project>/
  lib/
    rbi-kernel/          # Embedded RBI-Kernel source
      field/
      mathematics/
      metadata/
      interfaces/
      kernel.ts
      types.ts
      index.ts
```

**Alternative structure (if project already has RBI structure):**
- CMS_Backend: `lib/rbi/kernel/` (embedded source)
- RBI-Architecture-Service: `src/rbi-kernel/` (embedded source)
- Orbital-Brain: `src/rbi-kernel/` (embedded source)

### Phase H3: Copy RBI-Kernel Source

**Source to copy:**
- `RBI-Kernel/rbi_kernel_src/` → Copy entire directory structure
- Exclude: `server/` (optional, only if project needs it)
- Exclude: `interfaces/api/` (optional, only if project needs it)

**Files to copy:**
```
rbi_kernel_src/
  field/
    computation/
    temporal/
    validation/
    propagation/
    representation/
  mathematics/
  metadata/
  kernel.ts
  types.ts
  index.ts
```

### Phase H4: Update Imports

**Migration pattern:**
```typescript
// Before (package dependency)
import { FieldComputation } from 'rbi-kernel';
import { Mathematics } from 'rbi-kernel';
import type { ContentMetadata } from 'rbi-kernel';

// After (hardwired source)
import { FieldComputation } from '@/lib/rbi-kernel/kernel';
import { Mathematics } from '@/lib/rbi-kernel/mathematics';
import type { ContentMetadata } from '@/lib/rbi-kernel/field/computation/enhanced-engine';
```

**Or using relative paths:**
```typescript
import { FieldComputation } from '../rbi-kernel/kernel';
import { Mathematics } from '../rbi-kernel/mathematics';
```

### Phase H5: Remove Package Dependencies

**For each target project:**
1. Remove `"rbi-kernel": "workspace:*"` or `"rbi-kernel": "file:../RBI-Kernel"` from `package.json`
2. Run `pnpm install` to clean up workspace symlinks
3. Verify no `node_modules/rbi-kernel` symlink exists

### Phase H6: Update TypeScript Configuration

**For each target project:**
- Update `tsconfig.json` paths if needed
- Ensure embedded source is included in compilation
- Verify type resolution works

### Phase H7: Update Documentation

**Files to update:**
1. `RBI_EXTRACTION_INQUIRY.md` - Update Section 2.2 to reflect hardwiring
2. `RBI_EXTRACTION_EXECUTION_PLAN.md` - Add Phase 9: Hardwiring Implementation
3. Create `RBI_HARDWIRING_GUIDE.md` - Document the hardwiring pattern

### Phase H8: Verification

**For each target project:**
1. ✅ Typecheck passes
2. ✅ Build succeeds
3. ✅ All imports resolve correctly
4. ✅ No `rbi-kernel` package dependency in `package.json`
5. ✅ No `node_modules/rbi-kernel` symlink
6. ✅ Functional tests pass

---

## Detailed Implementation Steps

### Step 1: Pre-Hardwiring Verification

**Actions:**
1. Verify RBI-Kernel source is complete and builds
2. Identify all files importing from `rbi-kernel` package
3. Document current import patterns
4. Create backup/checkpoint

**Verification:**
```bash
# Find all rbi-kernel imports
grep -r "from 'rbi-kernel'" CMS_Backend/ RBI-Architecture-Service/ Orbital-Brain/
grep -r 'from "rbi-kernel"' CMS_Backend/ RBI-Architecture-Service/ Orbital-Brain/
```

### Step 2: Copy RBI-Kernel Source to CMS_Backend

**Actions:**
1. Create `CMS_Backend/lib/rbi-kernel/` directory
2. Copy `RBI-Kernel/rbi_kernel_src/` contents to `CMS_Backend/lib/rbi-kernel/`
3. Preserve directory structure
4. Exclude `server/` and `interfaces/api/` (unless needed)

**Command:**
```bash
mkdir -p CMS_Backend/lib/rbi-kernel
cp -r RBI-Kernel/rbi_kernel_src/* CMS_Backend/lib/rbi-kernel/
# Remove server/ if not needed
rm -rf CMS_Backend/lib/rbi-kernel/server
```

### Step 3: Update CMS_Backend Imports

**Files to update:**
- All files importing from `'rbi-kernel'`
- Wrapper files in `lib/mathematics/`
- API routes using RBI functions
- Book compiler files

**Import mapping:**
```typescript
// Package import → Hardwired import
'rbi-kernel' → '@/lib/rbi-kernel/kernel'
'rbi-kernel/mathematics' → '@/lib/rbi-kernel/mathematics'
'rbi-kernel/field/computation/enhanced-engine' → '@/lib/rbi-kernel/field/computation/enhanced-engine'
```

### Step 4: Remove CMS_Backend Package Dependency

**Actions:**
1. Edit `CMS_Backend/package.json`
2. Remove `"rbi-kernel": "file:../RBI-Kernel"` from dependencies
3. Run `pnpm install`
4. Verify `node_modules/rbi-kernel` is removed

### Step 5: Copy RBI-Kernel Source to RBI-Architecture-Service

**Actions:**
1. Create `RBI-Architecture-Service/src/rbi-kernel/` directory
2. Copy `RBI-Kernel/rbi_kernel_src/` contents
3. Preserve directory structure

### Step 6: Update RBI-Architecture-Service Imports

**Files to update:**
- `src/server/server.ts`
- `src/server/utils/content-detector.ts`
- All files importing from `'rbi-kernel'`

**Import mapping:**
```typescript
'rbi-kernel' → '../rbi-kernel/kernel'
'rbi-kernel/mathematics' → '../rbi-kernel/mathematics'
```

### Step 7: Remove RBI-Architecture-Service Package Dependency

**Actions:**
1. Edit `RBI-Architecture-Service/package.json`
2. Remove `"rbi-kernel": "workspace:*"` from dependencies
3. Run `pnpm install`
4. Verify `node_modules/rbi-kernel` is removed

### Step 8: Verify Orbital-Brain Usage

**Actions:**
1. Check if Orbital-Brain actually imports from `rbi-kernel`
2. If yes, repeat Steps 5-7 for Orbital-Brain
3. If no, remove dependency from `package.json` only

### Step 9: Update TypeScript Configurations

**For each project:**
- Ensure embedded source is included in `tsconfig.json` `include` paths
- Update path aliases if needed
- Verify type resolution

### Step 10: Update Documentation

**Files to update:**
1. `RBI_EXTRACTION_INQUIRY.md` - Section 2.2
2. `RBI_EXTRACTION_EXECUTION_PLAN.md` - Add Phase 9
3. Create `RBI_HARDWIRING_GUIDE.md`

---

## Success Criteria

### Phase H1-H8 Complete When:

1. ✅ RBI-Kernel source copied to all target projects
2. ✅ All imports updated to use embedded source paths
3. ✅ Package dependencies removed from all target projects
4. ✅ Typecheck passes for all projects
5. ✅ Build succeeds for all projects
6. ✅ Functional tests pass
7. ✅ Documentation updated
8. ✅ No `node_modules/rbi-kernel` symlinks exist
9. ✅ Monorepo is self-contained (no external RBI-Kernel dependency)

---

## Rollback Plan

If hardwiring causes issues:

1. **Restore package dependencies:**
   - Add `"rbi-kernel": "workspace:*"` back to `package.json` files
   - Run `pnpm install`

2. **Revert import changes:**
   - Change imports back to `from 'rbi-kernel'`
   - Use git to revert import changes

3. **Remove embedded source:**
   - Delete `lib/rbi-kernel/` or `src/rbi-kernel/` directories
   - Clean up any orphaned files

---

## Notes

- **RBI-Kernel as Standalone Product:** RBI-Kernel remains in `RBI-Kernel/` folder and can be moved to separate repository for external distribution
- **Monorepo Self-Containment:** Each monorepo project has its own copy of RBI-Kernel source, making the monorepo self-contained
- **Maintenance:** When RBI-Kernel is updated, source must be copied to all embedded locations (manual process or script)
- **Version Control:** Embedded source should be committed to each project's repository

---

**End of RBI Hardwiring Remediation Plan**

