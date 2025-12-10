# Console V3 Build Plan

## Overview

Complete rebuild of Console from exploration-based interface to **Sovereign Field Inquiry**-led pathway system.

**Current State:** Three-interface exploration tool (Orb Atlas, Resonance Library, Field Console)  
**Target State:** Sovereign Field Inquiry → SFI → Orb Cluster → Dynamic Practice Pathway system

**System Name:** **Sovereign Field Inquiry** (formerly "Diagnostic")
- Recognition-based, not assessment-based
- Inquiry-driven, not test-driven
- Field-sensing, not answer-aggregating

---

## Architecture Alignment

**Paradigm → Practice → Orb → Codex → Module → UI → Book**

- **Paradigm Layer:** Core principles (Reality as Field, Identity as Field, Temporal Fluidity, etc.)
- **Practice Layer:** 12 Lived Modules (1-4 Foundational, 5-8 Functional, 9-12 Advanced)
- **Orb Layer:** 13 architectural principles (structural coordinates)
- **Codex Layer:** Tagged content (essays, readings, practices)
- **Module Layer:** Practice Pathway bundles
- **UI Layer:** Sovereign Field Inquiry → Results → Pathway view
- **Book Layer:** Static publication (separate)

---

## Current Status Summary

**Last Updated:** 2025-01-26

### ✅ Completed Phases
- **Phase 0:** Content Organization & Tagging (Migration created, Codex API ready)
- **Phase 1.5:** Bug Fixes (SFI scoring, orb profile handling, CORS headers)
- **Phase 2.5:** Question Management System ✅
  - 22 diagnostic questions loaded (8 original + 14 new)
  - Question metadata system complete
  - Admin API endpoints ready
- **Phase 7:** RBI + Orbital Brain Integration ✅
  - RBI Kernel integrated into SFI computation
  - Resonance-based pathway matching
  - Coherence-based practice sequencing
- **Phase 8:** Inquiry Capability System ✅
  - 53 inquiry questions loaded
  - Inquiry API endpoints ready
  - Database schema complete
  - **Phase 8.3: Orbital Brain Integration ✅**
    - Inquiry service created with Orbital Brain integration
    - RBI analysis included in responses
    - Context-aware responses using diagnostic session field state
    - All tests passing

### ✅ Recently Completed
- **Phase 4.5:** Complete Pathway View Components ✅
  - All components verified and enhanced
  - Full responsive design implemented
  - CodexReader and PracticeModule integration complete
  - Pathway page fully functional
- **Phase 6:** Access System Integration ✅ (Core Complete)
  - CORS headers added to all access endpoints
  - Access check hook created (useAccessCheck)
  - AccessGate component created
  - Pathway and Inquiry routes protected
  - Diagnostic page intentionally NOT protected (entry point)

### 📋 Next Priorities
- **Phase 6:** Access System Integration (Remaining: UI status display, token claim page, preorder integration)
- **Phase 0:** Content Tagging (Foundation for content connection)
- **Phase 8.5:** Enhanced context-aware inquiry (Codex recommendations, pathway step context)

---

## Phase Breakdown

### Phase 0: Content Organization & Tagging (NEW - Critical Foundation)
**Status:** Not Started  
**Effort:** Medium  
**Priority:** Critical - Must be done before content connection

#### 0.1 Content Metadata Enhancement
- [ ] Add content tagging fields to CMS content tables:
  - `status: 'draft' | 'review' | 'published'`
  - `visibility: 'internal' | 'codex' | 'public'`
  - `console_ready: boolean` - Explicit flag for Console consumption
  - `console_tags: string[]` - Pathway/practice/orb associations
  - `codex_category: 'essay' | 'scroll' | 'interlude' | 'field_report'`
- [ ] Create migration for content metadata fields
- [ ] Update TypeScript types for content with new fields

#### 0.2 Content Curation Workflow
- [ ] Create content curation UI in CMS admin
- [ ] Workflow: Draft → Review → Codex (console_ready=true)
- [ ] Content tagging interface for Console associations
- [ ] Version control for content (track changes, rollback)

#### 0.3 Codex API Endpoint
- [ ] Create `GET /api/codex/entries` endpoint in CMS_Backend
- [ ] Filter by `console_ready=true` and `visibility='codex'`
- [ ] Support filtering by tags, category, orb associations
- [ ] Create `GET /api/codex/entries/[id]` for individual entries
- [ ] Add CORS headers for Console Backend consumption

#### 0.4 Content Tagging & Organization
- [ ] Tag existing content appropriately
- [ ] Identify Codex-ready content from CMS workspace
- [ ] Map content to pathway steps, practices, orbs
- [ ] Create content-to-console mapping documentation

**Location:** `CMS_Backend/`  
**Dependencies:** Existing content tables, CMS admin UI

---

### Phase 1: Console Page Update (Website) ✅
**Status:** In Progress  
**Effort:** Low

- [x] Update `/console` page copy to reflect Sovereign Field Inquiry model
- [x] Remove references to three interfaces
- [x] Add "What the Console Does" section
- [x] Add "What You Receive" section
- [x] Add access options (preorder + console-only)
- [x] Update orientation language

**Files:**
- `s2s-frontend/s2s-website/app/console/page.tsx`

---

### Phase 1.5: Fix Critical End-to-End Issues (NEW - Blocking)
**Status:** ✅ Completed  
**Effort:** High  
**Priority:** Critical - Must fix before proceeding

#### 1.5.1 Fix Sovereign Field Inquiry Results ✅
- [x] Fix answer-specific orb weight mapping
  - Enhanced: Distance-based emphasis factor (0.5-1.5 range)
  - Closer option/orb positions = higher emphasis
  - Clamped to prevent extreme values
- [x] Verify answer parsing produces different normalized values
- [x] Test that different answer selections produce different SFI results
- [x] Add debug logging (development mode only)

#### 1.5.2 Fix Practices Populating ✅
- [x] Verify pathway templates have `practice_sequence` defined
- [x] Ensure pathway steps are created when pathway is generated
  - Added `ensurePathwaySteps()` function
  - Creates steps from template's `practice_sequence`
  - Adds optional introduction step
- [x] Check that practice data exists (all 12 practices)
- [x] Test pathway creation flow end-to-end
  - Updated `buildPathwayFromTemplate()` to ensure steps exist
  - Updated pathway creation endpoint to use pathway service

#### 1.5.3 Connect Content ✅
- [x] Implement Codex entry fetching in pathway-service.ts
  - Updated `getPathwayContent()` to fetch from `content_files` table
  - Filters by `console_ready=true` and `visibility='codex'`
- [x] Connect Codex API endpoint to pathway steps
  - Uses `/api/codex/entries/[id]` endpoint
- [x] Update CodexReader component to use correct endpoint
  - Changed from `/api/console/v3/codex/entries/` to `/api/codex/entries/`
  - Updated to handle API response format
- [x] Test content loading in pathway steps

