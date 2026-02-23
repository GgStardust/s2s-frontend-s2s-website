# Project Folder Reorganization Plan

**Date:** 2025-12-23  
**Purpose:** Move standalone projects and non-code folders out of monorepo root into separate project folders  
**Status:** Planning Phase

---

## Overview

Several folders in the monorepo root are standalone projects or non-code content that should be moved to separate project folders. This plan outlines the migration strategy for each folder.

---

## Folders to Move

### 1. Standalone Code Projects

#### `cursor-rbi-extension/`
**Current Location:** `/Users/gigi/Projects/S2S_RBI_System/cursor-rbi-extension/`  
**Target Location:** `/Users/gigi/Projects/cursor-rbi-extension/` (separate project folder)  
**Type:** Standalone VS Code/Cursor extension  
**Dependencies:** 
- Has `package.json` with `rbi-kernel: "file:../RBI-Kernel"` dependency
- Needs RBI-Kernel access

**Migration Steps:**
1. Create new project folder: `/Users/gigi/Projects/cursor-rbi-extension/`
2. Copy entire `cursor-rbi-extension/` folder to new location
3. Update `package.json` dependency:
   - Option A: Use published `rbi-kernel` package (when available)
   - Option B: Use relative path to RBI-Kernel if kept in workspace
   - Option C: Embed RBI-Kernel source (if needed)
4. Update any hardcoded paths in extension code
5. Test extension compilation and functionality
6. Delete from monorepo root
7. Update documentation references

**Dependencies to Resolve:**
- `rbi-kernel: "file:../RBI-Kernel"` → Update to published package or new path

---

#### `RBI_S2S_Sandbox/`
**Current Location:** `/Users/gigi/Projects/S2S_RBI_System/RBI_S2S_Sandbox/`  
**Target Location:** `/Users/gigi/Projects/RBI_S2S_Sandbox/` (separate project folder)  
**Type:** Temporary workspace for partner project assessments  
**Dependencies:** None (standalone markdown/docs)

**Migration Steps:**
1. Create new project folder: `/Users/gigi/Projects/RBI_S2S_Sandbox/`
2. Copy entire `RBI_S2S_Sandbox/` folder to new location
3. No dependency updates needed (no package.json)
4. Delete from monorepo root
5. Update any documentation references

**Note:** This is a temporary workspace. Consider archiving completed assessments and cleaning up before moving.

---

### 2. Non-Code Content Folders

#### `Final S2S Patent Filing Set/`
**Current Location:** `/Users/gigi/Projects/S2S_RBI_System/Final S2S Patent Filing Set/`  
**Target Location:** `/Users/gigi/Projects/S2S_Legal_Documents/` (new project folder)  
**Type:** Legal documents (PDFs)  
**Contents:** Patent filing documents, specifications, annexes

**Migration Steps:**
1. Create new project folder: `/Users/gigi/Projects/S2S_Legal_Documents/`
2. Create subdirectory: `S2S_Legal_Documents/Patent_Filings/`
3. Copy all PDF files to new location
4. Organize by filing date or document type
5. Delete from monorepo root
6. Update any references in documentation

**Alternative:** Could be part of a broader `S2S_Documentation/` project folder

---

#### `Marketing S2S Book 1/`
**Current Location:** `/Users/gigi/Projects/S2S_RBI_System/Marketing S2S Book 1/`  
**Target Location:** `/Users/gigi/Projects/S2S_Marketing/` (new project folder)  
**Type:** Marketing materials (markdown docs)  
**Contents:** Marketing plans, community engagement, distribution platforms

**Migration Steps:**
1. Create new project folder: `/Users/gigi/Projects/S2S_Marketing/`
2. Create subdirectory: `S2S_Marketing/Book_1/`
3. Copy all markdown files to new location
4. Delete from monorepo root
5. Update any references in documentation

---

#### `S2S_Manuscript/`
**Current Location:** `/Users/gigi/Projects/S2S_RBI_System/S2S_Manuscript/`  
**Target Location:** `/Users/gigi/Projects/S2S_Manuscript/` (separate project folder)  
**Type:** Manuscript files (markdown)  
**Contents:** Current and archived manuscript versions

**Migration Steps:**
1. Create new project folder: `/Users/gigi/Projects/S2S_Manuscript/`
2. Copy entire `S2S_Manuscript/` folder to new location
3. Verify CMS_Backend doesn't have hardcoded paths to this folder
4. Update any import/export scripts that reference this location
5. Delete from monorepo root
6. Update documentation references

**Dependencies to Check:**
- `CMS_Backend/scripts/` - Check for manuscript import scripts
- `CMS_Backend/lib/book-compiler/` - Check for manuscript references

---

