# Core Architecture Files for Console Backend

## Purpose
These files represent the **core architecture** of S2S that should be built into the console backend as the foundational framework. RBI analyzes these FIRST to understand the system structure, then uses them to match user inquiries to relevant content.

---

## Core Architecture Files (Build into Console Backend)

### 1. **13_ORB_SYSTEM_OUTLINE.md**
**Location:** `CMS_Backend/09_PROCESSED/02c_Supporting material/13_ORB_SYSTEM_OUTLINE.md`

**Purpose:**
- Defines what each orb owns, references, and boundaries
- Eliminates redundancy between orbs
- Content development guidelines
- Unique essence, core function, primary domain for each orb

**RBI Role:**
- Reference for understanding orb definitions
- Validates content belongs to correct orb
- Ensures no redundancy in orb associations

**Status:** ✅ Core Architecture - Build into Console

---

### 2. **CANONICAL_13_ORB_SYSTEM_REFERENCE.md**
**Location:** `CMS_Backend/09_PROCESSED/02c_Supporting material/CANONICAL_13_ORB_SYSTEM_REFERENCE.md`

**Purpose:**
- Single source of truth for 13-Orb system definitions
- Orb personalities and system integration
- Special domains within the system
- Stabilized satellite orbs
- System integration points

**RBI Role:**
- Primary reference for orb definitions
- System integration mapping
- Dashboard module connections

**Status:** ✅ Core Architecture - Build into Console

---

### 3. **codex_Orb_Synthesis_Final.md**
**Location:** `CMS_Backend/09_PROCESSED/02c_Supporting material/codex_Orb_Synthesis_Final.md`

**Purpose:**
- Core synthesis of 13-Orb framework
- Orb definitions and foundational principles
- Special domains and satellite orbs
- Table format for quick reference

**RBI Role:**
- Quick reference for orb synthesis
- Foundation for content matching

**Status:** ✅ Core Architecture - Build into Console

---

### 4. **S2S — Undercurrents Codex.md**
**Location:** `CMS_Backend/09_PROCESSED/02c_Supporting material/S2S — Undercurrents Codex.md`

**Purpose:**
- 12 Undercurrents as contextual anchors
- Each undercurrent: synthesis, core theme, key elements
- Supports the Orb backbone
- Comprehensive tagging

**RBI Role:**
- Reference for undercurrent definitions
- Contextual anchors for content matching
- Supports orb associations

**Status:** ✅ Core Architecture - Build into Console

---

### 5. **Stardust to Sovereignty Backbone_ORIGINAL.md**
**Location:** `CMS_Backend/09_PROCESSED/02c_Supporting material/Stardust to Sovereignty Backbone_ORIGINAL.md`

**Purpose:**
- Original backbone document
- Complete system architecture
- Implementation details
- Book outline and applications
- Orb map table

**RBI Role:**
- System-wide architecture reference
- Integration points
- Book threading context

**Status:** ✅ Core Architecture - Build into Console

---

### 6. **I_Written_System_Description_CLEAN.md**
**Location:** `CMS_Backend/09_PROCESSED/02c_Supporting material/I_Written_System_Description_CLEAN.md`

**Purpose:**
- System architecture description
- Orb map table
- Functional domains
- System flows
- May be outdated but contains relevant information

**RBI Role:**
- System flow understanding
- Functional domain mapping
- May need review for accuracy

**Status:** ⚠️ Core Architecture - Build into Console (but verify/update if outdated)

---

## Content Files (Pull from CMS Backend to Console Backend Codex)

### Orb Essays
**Location:** `CMS_Backend/09_PROCESSED/02d_Orb_Essays/`

**Files:**
- `orb_1_origin_intelligence.md`
- `orb_2_resonance_mechanics.md`
- `orb_3_photonic_intelligence.md`
- `orb_4_harmonic_architectures_foundational.md`
- `orb_5_temporal_sovereignty_foundational.md`
- `orb_6_starline_memory_foundational.md`
- `orb_7_alchemical_current_foundational.md`
- `orb_8_quantum_intuition_foundational.md`
- `orb_9_temporal_fluidity_foundational.md`
- `orb_10_ancestral_repatterning_foundational.md`
- `orb_11_radiant_transparency_foundational.md`
- `orb_12_sovereign_field_foundational.md`
- `orb_13_bridging_intelligence_foundational.md`