**Location:** `CMS_Backend/lib/services/console-v3/` + `CMS_Backend/app/api/console/v3/`

---

### Phase 2: Backend Data Models ✅
**Status:** Completed  
**Effort:** High

#### 2.1 Sovereign Field Inquiry System Tables ✅
- [x] `diagnostic_questions` table
  - `id`, `slug`, `text`, `response_type`, `orb_weights`, `undercurrent_weights`, `tags`
- [x] `diagnostic_sessions` table
  - `id`, `user_id`, `created_at`, `status`, `sfi_score`, `sfi_state`, `orb_profile`, `undercurrent_profile`
- [x] `diagnostic_responses` table
  - `id`, `session_id`, `question_id`, `raw_answer`, `derived_signal`

#### 2.2 Pathway System Tables ✅
- [x] `pathway_templates` table
  - `id`, `slug`, `name`, `description`, `orb_focus[]`, `practice_sequence[]`, `primary_practice`, `secondary_practices[]`
- [x] `pathway_steps` table
  - `id`, `pathway_template_id`, `step_number`, `type`, `codex_entry_id`, `est_duration`
- [x] `user_pathways` table
  - `id`, `user_id`, `session_id`, `pathway_template_id`, `steps[]` (progress state)
- [x] `user_pathway_step_progress` table (progress tracking)

#### 2.3 Practice System (All 12 Practices from Start) ✅
- [x] Implement all 12 practices from the beginning:
  - **Foundational (1-4):** Field Awareness, De-Personing, Somatic Signal Activation, Temporal Listening
  - **Functional (5-8):** Multi-Scale Tracking, Source-Point Decisioning, Pattern Rewriting, Signal Alignment
  - **Advanced (9-12):** Field Merging/Coherence Weaving, Sovereign Relational Dynamics, Temporal Constellation Navigation, Origin-State Access
- [x] Add practice layer classification (foundational, functional, advanced)
- [x] `practices` table with all 12 practices
- [x] `practice_orb_mappings` table for Practice-Orb relationships
- [x] Practice readiness assessment fields in diagnostic_sessions

#### 2.4 Access System Tables ✅
- [x] `products` table (product definitions)
- [x] `orders` table (preorder system)
- [x] `access_tokens` table (console beta access)
- [x] `user_products` table (product access tracking)

#### 2.5 TypeScript Types ✅
- [x] Created `lib/types/console-v3.ts` with all type definitions
- [x] Types for inquiry, pathway, practice, and access systems
- [x] API request/response types

**Location:** 
- Database: `CMS_Backend/supabase/migrations/20250126_console_v3_diagnostic_system.sql` (table names remain for compatibility)
- Types: `CMS_Backend/lib/types/console-v3.ts`

---

### Phase 3: Backend Services ✅
**Status:** Completed  
**Effort:** High

#### 3.1 Sovereign Field Inquiry Service ✅
- [x] `GET /api/console/v3/questions` - Fetch inquiry questions
- [x] `POST /api/console/v3/sessions` - Start inquiry session
- [x] `POST /api/console/v3/sessions/{id}/responses` - Submit responses
- [x] `POST /api/console/v3/sessions/{id}/complete` - Complete session and compute results
- [x] `computeSFI()` - Calculate SFI score and state (in diagnostic-service.ts)
- [x] `computePracticeReadiness()` - Assess readiness across all layers (in diagnostic-service.ts)
- [x] `matchPathway()` - Match to pathway template (in diagnostic-service.ts)

#### 3.2 Pathway Service ✅
- [x] `GET /api/console/v3/pathway` - Get current UserPathway
- [x] `GET /api/console/v3/pathway/steps` - Get pathway steps for template
- [x] `POST /api/console/v3/pathway/steps/{id}/complete` - Mark step complete
- [x] `buildPathwayFromTemplate()` - Create UserPathway (in pathway-service.ts)
- [x] `getPathwayContent()` - Fetch Codex entries for step (in pathway-service.ts)

#### 3.3 Practice Service (All 12 Practices) ✅
- [x] `GET /api/console/v3/practices` - Get practices by layer or all practices
- [x] `GET /api/console/v3/practices/{id}` - Get specific practice (1-12)
- [x] `GET /api/console/v3/practices/sequence` - Get practice sequence by layer or map Orbs to practices
- [x] Practice readiness assessment integrated into inquiry service
- [x] Orb-to-Practice mapping via `practice_orb_mappings` table

#### 3.4 Access Service ✅
- [x] `GET /api/console/v3/access/check` - Verify user has console access
- [x] `POST /api/console/v3/access/tokens` - Generate access token
- [x] `POST /api/console/v3/access/tokens/claim` - Claim token and activate access

**Location:** 
- API Routes: `CMS_Backend/app/api/console/v3/`
- Service Logic: `CMS_Backend/lib/services/console-v3/`

---

### Phase 4: Architecture Refactor (Console Backend Separation)
**Status:** Planned  
**Effort:** Very High  
**Priority:** After core functionality works

**Timing:** Do this AFTER Phase 1.5 (fixes) and Phase 0 (content) are complete and validated.

#### 4.1 Create Console Backend Structure
- [ ] Create `s2s-console-backend/` directory in monorepo
- [ ] Set up Next.js API structure
- [ ] Configure Supabase connection (shared instance, separate schema)
- [ ] Set up RBI-Kernel and Orbital-Brain as workspace dependencies
- [ ] Create base API route structure

#### 4.2 Move Console Logic from CMS_Backend
- [ ] Move `lib/services/console-v3/` → `s2s-console-backend/lib/services/`
- [ ] Move `app/api/console/v3/` → `s2s-console-backend/app/api/`
- [ ] Move `lib/types/console-v3.ts` → `s2s-console-backend/lib/types/`
- [ ] Update all imports and references
- [ ] Update database schema (create console_* namespace or separate tables)

#### 4.3 Integrate RBI + Orbital Brain
- [ ] Import RBI-Kernel into Console Backend
- [ ] Replace simple weighted sums with RBI field computation
- [ ] Integrate Orbital Brain for pathway generation
- [ ] Use RBI for real-time field sensing
- [ ] Generate dynamic pathways using RBI + Orbital Brain

#### 4.4 Update Console Frontend
- [ ] Update API calls to point to Console Backend (not CMS_Backend)
- [ ] Update environment variables
- [ ] Test end-to-end flow with new backend

#### 4.5 Create CMS Codex API
- [ ] Create `GET /api/codex/entries` in CMS_Backend
- [ ] Filter by `console_ready=true`
- [ ] Console Backend calls CMS_Backend for Codex content
- [ ] Set up proper authentication/authorization

**Location:** New `s2s-console-backend/` + `CMS_Backend/` (Codex API)

---

### Phase 4.5: Console App Rebuild (Frontend)
**Status:** ✅ Complete  
**Effort:** Very High

