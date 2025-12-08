# GitHub Repository Structure & Push Destinations

**Date:** 2025-01-26  
**Current Branch:** `feature/diagnostic-8q-clean`  
**Status:** No remote configured yet

---

## Repository Structure

### Main Repository
- **Local Path:** `/Users/gigi/Projects/S2S_RBI_System`
- **Current Branch:** `feature/diagnostic-8q-clean`
- **Remote:** Not configured (needs setup)

### Recommended Repository Structure

#### Option 1: Single Monorepo (Recommended)
- **Repository:** `GgStardust/S2S_RBI_System` (or similar)
- **Structure:**
  ```
  S2S_RBI_System/
  ├── CMS_Backend/          # Backend CMS + Console APIs
  ├── s2s-frontend/         # Frontend monorepo
  │   ├── s2s-website/     # Public website
  │   ├── s2s-console/     # Console app
  │   └── s2s-codex/       # Codex data package
  ├── RBI-Kernel/          # RBI computation engine
  ├── Orbital-Brain/       # Narrative intelligence layer
  └── RBI_Editorial_Tools/ # Editorial tools
  ```

#### Option 2: Separate Repositories (If needed)
- `GgStardust/s2s-cms` - CMS Backend
- `GgStardust/s2s-frontend` - Frontend monorepo
- `GgStardust/s2s-rbi-kernel` - RBI Kernel
- `GgStardust/s2s-orbital-brain` - Orbital Brain

---

## Push Strategy

### Current State
- **Branch:** `feature/diagnostic-8q-clean`
- **Remote:** Not configured
- **Untracked Files:**
  - `CMS_Backend/CONSOLE_V3_TESTING.md`
  - `CMS_Backend/app/api/console/v3/`

### Recommended Workflow

#### 1. Set Up Remote (First Time)
```bash
# If repository doesn't exist on GitHub, create it first
# Then add remote:
git remote add origin https://github.com/GgStardust/S2S_RBI_System.git

# Or if using SSH:
git remote add origin git@github.com:GgStardust/S2S_RBI_System.git
```

#### 2. Create Feature Branch for Console V3
```bash
# Create new branch for Console V3 work
git checkout -b console-v3-sovereign-field-inquiry

# Or continue on current branch if it's appropriate
```

#### 3. Commit Strategy (Per Build Plan)

**Phase 0: Content Organization**
```bash
git add CMS_Backend/supabase/migrations/20250126_phase_0_content_tagging.sql
git add CMS_Backend/docs/EXERCISES_S2S_ASSESSMENT.md
git commit -m "Phase 0: Add content tagging system for Console V3

- Add console_ready, visibility, codex_category fields
- Add practice_associations, console_tags
- Add exercise_type, duration_minutes for exercises
- Create indexes for Console queries
- Update existing content with default values"
```

**Phase 1.5: Critical Fixes**
```bash
# After fixing inquiry results
git add CMS_Backend/lib/services/console-v3/diagnostic-service.ts
git commit -m "Fix: Answer-specific orb weight mapping for varied SFI results"

# After fixing practices
git add CMS_Backend/app/api/console/v3/pathway/
git commit -m "Fix: Pathway steps creation and practice population"

# After connecting content
git add CMS_Backend/app/api/codex/
git commit -m "Add: Codex API endpoint for Console content consumption"
```

**Phase 2.5: Question Management**
```bash
git add CMS_Backend/supabase/migrations/*question*.sql
git add CMS_Backend/app/api/console/v3/questions/
git commit -m "Add: Question management system with early reader questions"
```

#### 4. Push Frequency
```bash
# Push after each phase completion
git push origin console-v3-sovereign-field-inquiry

# Or push daily if actively working
git push origin console-v3-sovereign-field-inquiry
```

#### 5. Create Pull Request
- After Phase 0, 1.5, 2.5 are complete
- Create PR: `console-v3-sovereign-field-inquiry` → `main` (or `develop`)
- Review and merge after testing

---

## Repository Destinations - Confirmation Needed

### Questions for User:
1. **Does the repository exist on GitHub?**
   - If yes, what's the URL?
   - If no, should we create it?

2. **What's the preferred repository structure?**
   - Single monorepo (recommended)
   - Separate repositories

3. **What's the main branch name?**
   - `main`
   - `develop`
   - `master`

4. **Should we set up the remote now?**
   - Yes, I'll configure it
   - No, I'll do it manually

---

## Current Untracked Files (Need to be committed)

```
CMS_Backend/CONSOLE_V3_TESTING.md
CMS_Backend/app/api/console/v3/
```

**Recommendation:** Commit these as part of Phase 0 or Phase 1.5.

---

## Next Steps

1. **Confirm repository URL and structure**
2. **Set up remote** (if not already done)
3. **Create feature branch** (if not already on one)
4. **Begin Phase 0 commits** (after confirmation)