**Sync Strategy:**
- Pull from CMS Backend when `console_ready=true` and `visibility='codex'`
- Auto-sync when new material is added and tagged correctly
- Tagged with orb associations, undercurrent associations, practice associations

---

### Codex Essays
**Location:** `CMS_Backend/09_PROCESSED/02f_S2S_codex_essays/`

**Files:** 46 codex essays

**Sync Strategy:**
- Pull from CMS Backend when `console_ready=true` and `visibility='codex'`
- Auto-sync when new material is added and tagged correctly
- Tagged with orb associations, undercurrent associations, practice associations, tags, categories

---

## RBI Analysis Flow

### Step 1: Load Core Architecture (Built into Console)
1. Load `13_ORB_SYSTEM_OUTLINE.md` - Orb definitions and boundaries
2. Load `CANONICAL_13_ORB_SYSTEM_REFERENCE.md` - Single source of truth
3. Load `codex_Orb_Synthesis_Final.md` - Core synthesis
4. Load `S2S — Undercurrents Codex.md` - Undercurrent definitions
5. Load `Stardust to Sovereignty Backbone_ORIGINAL.md` - System architecture
6. Load `I_Written_System_Description_CLEAN.md` - System flows (verify/update)

**RBI analyzes these FIRST to understand the system structure.**

### Step 2: Load Content (Pulled from CMS Backend)
1. Load orb essays from `02d_Orb_Essays/` (via Codex API)
2. Load codex essays from `02f_S2S_codex_essays/` (via Codex API)
3. Load practices/exercises (via Codex API)

**RBI uses architecture to understand what content means, then analyzes content.**

### Step 3: User Inquiry Processing
**Example:** User asks "What is free will and destiny?"

1. **RBI analyzes inquiry** using core architecture:
   - Identifies: Undercurrent 12 (Free Will vs Universal Flow)
   - Identifies: Orb 12 (Sovereign Field) - "Harmonizing choice with cosmic forces"
   - Identifies: Orb 5 (Temporal Sovereignty) - "Time as tool"
   - Identifies: Orb 9 (Temporal Fluidity) - "Synchronicity and destiny"

2. **RBI surfaces relevant content** (global, not linear):
   - Codex essays tagged with `free_will`, `destiny`, `sovereign_flow`
   - Orb essays for Orbs 5, 9, 12
   - Undercurrent 12 content
   - Practices related to temporal sovereignty and sovereign flow

3. **RBI pairs content with practical exercises**:
   - Matches inquiry to relevant practices
   - Suggests exercises from practice modules
   - Links to pathway steps

---

## Auto-Sync Strategy

### CMS Backend → Console Backend Codex

**Trigger:** When content in CMS Backend is:
- Tagged with `console_ready=true`
- Tagged with `visibility='codex'`
- Has proper metadata (orb associations, undercurrent associations, practice associations, tags, categories)

**Process:**
1. CMS Backend content is tagged and marked `console_ready=true`
2. Console Backend Codex API polls or receives webhook
3. Content is pulled into Console Backend Codex
4. RBI indexes new content with architecture context
5. Content becomes available for inquiry matching

**Implementation:**
- Codex API endpoint: `GET /api/codex/entries` (already exists)
- Filter by `console_ready=true` and `visibility='codex'`
- Console Backend periodically syncs or receives webhooks
- RBI re-indexes when new content arrives

---

## Summary

**Core Architecture (Build into Console):**
1. ✅ `13_ORB_SYSTEM_OUTLINE.md`
2. ✅ `CANONICAL_13_ORB_SYSTEM_REFERENCE.md`
3. ✅ `codex_Orb_Synthesis_Final.md`
4. ✅ `S2S — Undercurrents Codex.md`
5. ✅ `Stardust to Sovereignty Backbone_ORIGINAL.md`
6. ⚠️ `I_Written_System_Description_CLEAN.md` (verify/update)

**Content (Pull from CMS Backend):**
- Orb essays from `02d_Orb_Essays/`
- Codex essays from `02f_S2S_codex_essays/`
- Practices/exercises
- Auto-sync when tagged correctly

**RBI Flow:**
1. Analyze core architecture FIRST
2. Load content from CMS Backend
3. Match user inquiries to architecture → surface relevant content
4. Pair content with practical exercises
5. Global, non-linear content discovery