**Note:** All components in this phase must be fully responsive across all devices (mobile, tablet, desktop). See "Responsive Design Requirements" section for detailed specifications.

#### 4.1 Remove Current Structure ✅
- [x] Archive current three-interface structure (directory was empty, started fresh)
- [x] Created new Console V3 structure from scratch

#### 4.2 Sovereign Field Inquiry Flow (All Responsive) ✅
- [x] `ConsoleLayout` - Main shell with responsive navigation (mobile hamburger, desktop horizontal)
- [x] `InquiryIntro` (formerly DiagnosticIntro) - Orientation screen with Console V3 language (responsive typography & layout)
- [x] `InquiryQuestion` (formerly DiagnosticQuestion) - Question display with response types (mobile-friendly touch targets, 44px+ buttons)
- [x] `InquiryProgress` (formerly DiagnosticProgress) - Progress indicator (compact on mobile, expanded on desktop)
- [x] `InquirySummary` (formerly DiagnosticSummary) - Results screen (SFI, Orb Cluster, Pathway overview) with responsive grid layouts

#### 4.3 Pathway View (Complete) ✅
- [x] `PathwayView` - Main pathway dashboard (responsive layout)
- [x] Basic pathway step display
- [x] `PathwayStep` - Individual step component with full details (readable width, responsive media, CodexReader/PracticeModule integration)
- [x] `PathwayProgress` - Enhanced progress tracking (responsive visualization)
- [x] `CodexReader` - Codex entry viewer (optimal reading width, responsive navigation)
- [x] `PracticeModule` - Practice instruction display (responsive layout, touch-friendly)

#### 4.4 Session Management (Basic Implementation)
- [x] Basic localStorage-based session persistence
- [ ] `SessionProvider` - Context for inquiry session (for better state management)
- [ ] `PathwayProvider` - Context for user pathway
- [ ] Auto-save responses (works across all devices)
- [ ] Resume incomplete sessions (mobile-friendly resume flow)

**Location:** `s2s-frontend/s2s-console/`

**Files Created:**
- Base structure: `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
- Layout: `app/layout.tsx`, `app/globals.css`
- Components: `components/ConsoleLayout.tsx`, `components/DiagnosticProgress.tsx` (to be renamed to InquiryProgress)
- Pages: `app/page.tsx`, `app/diagnostic/page.tsx`, `app/diagnostic/question/[index]/page.tsx`, `app/diagnostic/summary/page.tsx`, `app/pathway/page.tsx`
- Note: Component/page names will be updated to reflect "Sovereign Field Inquiry" terminology

---

### Phase 2.5: Question Management System ✅
**Status:** ✅ Complete  
**Effort:** Medium  
**Priority:** High - Needed for inquiry capability and early reader questions

#### 2.5.1 Question Metadata Enhancement ✅
- [x] Add question metadata fields:
  - `question_set: 'beta' | 'early_reader' | 'inquiry' | 'contextual'`
  - `source: 'early_reader_feedback' | 'system_generated' | 'user_submitted'`
  - `inquiry_context: string` - When to show this question
  - `triggers: jsonb` - What field states trigger this question
  - `follow_up_question_ids: integer[]` - Follow-up question relationships
  - `selection_priority: integer` - Priority for question selection
  - `is_active: boolean` - Active status
- [x] Create migration for question metadata (`20250126_phase_2_5_question_metadata.sql`)
- [x] Update TypeScript types
- [x] Fix order_index constraint (`20250126_fix_order_index_constraint.sql`)

#### 2.5.2 Question Management API ✅
- [x] Create admin API endpoints:
  - `POST /api/console/v3/questions` - Create new question
  - `PUT /api/console/v3/questions/[id]` - Update question
  - `DELETE /api/console/v3/questions/[id]` - Delete/deactivate question
- [x] Question service with dynamic selection (`question-service.ts`)
- [x] Support for question sets and triggers
- [x] Follow-up question integration

#### 2.5.3 Diagnostic Questions Loaded ✅
- [x] **22 diagnostic questions** loaded into database (beta set)
  - 8 original questions (order_index 1-8)
  - 14 new S2S-aware questions (order_index 9-22)
- [x] All questions have proper `orb_weights` mapping
- [x] Questions cover: signal orientation, field sensitivity, temporal sovereignty, relational patterns, creative infrastructure, somatic coherence, and more
- [x] Loader script created (`load-diagnostic-questions.ts`)

#### 2.5.4 Question Management UI (Future Enhancement)
- [ ] Create admin UI for adding/editing questions
- [ ] Support for preselected question sets
- [ ] Tag questions by source (early reader, beta, etc.)
- [ ] Question preview and testing interface

#### 2.5.5 Preselected Questions from Early Readers
- [ ] Review extracted files from book readers
- [ ] Identify questions that should be preselected
- [ ] Load early reader questions into database
- [ ] Tag as `question_set: 'early_reader'`
- [ ] Make available in inquiry interface

#### 2.5.4 Dynamic Question Selection
- [ ] Logic to select questions based on:
  - Question set (beta, early_reader, etc.)
  - Field state triggers
  - Inquiry context
  - User's current pathway state
- [ ] Support for follow-up questions
- [ ] Adaptive question ordering

**Location:** `CMS_Backend/app/api/console/v3/questions/` + Admin UI

---

### Phase 5: Advanced Practices Integration
**Status:** Integrated into Phase 2-4  
**Note:** All 12 practices are built in from the start, not as a later addition.

#### 5.0 Additional Practices from Book (NEW - Optional Extension)
**Status:** Pending Review  
**Effort:** TBD  
**Priority:** Low - Review extracted files first

- [ ] Review raw practice files extracted from book
- [ ] Determine if they are:
  - Variations of existing 12 practices → Add as variations/contexts
  - New distinct practices → Add as optional extensions
  - Context-specific modules → Add as contextual practices
  - Integration practices → Add as combination modules
- [ ] If new practices are identified:
  - [ ] Extend practices table (or create `practice_variations` table)
  - [ ] Map to existing 12-practice structure
  - [ ] Integrate into pathway generation
- [ ] Decision: Keep 12 core practices as primary, additional as extensions

**Location:** TBD after file review

#### 5.1 Practice 9-12 Data (Built in Phase 2)
- [x] Practice 9: Field Merging / Coherence Weaving (included from start)
- [x] Practice 10: Sovereign Relational Dynamics (included from start)
- [x] Practice 11: Temporal Constellation Navigation (included from start)
- [x] Practice 12: Origin-State Access (included from start)

#### 5.2 Advanced Readiness Assessment (Built in Phase 3)
- [x] Diagnostic includes advanced readiness assessment from start
- [x] Advanced practice questions included in diagnostic
- [x] Readiness assessment logic supports all three layers

#### 5.3 Advanced Pathway Templates (Built in Phase 3)
- [x] Pathway templates can include advanced practices from start
- [x] Pathway matching considers advanced readiness
- [x] Advanced practice modules available in Codex from start

**Location:** Integrated into `CMS_Backend/` + `s2s-frontend/s2s-console/`

---

### Phase 6: Access System Integration
**Status:** Core Complete (Remaining: UI enhancements, token claim page, preorder integration)  
**Effort:** Medium

#### 6.1 Preorder Integration
- [ ] Link preorder to console beta access
- [ ] Email invitation flow
- [ ] Token claim flow

#### 6.2 Console-Only Access
- [ ] Console-only product definitions
- [ ] Purchase flow
- [ ] Subscription management (if applicable)

#### 6.3 Access Gating ✅
- [x] Protect console routes with access check
- [x] Redirect to `/console` info page if no access
- [x] CORS headers added to all access endpoints
- [x] Access check hook created (useAccessCheck)
- [x] AccessGate component created
- [ ] Show access status in UI

**Location:** `CMS_Backend/` + `s2s-frontend/s2s-website/`

---

## Design Palette Alignment

**Console App:** White Editorial Design (already implemented)
- Background: `#ffffff`
- Text: `#111111`
- Accent: `#c5a96e` (gold)
- Typography: Inter (headings), Lora (body), JetBrains Mono (code)

