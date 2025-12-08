# RBI-Kernel Recommendation

**Date:** 2025-01-26  
**Question:** What should we do with RBI-Kernel?

---

## What is RBI-Kernel?

**RBI-Kernel** is a **TypeScript library** that provides:
- **Coherence computation** - Resonance-weighted relationships and temporal feedback
- **Vector similarity** - Cosine similarity and custom coherence metrics
- **Text resonance** - Structural similarity between text strings
- **Proof-of-Meaning verification** - Coherence-based validation
- **Field-level computation** - Core mathematical functions for RBI

**It's a shared library** used by:
- `CMS_Backend` - For RBI computation and field sensing
- `Orbital-Brain` - For interpreting RBI output

---

## Current Setup

### In Monorepo:
- **Path:** `/S2S_RBI_System/RBI-Kernel/`
- **Package name:** `rbi-kernel`
- **Type:** Workspace package (via pnpm)
- **Dependencies:**
  - `CMS_Backend` → `"rbi-kernel": "file:../RBI-Kernel"`
  - `Orbital-Brain` → `"rbi-kernel": "file:../RBI-Kernel"`

### Separate GitHub Repo:
- **Repository:** `GgStardust/rbi-kernel` (Private)
- **Purpose:** Likely for external distribution or backup

---

## Recommendation: **Keep RBI-Kernel in Monorepo** ✅

### Why This Makes Sense:

1. **Shared Library Pattern:**
   - RBI-Kernel is a core dependency used by multiple packages
   - Keeping it in the monorepo allows:
     - Easy local development
     - Shared TypeScript types
     - Coordinated versioning
     - Fast iteration

2. **Current Setup is Correct:**
   - `file:../RBI-Kernel` dependency is the right approach for monorepos
   - pnpm workspace handles it automatically
   - No need for npm publishing or version management

3. **Separate Repo Can Coexist:**
   - The separate `rbi-kernel` GitHub repo can be:
     - A backup/mirror
     - For external distribution (if needed later)
     - For standalone use cases
   - Doesn't conflict with monorepo setup

4. **Architecture Alignment:**
   - Matches the confirmed architecture:
     ```
     RBI-Kernel (no dependencies)
       ↓
     Orbital-Brain (depends on rbi-kernel)
       ↓
     CMS_Backend (depends on rbi-kernel, orbital-brain)
     ```

---

## What to Do

### ✅ **Keep Current Setup (Recommended)**

**Action:** No changes needed. Current setup is correct.

**Benefits:**
- Simple development workflow
- Fast iteration
- Shared types and code
- No version management overhead

**If you want to sync with separate repo:**
```bash
# Optionally sync to separate repo (if needed)
cd RBI-Kernel
git remote add backup https://github.com/GgStardust/rbi-kernel.git
git push backup main  # When you want to backup
```

### Alternative: Make it a Git Submodule (Not Recommended)

**Why not:**
- Adds complexity
- Harder to develop
- Version management overhead
- Current setup is simpler and better

---

## Conclusion

**✅ Keep RBI-Kernel in the monorepo as a workspace package.**

This is the standard pattern for shared libraries in monorepos. The separate GitHub repo can remain as a backup or for external distribution, but the monorepo setup is correct and should be maintained.

**No action needed** - current setup is optimal.

---

**Status:** ✅ Recommendation complete - proceed with current setup