#### `S2S_RBI_Validation and Theoretical Foundations Report (v1.0)/`
**Current Location:** `/Users/gigi/Projects/S2S_RBI_System/S2S_RBI_Validation and Theoretical Foundations Report (v1.0)/`  
**Target Location:** `/Users/gigi/Projects/S2S_Documentation/Reports/` (new project folder)  
**Type:** Reports (docx, md)  
**Contents:** Validation reports, theoretical foundations, developer onboarding

**Migration Steps:**
1. Create new project folder: `/Users/gigi/Projects/S2S_Documentation/`
2. Create subdirectory: `S2S_Documentation/Reports/Validation_and_Foundations/`
3. Copy all files to new location
4. Delete from monorepo root
5. Update any references in documentation

**Alternative:** Could be part of `S2S_Legal_Documents/` if related to patent/IP

---

## Migration Order

**Phase 1: Non-Code Content (Low Risk)**
1. `Final S2S Patent Filing Set/` → `S2S_Legal_Documents/`
2. `Marketing S2S Book 1/` → `S2S_Marketing/`
3. `S2S_RBI_Validation and Theoretical Foundations Report (v1.0)/` → `S2S_Documentation/Reports/`

**Phase 2: Standalone Projects (Medium Risk)**
4. `RBI_S2S_Sandbox/` → `RBI_S2S_Sandbox/` (separate project)
5. `S2S_Manuscript/` → `S2S_Manuscript/` (separate project)

**Phase 3: Code Projects (Higher Risk - Requires Dependency Updates)**
6. `cursor-rbi-extension/` → `cursor-rbi-extension/` (separate project)

---

## Pre-Migration Checklist

### For Each Folder:
- [ ] Verify no active references in monorepo code
- [ ] Check for hardcoded paths in scripts/configs
- [ ] Identify all dependencies
- [ ] Create target project folder structure
- [ ] Backup current folder (git commit or copy)

### For Code Projects:
- [ ] Update `package.json` dependencies
- [ ] Update import paths in code
- [ ] Test build/compilation
- [ ] Verify functionality

---

## Post-Migration Tasks

1. **Update Monorepo Config:**
   - Remove from `pnpm-workspace.yaml` (if applicable)
   - Remove from `package.json` workspaces (if applicable)
   - Update any root-level scripts that reference these folders

2. **Update Documentation:**
   - Update `S2S_SYSTEM_ARCHITECTURE.md` if it references these folders
   - Update any README files
   - Update any internal documentation

3. **Git Cleanup:**
   - Commit deletions from monorepo
   - Create new git repos for standalone projects (if needed)
   - Update `.gitignore` if needed

4. **Verify:**
   - Monorepo still builds correctly
   - No broken references
   - All projects can access their dependencies

---

## Dependency Resolution Strategy

### For `cursor-rbi-extension/`:
**Option 1: Published Package (Recommended)**
- Update to: `"rbi-kernel": "^1.0.0"` (when published to npm)
- Requires RBI-Kernel to be published

**Option 2: Git Submodule**
- Add RBI-Kernel as git submodule in new project
- Update path: `"rbi-kernel": "file:./RBI-Kernel"`

**Option 3: Embedded Source**
- Copy RBI-Kernel source into extension (not recommended, duplicates code)

**Option 4: Keep in Monorepo, Reference from Outside**
- Keep RBI-Kernel in monorepo
- Use absolute path or symlink from extension project
- Less clean but works

**Recommendation:** Option 1 (published package) or Option 2 (git submodule)

---

## Risk Assessment

| Folder | Risk Level | Reason |
|--------|-----------|--------|
| `Final S2S Patent Filing Set/` | Low | No code dependencies |
| `Marketing S2S Book 1/` | Low | No code dependencies |
| `S2S_RBI_Validation.../` | Low | No code dependencies |
| `RBI_S2S_Sandbox/` | Low | No code dependencies, temporary |
| `S2S_Manuscript/` | Medium | May be referenced by CMS_Backend scripts |
| `cursor-rbi-extension/` | High | Has RBI-Kernel dependency, needs path updates |

---

## Rollback Plan

If migration causes issues:
1. Restore folders from git history
2. Revert any config changes
3. Restore dependencies in `package.json` files
4. Test monorepo functionality

---

## Success Criteria

- [ ] All folders moved to separate project folders
- [ ] Monorepo builds successfully
- [ ] No broken references in code
- [ ] All standalone projects can access their dependencies
- [ ] Documentation updated
- [ ] Git history preserved

---

## Notes

- **RBI-Kernel and RBI-Architecture-Service:** These have their own repos but remain embedded in monorepo (as intended per hardwiring plan). They should NOT be moved.

- **RBI_Website and RBI_Editorial_Tools:** These are in the workspace and are part of the monorepo. They should NOT be moved unless explicitly requested.

- **s2s-frontend:** Core monorepo project, should NOT be moved.

---

**Next Steps:** Review this plan, then proceed with Phase 1 (non-code content) migrations.