**Website:** Deep Navy Design
- Background: `#1C1F3B`
- Text: `#F4F1E8`
- Accent: `#C49A6C` (deep gold)

**Action:** Ensure all new Console V3 components use white editorial design palette.

---

## Responsive Design Requirements

**All Console V3 components must be fully responsive across all devices.** This is a core requirement for the entire build.

### Breakpoint Strategy

**Tailwind CSS Standard Breakpoints:**
- `sm:` - 640px and up (small tablets, large phones)
- `md:` - 768px and up (tablets)
- `lg:` - 1024px and up (small laptops)
- `xl:` - 1280px and up (desktops)
- `2xl:` - 1536px and up (large desktops)

**Mobile-First Approach:**
- All components start with mobile styles (base classes)
- Progressive enhancement for larger screens
- Touch-friendly interactions (minimum 44x44px touch targets)

### Responsive Patterns (Aligned with Website)

#### Typography
- Headings: `text-3xl md:text-4xl lg:text-5xl` (scales up)
- Body: `text-base md:text-lg` (readable on all screens)
- Line height: `leading-relaxed` or `leading-tight` for headings
- Max-width containers: `max-w-4xl mx-auto` for readability

#### Spacing
- Padding: `px-4 sm:px-6 md:px-8` (responsive horizontal padding)
- Vertical spacing: `py-8 md:py-12 lg:py-16` (responsive vertical padding)
- Section gaps: `mb-12 md:mb-16 lg:mb-20` (responsive margins)

#### Layout
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (responsive columns)
- Flex: `flex flex-col sm:flex-row` (stack on mobile, row on larger screens)
- Containers: `max-w-4xl mx-auto px-4 md:px-8` (centered with responsive padding)

### Component-Specific Responsive Requirements

#### 4.2 Sovereign Field Inquiry Flow Components

**InquiryIntro (formerly DiagnosticIntro):**
- [ ] Full-width on mobile, max-width container on desktop
- [ ] Text scales: `text-2xl md:text-3xl lg:text-4xl` for headings
- [ ] Button stack: `flex-col sm:flex-row` for action buttons
- [ ] Padding: `p-6 md:p-8 lg:p-12`

**InquiryQuestion (formerly DiagnosticQuestion):**
- [ ] Single column on mobile, max-width centered on desktop
- [ ] Question text: `text-lg md:text-xl` (readable on small screens)
- [ ] Response options: Stack vertically on mobile, grid on desktop
- [ ] Touch targets: Minimum 48px height for buttons/options
- [ ] Progress indicator: Horizontal on all screens, compact on mobile

**InquiryProgress (formerly DiagnosticProgress):**
- [ ] Compact on mobile (`text-sm`), expanded on desktop
- [ ] Progress bar: Full width on all screens
- [ ] Question counter: `text-sm md:text-base`

**InquirySummary (formerly DiagnosticSummary):**
- [ ] Results cards: `grid grid-cols-1 md:grid-cols-2` (stack on mobile)
- [ ] SFI visualization: Responsive SVG or canvas
- [ ] Orb Cluster: Scrollable horizontal on mobile, grid on desktop
- [ ] Pathway preview: Full-width cards on mobile, side-by-side on desktop

#### 4.3 Pathway View Components

**PathwayView (Dashboard):**
- [ ] Pathway steps: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- [ ] Progress overview: Stack on mobile, side-by-side on desktop
- [ ] Navigation: Horizontal scroll on mobile, full nav on desktop
- [ ] Filters/Search: Full-width on mobile, inline on desktop

**PathwayStep:**
- [ ] Content width: `max-w-3xl mx-auto` (readable line length)
- [ ] Step navigation: Stack buttons on mobile, inline on desktop
- [ ] Media (images/diagrams): Responsive with `max-w-full`
- [ ] Codex entry preview: Full-width on mobile, sidebar on desktop

**PathwayProgress:**
- [ ] Progress bar: Full-width on all screens
- [ ] Step indicators: Compact dots on mobile, labels on desktop
- [ ] Completion stats: Stack on mobile, grid on desktop

**CodexReader:**
- [ ] Reading width: `max-w-2xl mx-auto` (optimal reading width)
- [ ] Typography: `text-base md:text-lg` (readable on all screens)
- [ ] Navigation: Bottom sticky on mobile, sidebar on desktop
- [ ] Table of contents: Collapsible drawer on mobile, sidebar on desktop

**PracticeModule:**
- [ ] Instructions: Full-width on mobile, two-column on desktop
- [ ] Practice steps: Numbered list, full-width on all screens
- [ ] Media/Diagrams: Responsive, centered
- [ ] Action buttons: Full-width on mobile, auto-width on desktop

#### 4.1 ConsoleLayout (Main Shell)

**Navigation:**
- [ ] Mobile: Hamburger menu (slide-out drawer)
- [ ] Desktop: Horizontal navigation bar
- [ ] Logo/Brand: Scales appropriately (`text-xl md:text-2xl`)
- [ ] Active states: Clear on all screen sizes

**Main Content Area:**
- [ ] Padding: `px-4 sm:px-6 md:px-8 lg:px-12`
- [ ] Max-width: `max-w-7xl mx-auto` (prevents over-stretching)
- [ ] Sidebar (if applicable): Hidden on mobile, visible on desktop

### Touch & Interaction Requirements

**Touch Targets:**
- Minimum 44x44px for all interactive elements
- Adequate spacing between touch targets (8px minimum)
- Large tap areas for buttons on mobile

**Gestures:**
- Swipe navigation for inquiry questions (optional enhancement)
- Pull-to-refresh for pathway updates (if applicable)
- Smooth scrolling for long content

**Form Inputs:**
- Full-width on mobile (`w-full`)
- Appropriate input types (number, email, etc.) for mobile keyboards
- Large, readable labels and placeholders
- Error states clearly visible on all screen sizes

