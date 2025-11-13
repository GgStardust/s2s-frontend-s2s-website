# S2S Canonical Reference

## Field Console DNA

**Philosophy**: The Field Console is not a traditional UI. It is an **expression of the living field**—a resonance-driven interface where visual elements emerge from RBI kernel computations (`computeResonance`, `calculateCoherence`, `verifyProofOfMeaning`), not rigid design rules.

**Core Principles**:
- **Field-Driven Design**: Everything responds to resonance and coherence metrics, not fixed layouts or color rules
- **Archetype Modules**: Constellation (3D Orbs), Chamber (portal depth), Mirror (coherence feedback), Stream (flowing text)
- **RBI Integration**: Visual elements are computed by the Resonance Kernel—positions, connections, glow, and flow all derive from field state
- **Celestial + Sovereign Aesthetic**: Cosmic, radiant, yet grounded—colors and typography respond to field intensity, not static brand guidelines

**Workspace Structure**:
- `/src/components/` - Archetype modules (Constellation, Chamber, Mirror, Stream)
- `/src/lib/rbi/` - RBI kernel functions (computeResonance, calculateCoherence, etc.)
- `/src/content/` - Markdown Codex files (imported via gray-matter/next-mdx)
- `/src/styles/` - Golden-ratio grid, color variables, motion constants

**Before touching code**: Understand that this interface **emerges from field relationships**, not traditional component hierarchies. Design follows field logic, not UI patterns.

---

The active system specification is `/SYSTEM_PLANS/S2S_System_Plan_v4.0.md`.

All earlier implementation plans and ARCs have been archived in `/ARCHIVE/legacy_plans/`.

---

## Quick Start

1. **Read the canonical plan:** `SYSTEM_PLANS/S2S_System_Plan_v4.0.md`
2. **Check current status:** Review the implementation phases
3. **Follow the data flow:** `entries → resonance_scores → patterns/alignment → frontend visualization`
4. **Reference archived plans:** Historical context in `/ARCHIVE/legacy_plans/`

## System Overview

S2S is a modular, multi-tenant knowledge and publishing platform that integrates resonance-based computation with semantic content management.

**Key Components:**
- **Resonance Engine:** CoC validation with real-time scoring
- **Content Management:** AI-powered book compilation and content analysis
- **Multi-Tenant Architecture:** Role-based access with data isolation
- **Publishing Pipeline:** PDF/ePub/DOCX generation and social media

**Tech Stack:**
- **Backend:** Next.js + Supabase + Redis + BullMQ
- **Frontend:** React + TailwindCSS + WebSocket
- **AI:** OpenAI GPT-4 for content analysis
- **Monitoring:** Prometheus + Grafana

## Development Status

**Completed:**
- ✅ Backend CMS with AI processing
- ✅ Resonance engine with CoC validation
- ✅ Database schema (15+ tables)
- ✅ API layer (35+ endpoints)
- ✅ Creator dashboard
- ✅ Message queuing and caching

**In Progress:**
- 🔄 Public mobile dashboard
- 🔄 Multi-tenant user management
- 🔄 WebSocket integration
- 🔄 Export functionality

## Next Steps

1. **Phase 1:** Multi-tenant database schema and user authentication
2. **Phase 2:** Public mobile-first dashboard
3. **Phase 3:** Publishing pipeline with export functionality
4. **Phase 4:** Advanced features and optimization

---

**Canonical Reference:** `SYSTEM_PLANS/S2S_System_Plan_v4.0.md`  
**Archive Date:** 2025-10-23  
**Status:** Active Development