### Performance Considerations

**Images & Media:**
- Use Next.js `Image` component with responsive sizing
- Lazy loading for below-the-fold content
- Optimized formats (WebP, AVIF where supported)

**Code Splitting:**
- Route-based code splitting (automatic with Next.js)
- Component lazy loading for heavy components
- Progressive loading for inquiry flow

### Testing Requirements

**Device Testing:**
- [ ] Mobile phones (320px - 640px)
- [ ] Tablets (640px - 1024px)
- [ ] Laptops (1024px - 1440px)
- [ ] Desktops (1440px+)

**Browser Testing:**
- [ ] Chrome (mobile & desktop)
- [ ] Safari (iOS & macOS)
- [ ] Firefox
- [ ] Edge

**Accessibility:**
- [ ] Keyboard navigation works on all screen sizes
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus states visible on all interactive elements

### Implementation Checklist

**Phase 4 (Console App Rebuild) - Responsive Requirements:**
- [ ] All diagnostic flow components are responsive
- [ ] All pathway view components are responsive
- [ ] ConsoleLayout navigation works on mobile and desktop
- [ ] Touch targets meet minimum size requirements
- [ ] Typography scales appropriately across breakpoints
- [ ] Images and media are responsive
- [ ] Forms are mobile-friendly
- [ ] Testing completed on multiple devices

**Design System Alignment:**
- Console V3 components follow the same responsive patterns as the website
- Consistent breakpoint usage across all components
- Shared responsive utility classes where applicable

---

## Key Decisions & Notes

### Sovereign Field Inquiry Questions
- **Initial:** 8 questions (beta set) - can be extended
- **Full System:** Supports dynamic question sets (beta, early_reader, inquiry, contextual)
- **Format:** Single-choice/multi-choice/scale, with dynamic selection
- **Advanced Readiness:** Inquiry includes questions to assess readiness for practices 9-12
- **Question Sets:**
  - `beta` - Initial beta question set
  - `early_reader` - Questions from early book readers
  - `inquiry` - User-initiated questions
  - `contextual` - Questions triggered by field state

### Practice System (All 12 Built In)

**All 12 practices are implemented from the start.** The diagnostic assesses readiness across all three layers, and pathways can include advanced practices when the user's field configuration indicates readiness.

#### Foundational Practices (1-4)
1. **Field Awareness** - Reality is understood as signal
2. **De-Personing** - Identity reorganizes as field instead of persona
3. **Somatic Signal Activation** - The body becomes interface, not container
4. **Temporal Listening** - Time becomes fluid instead of linear

**Outcome:** The individual exits inherited perception and begins operating from field-based awareness.

#### Functional Practices (5-8)
5. **Multi-Scale Tracking** - Perception becomes multidimensional
6. **Source-Point Decisioning** - Sovereignty becomes the locus of choice
7. **Pattern Rewriting** - Creation shifts from outcome to architecture
8. **Signal Alignment** - Intuition integrates with larger networks of intelligence

**Outcome:** The individual becomes architect, not participant. They create through coherence instead of force.

#### Advanced Practices (9-12)
9. **Field Merging / Coherence Weaving** - Operate in shared fields without distortion
10. **Sovereign Relational Dynamics** - Relate without collapse, fusion, or projection
11. **Temporal Constellation Navigation** - Move across timelines and nodal points with precision
12. **Origin-State Access** - Function from the pre-identity source of coherence

**Outcome:** The individual becomes a generator, not a reactor—a coherent field in relationship with other fields and timelines.

### Practice Readiness Assessment

The diagnostic includes questions to assess readiness for all three layers:
- **Foundational Readiness:** Signal capacity, field stability, identity fluidity
- **Functional Readiness:** Multi-layer perception, intuitive decisioning, pattern recognition, networked intelligence
- **Advanced Readiness:** Field coherence, relational mastery, timeline awareness, origin-state access

### Pathway Logic
- **Current (Template-Based):** Inquiry results → SFI → Orb Cluster → Practice Readiness Assessment → Template Matching → Pathway
- **Target (Dynamic):** Inquiry results → RBI Field Computation → Orbital Brain Interpretation → Dynamic Practice Sequence → Pathway Generation
- Pathway includes Codex entries matched to practices (1-12, based on readiness)
- Pathway can include advanced practices (9-12) if inquiry indicates readiness
- Pathway evolves as user progresses
- Pathway can adjust based on inquiry responses

### Access Model
- Preorder includes console beta access
- Console-only access (one-time or subscription) - coming soon
- Access tokens linked to email/user account

---

## Dependencies

1. **Backend CMS** - Must support inquiry/pathway data models and Codex content API
2. **RBI Kernel** - Can be adapted for SFI calculation
3. **Codex System** - Must support practice tagging (1-12)
4. **Access System** - Token management and gating

---

## Success Criteria

- [ ] Console page accurately describes Sovereign Field Inquiry model
- [ ] Inquiry flow works end-to-end (questions → responses → SFI → pathway)
- [ ] SFI calculation produces different results for different answer selections
- [ ] Practices populate correctly in pathway steps
- [ ] Codex content loads in pathway steps
- [ ] Pathway matching produces relevant pathways (or dynamic generation works)
- [ ] Practice modules (1-12) are accessible from the start
- [ ] Advanced practices (9-12) are available when user readiness is indicated
- [ ] Codex entries are properly linked to pathway steps
- [ ] Content tagging system works (console_ready, visibility, etc.)
- [ ] Access gating works correctly
- [ ] White editorial design is consistent throughout
- [ ] **All components are fully responsive (mobile, tablet, desktop)**
- [ ] **Touch targets meet minimum 44x44px requirement**
- [ ] **Typography scales appropriately across all breakpoints**
- [ ] **Navigation works seamlessly on mobile and desktop**
- [ ] **Forms and inputs are mobile-friendly**
- [ ] **Testing completed on multiple devices and browsers**
- [ ] RBI + Orbital Brain integrated (Phase 7)
- [ ] Inquiry capability functional (Phase 8)

---

## Next Steps (Updated Priority Order)

1. ✅ Update Console page (complete)
2. ✅ **Phase 0: Content Organization** - Codex API created, content tagging migration ready
3. ✅ **Phase 1.5: Fix Critical Issues** - Inquiry results, practices, content connection fixed
4. ✅ **Phase 7: RBI + Orbital Brain Integration** - Complete and tested
5. **Phase 2.5: Question Management** - ✅ Complete (22 diagnostic questions loaded, metadata system ready)
6. **Phase 8: Inquiry Capability** - ✅ Complete (53 inquiry questions loaded, API ready, Orbital Brain integrated)
7. **Phase 8.4: Inquiry Interface** - ✅ Complete (Inquiry UI added to Console)
8. **Phase 4.5: Console App Rebuild** - ✅ Complete (Pathway View components complete)
9. **Phase 6: Access System** - ✅ Core Complete (Access gating implemented)
10. **Phase 4: Architecture Refactor** - Separate Console Backend (after core works)

**Note:** Advanced practices (9-12) are built in from the start, not added later.

---

## Commit & Push Strategy

### When to Commit
- **After each logical unit of work:**
  - After fixing inquiry results
  - After adding content tagging
  - After fixing practices
  - After connecting content
  - After completing each phase
- **Before major refactors:** Create checkpoint commit
- **After critical bug fixes:** Immediate commit

### When to Push
- **Push frequently:** At least daily if actively working
- **Push after each phase completion**
- **Push before major refactors** (create checkpoint)
- **Push after fixing critical bugs**

### Recommended Workflow
1. Create feature branch: `console-v3-sovereign-field-inquiry`
2. Commit after each fix/feature with descriptive messages
3. Push daily or after each phase
4. Create PR when phase is complete
5. Merge after review/testing

### What to Commit Now (Before Refactor)
- ✅ Phase 0: Content organization changes
- ✅ Phase 1.5: Critical fixes (inquiry results, practices, content)
- ✅ Phase 2.5: Question management system
- ✅ Any working code that fixes blocking issues

### What to Wait On (After Refactor)
- Architecture refactor (Phase 4) - commit as separate PR
- Major component renaming (diagnostic → inquiry) - can be done incrementally
- Database schema changes for architecture separation

**Recommendation:** Commit and push Phase 0, 1.5, and 2.5 fixes now. Do architecture refactor (Phase 4) in separate branch/PR after core functionality is validated.

---

---

## Phase 7: RBI + Orbital Brain Integration (V3 Enhancement) ✅
**Status:** ✅ Complete  
**Effort:** High  
**Priority:** Critical for V3  
**Reference:** See `CMS_Backend/docs/RBI_ARCHITECTURE_LEVERAGE_ASSESSMENT.md` and `CMS_Backend/docs/PHASE_7_PROGRESS.md` for implementation details

### 7.1 RBI Integration into Sovereign Field Inquiry System ✅
**Status:** Complete and Tested

- [x] Replace manual cosine similarity with `EnhancedResonanceEngine.analyzeContentWithMathematics()`
- [x] Use RBI Kernel's coherence computation instead of manual calculations
- [x] Implement metadata-first approach with ContentMetadata
- [x] Compute resonance vectors using RBI's field dynamics
- [x] Use RBI's Proof-of-Meaning validation for diagnostic responses
- [x] Extract orb_profile and undercurrent_profile from RBI analysis results
- [x] Use RBI's coherence metrics (field_strength, stability, gradient) for SFI calculation
- [x] Integrate core architecture loader (3 core architecture files)
- [x] Validate orb/undercurrent associations against architecture
- [x] Add content coherence validation (Codex entries and practices)

**Implementation Details:**
- ✅ Imported `EnhancedResonanceEngine` from `rbi-kernel`
- ✅ Built ContentMetadata with orb_associations from diagnostic responses
- ✅ Using `analyzeContentWithMathematics()` for full field signature computation
- ✅ Extracting results from `analysis.mathematical` (fieldDynamics, sovereignLogic, resonanceVector)
- ✅ Architecture loader validates against core S2S architecture files

**Files Modified:**
- ✅ `CMS_Backend/lib/services/console-v3/rbi-integration-service.ts` - Complete rewrite
- ✅ `CMS_Backend/lib/services/console-v3/diagnostic-service.ts` - Uses RBI results for SFI
- ✅ `CMS_Backend/lib/services/console-v3/architecture-loader.ts` - New service
- ✅ `CMS_Backend/lib/services/console-v3/content-validation-service.ts` - New service
- ✅ `CMS_Backend/app/api/codex/entries/[id]/route.ts` - Content validation integration
- ✅ `CMS_Backend/app/api/console/v3/practices/[id]/route.ts` - Practice validation integration

**Test Scripts:**
- ✅ `CMS_Backend/scripts/test-phase-7-1-rbi-integration.ts` - RBI integration test
- ✅ `CMS_Backend/scripts/test-architecture-loader.ts` - Architecture loader test

### 7.2 Resonance-Based Pathway Matching ✅
**Status:** Complete and Tested

- [x] Replace fixed template matching with RBI resonance-based matching
- [x] Use RBI's `calculateResonanceSimilarity()` for coherence-based matching
- [x] Filter pathways by RBI coherence (> 0.7 threshold)
- [x] Rank by resonance score (60% weight) + field alignment (25%) + layer readiness (15%)
- [x] Include fallback to simple scoring if RBI fails

**Implementation Details:**
- ✅ Uses `engine.calculateResonanceSimilarity()` for coherence-based matching
- ✅ Filters pathways by RBI coherence score (> 0.7 threshold)
- ✅ Ranks by resonance score (coherence-based, not semantic similarity)
- ✅ Includes fallback to simple scoring if RBI fails

**Files Modified:**
- ✅ `CMS_Backend/lib/services/console-v3/diagnostic-service.ts` - Updated `matchPathway()` function

**Test Scripts:**
- ✅ `CMS_Backend/scripts/test-phase-7-2-pathway-matching.ts` - Pathway matching test

### 7.3 Dynamic Practice Sequence Generation ✅
**Status:** Complete and Tested

- [x] Replace fixed template matching with coherence-based sequence generation
- [x] Use RBI's `calculateResonanceSimilarity()` for practice matching
- [x] Generate practice sequences based on RBI resonance, not just readiness scores
- [x] Use RBI coherence to ensure practices resonate with each other
- [x] Validate practice coherence with user's field state using Proof-of-Meaning
- [x] Support layer filtering (foundational, functional, advanced, mixed)

**Implementation Details:**
- ✅ Uses `engine.calculateResonanceSimilarity()` for coherence-based matching
- ✅ Filters practices by RBI coherence score (> 0.7 threshold)
- ✅ Ranks by resonance score (coherence-based, not semantic similarity)
- ✅ Ensures practices build coherently (validates resonance between sequential practices)
- ✅ Generates dynamic sequences based on user's field state

**Files Modified:**
- ✅ `CMS_Backend/lib/services/console-v3/pathway-service.ts` - Added `generateDynamicPracticeSequence()` function

**Test Scripts:**
- ✅ `CMS_Backend/scripts/test-phase-7-3-practice-sequencing.ts` - Practice sequencing test

### 7.4 Orbital Brain Integration (Future Enhancement)
**Status:** Planned for Future  
**Note:** Basic Orbital Brain integration exists in `orbital-integration-service.ts`, but full narrative intelligence layer can be enhanced later.

- [ ] Enhanced Orbital Brain integration for pathway descriptions
- [ ] Generate more personalized pathway narratives
- [ ] Context-aware guidance generation
- [ ] Narrative intelligence layer for pathway recommendations

**Location:** `CMS_Backend/lib/services/console-v3/orbital-integration-service.ts` (basic implementation exists)

---

## Phase 8: Inquiry Capability (V3 Enhancement) ✅
**Status:** ✅ Infrastructure Complete  
**Effort:** Medium  
**Priority:** High for V3

### 8.1 Database Schema & Data ✅
- [x] Migration created (`20250126_phase_8_inquiry_system.sql`)
- [x] Tables created:
  - `inquiry_questions` - Stores common inquiry questions
  - `inquiry_sessions` - Tracks user inquiry sessions
  - `inquiry_log` - Logs each inquiry and response
  - `inquiry_patterns` - Tracks patterns for learning
- [x] **53 inquiry questions loaded** into database
  - Organized by 11 categories: orientation, integration, relationship, relational, temporal, identity, somatic, technology, practical, resistance, big_picture
  - All questions from early reader feedback
  - Tags and metadata included

### 8.2 Inquiry API Endpoints ✅
- [x] `POST /api/console/v3/inquiry` - Submit inquiry question and get response
- [x] `GET /api/console/v3/inquiry` - Get inquiry history or common questions
- [x] Session tracking integrated
- [x] Question matching system
- [x] CORS headers included
- [x] Loader script created (`load-inquiry-questions.ts`)

### 8.3 Orbital Brain Integration ✅
- [x] Created `inquiry-service.ts` with Orbital Brain integration
- [x] Integrated RBI Kernel analysis for inquiry questions
- [x] Generate S2S-aligned narrative responses via Orbital Brain
- [x] Use user's diagnostic session field state for context-aware responses
- [x] Match inquiries to existing inquiry questions for better context
- [x] Include RBI analysis (coherence, proof status, field dynamics) in responses
- [x] Include Orbital interpretation (field state, reasoning, guidance) in responses
- [x] All endpoints tested and working
- [x] Response structure includes full Orbital Brain output

**Files Created:**
- ✅ `CMS_Backend/lib/services/console-v3/inquiry-service.ts`
- ✅ `CMS_Backend/docs/PHASE_8_ORBITAL_BRAIN_INTEGRATION.md`
- ✅ `CMS_Backend/docs/PHASE_8_3_COMPLETE.md`
- ✅ `CMS_Backend/docs/ORBITAL_BRAIN_TEST_RESULTS.md`

**Response Structure:**
- `inquiry_id` - Logged inquiry UUID
- `question` - User's question
- `response` - Orbital Brain generated narrative
- `matched_question` - Matched inquiry question (when found)
- `rbi_analysis` - RBI coherence analysis
- `orbital_interpretation` - Orbital Brain field interpretation
- `metadata` - Content metadata with orb associations

### 8.4 Inquiry Interface in Console (Next Priority)
- [ ] Add inquiry input component to Console UI
- [ ] Allow users to ask questions about their pathway, practices, or field state
- [ ] Display Orbital Brain responses in Console context
- [ ] Store inquiry history per user/session
- [ ] Show inquiry history in Console dashboard

### 8.5 Enhanced Context-Aware Inquiry (Future Enhancement)
- [x] Include user's current field state in inquiry context (✅ Complete)
- [ ] Reference current pathway step in responses
- [ ] Link inquiries to relevant Codex entries
- [ ] Provide Codex entry recommendations based on inquiry
- [ ] Use inquiry results to inform future inquiry responses

### 8.5 Inquiry Learning System (Future Enhancement)
- [ ] Track common inquiries to evolve inquiry questions
- [ ] Identify patterns in user questions
- [ ] Use inquiry data to refine inquiry system
- [ ] Learn which questions users need answered
- [ ] Evolve questions based on inquiry patterns

**Location:** `s2s-frontend/s2s-console/` + `CMS_Backend/app/api/console/v3/inquiry/`

**Files Created:**
- ✅ `CMS_Backend/supabase/migrations/20250126_phase_8_inquiry_system.sql`
- ✅ `CMS_Backend/data/inquiry-questions-53.json`
- ✅ `CMS_Backend/scripts/load-inquiry-questions.ts`
- ✅ `CMS_Backend/app/api/console/v3/inquiry/route.ts`
- ✅ `CMS_Backend/docs/PHASE_8_IMPLEMENTATION.md`

---

## Phase 9: Sovereign Field Inquiry Question Evolution System
**Status:** Not Started  
**Effort:** Medium  
**Priority:** Medium

### 9.1 Question Analytics
- [ ] Track which questions produce most variance in results
- [ ] Identify questions that don't contribute to pathway differentiation
- [ ] Monitor question effectiveness over time
- [ ] A/B test question variations
- [ ] Analyze question effectiveness by question_set (beta, early_reader, etc.)

### 9.2 Adaptive Question Selection
- [ ] Dynamic question sets based on user responses
- [ ] Skip questions that won't change pathway recommendation
- [ ] Add follow-up questions based on initial responses
- [ ] Personalize question order based on field state
- [ ] Use field triggers to show contextual questions

### 9.3 Question Refinement Based on Learning
- [ ] Use inquiry patterns to identify missing questions
- [ ] Refine question wording based on user confusion
- [ ] Add questions that address common inquiry themes
- [ ] Evolve question set as system learns
- [ ] Generate new questions from early reader feedback

**Location:** `CMS_Backend/lib/services/console-v3/` + Database analytics

---

## Console V4: Advanced Features & Intelligence
**Status:** Planned  
**Effort:** Very High  
**Priority:** Post-V3

### V4.1: Real-Time Field Sensing
- [ ] Re-assess field state periodically (not just at diagnostic)
- [ ] Track field evolution over time
- [ ] Show field shifts after completing practices
- [ ] Continuous field monitoring capability
- [ ] Real-time SFI updates

### V4.2: Adaptive Pathways
- [ ] Pathways that adjust based on progress
- [ ] Branch when user's field shifts significantly
- [ ] Suggest practice modifications based on engagement
- [ ] Dynamic pathway recalculation
- [ ] User-driven pathway customization

### V4.3: Resonance-Based Content Discovery
- [ ] Use RBI to find Codex entries that resonate with current field
- [ ] Surface relevant readings/practices dynamically
- [ ] Match content by resonance, not just tags
- [ ] Personalized content recommendations
- [ ] Field-aware content curation

### V4.4: Field Visualization
- [ ] Visual representation of orb activation
- [ ] Undercurrent flow diagrams
- [ ] SFI score trends over time
- [ ] 4D resonance vector visualization
- [ ] Interactive field maps

### V4.5: Temporal Tracking
- [ ] Field evolution timeline
- [ ] Practice completion impact on field state
- [ ] Compare field states across time periods
- [ ] Growth trajectory visualization
- [ ] Historical field state archive

### V4.6: Interactive Practice Modules
- [ ] Not just reading—actual interactive exercises
- [ ] Field sensing practices with real-time feedback
- [ ] Guided meditations/reflections integrated into console
- [ ] Practice completion tracking with validation
- [ ] Interactive field coherence exercises

### V4.7: Practice Completion Tracking
- [ ] Track which practices are completed
- [ ] Show how each practice affects field state
- [ ] Unlock next practices based on readiness
- [ ] Practice effectiveness metrics
- [ ] Completion impact visualization

### V4.8: Re-Diagnostic Capability
- [ ] Allow users to re-take diagnostic
- [ ] Compare field states: before → after
- [ ] Show growth/evolution over time
- [ ] Track field shifts between diagnostics
- [ ] Evolution report generation

### V4.9: Anonymous Field Patterns
- [ ] Show aggregate patterns (e.g., "Others with similar field signatures often benefit from Practice X")
- [ ] Collective field intelligence without exposing individual data
- [ ] Community insights (anonymized)
- [ ] Pattern recognition across user base
- [ ] Collective wisdom integration

### V4.10: Book Integration
- [ ] Link console insights to specific book passages
- [ ] "This practice relates to Chapter 3, Section 2"
- [ ] Cross-reference between console and book
- [ ] Book passage recommendations based on field state
- [ ] Seamless book-console navigation

### V4.11: Codex Deep Integration
- [ ] Seamless access to Codex entries from pathway steps
- [ ] Tag-based content discovery
- [ ] Living archive that responds to field state
- [ ] Codex entry recommendations
- [ ] Full-text search with field context

### V4.12: Gentle Engagement Prompts
- [ ] Smart notifications when it's time for next practice
- [ ] Respectful timing based on user's field state
- [ ] Not pushy, but supportive
- [ ] Field-aware notification system
- [ ] Optimal engagement timing

### V4.13: Export & Reflection
- [ ] Export pathway summary
- [ ] Generate personal field report
- [ ] Share insights (if user chooses)
- [ ] PDF report generation
- [ ] Reflection journal integration

### V4.14: Pathway Branching
- [ ] Multiple pathway options based on different entry points
- [ ] User can explore alternative paths
- [ ] "What if I focused on Orb 5 instead?"
- [ ] Parallel pathway exploration
- [ ] Pathway comparison tools

### V4.15: Field Memory
- [ ] Remember user's field state across sessions
- [ ] Resume where they left off
- [ ] Context-aware recommendations
- [ ] Persistent field state tracking
- [ ] Cross-session continuity

### V4.16: Practice Sequencing Intelligence
- [ ] Use RBI to determine optimal practice order
- [ ] Not just readiness, but resonance-based sequencing
- [ ] Practices that build on each other coherently
- [ ] Dynamic sequence optimization
- [ ] Coherence-based ordering

### V4.17: Undercurrent Mapping
- [ ] Visualize how undercurrents flow through practices
- [ ] Show energetic patterns, not just logical sequences
- [ ] Undercurrent visualization
- [ ] Energetic flow diagrams
- [ ] Pattern recognition in undercurrents

### V4.18: Field Coherence Games/Exercises
- [ ] Interactive tools to practice field sensing
- [ ] Real-time coherence feedback
- [ ] Gamified learning that's actually meaningful
- [ ] Practice exercises with immediate feedback
- [ ] Field sensing skill development

### V4.19: Advanced Inquiry System
- [ ] Natural language inquiry about field state
- [ ] "Why am I stuck on Practice 5?"
- [ ] "What does my orb profile mean?"
- [ ] Context-aware inquiry responses
- [ ] Learning from inquiry patterns

### V4.20: Collective Intelligence Features
- [ ] Aggregate field patterns (anonymized)
- [ ] Collective pathway effectiveness data
- [ ] Community insights without privacy loss
- [ ] Pattern recognition at scale
- [ ] Wisdom of the field

**Location:** All V4 features will be integrated into `s2s-frontend/s2s-console/` and `CMS_Backend/`

**Dependencies:**
- RBI Kernel fully integrated
- Orbital Brain fully integrated
- Dynamic pathway generation working
- Field state tracking system
- Analytics infrastructure

---

## V4 Priority Roadmap

### Phase 1 (Critical Foundation)
1. RBI + Orbital Brain Integration (V3 Enhancement)
2. Dynamic Practice Sequence Generation
3. Field Visualization
4. Re-Diagnostic Capability

### Phase 2 (Core Value)
5. Resonance-Based Content Discovery
6. Temporal Tracking
7. Interactive Practice Modules
8. Practice Completion Tracking

### Phase 3 (Engagement)
9. Adaptive Pathways
10. Codex Deep Integration
11. Book Integration
12. Gentle Engagement Prompts

### Phase 4 (Advanced Intelligence)
13. Real-Time Field Sensing
14. Practice Sequencing Intelligence
15. Undercurrent Mapping
16. Field Coherence Games/Exercises

### Phase 5 (Social & Collective)
17. Anonymous Field Patterns
18. Collective Intelligence Features
19. Pathway Branching
20. Export & Reflection

---

**Last Updated:** 2025-01-26  
**Status:** 
- Phase 0 (Content Organization): ✅ Codex API Complete, Migration Ready
- Phase 1.5 (Critical Fixes): ✅ Complete
- Phase 2.5 (Question Management): ✅ Complete (22 diagnostic questions, metadata system)
- Phase 4.5 (Console App Rebuild): ✅ Complete (Pathway View components complete, fully responsive)
- Phase 6 (Access System Integration): ✅ Core Complete (Access gating implemented, CORS headers added, routes protected)
- Phase 4 (Architecture Refactor): Planned (after core functionality works)
- Phase 7 (RBI + Orbital Brain): ✅ Complete and Tested
- Phase 8 (Inquiry Capability): ✅ Complete (53 inquiry questions, API ready, Orbital Brain integrated)
- Phase 8.3 (Orbital Brain Integration): ✅ Complete (Inquiry service created, RBI analysis included, tested)
- Phase 8.4 (Inquiry Interface): ✅ Complete (Inquiry UI added to Console)
- V4 features: Planned

**System Name:** Sovereign Field Inquiry (formerly "Diagnostic")

**Recent Completion:**
- ✅ Phase 7.1: RBI Kernel Integration (Complete)
- ✅ Phase 7.2: Resonance-Based Pathway Matching (Complete)
- ✅ Phase 7.3: Coherence-Based Practice Sequencing (Complete)
- ✅ Content Validation: Codex entries and practices validated with RBI
- ✅ Architecture Loader: Core S2S architecture files integrated
- ✅ Phase 2.5: Question Management System (Complete - 22 diagnostic questions loaded, metadata system ready)
- ✅ Phase 8: Inquiry Capability Infrastructure (Complete - 53 inquiry questions loaded, API endpoints ready)
- ✅ Phase 8.3: Orbital Brain Integration (Complete - Inquiry service created, RBI analysis included, context-aware responses working)
- ✅ Phase 8.3: Orbital Brain Integration (Complete - Inquiry service created, RBI analysis included, context-aware responses working)

