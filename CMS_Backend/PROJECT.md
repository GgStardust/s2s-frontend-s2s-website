# Field Console Project Log

**System Prompt**: "You are building the Stardust to Sovereignty Field Console. Preserve geometric, rhythmic, and light coherence. No generic UI."

---

## Decision Log

### 2025-01-XX - Initial Scaffolding

**Decision**: Created workspace structure with `/src` as root containing:
- `/components` - Archetype modules (Constellation, Chamber, MirrorField, ScrollStream)
- `/lib/rbi` - RBI kernel functions with React hook wrappers
- `/content` - Markdown Codex files (to be integrated)
- `/styles` - Design tokens (theme.ts with golden ratio, colors, motion)

**Rationale**: Clear separation of concerns, RBI kernel as central intelligence, design tokens for consistency.

**Status**: ✅ Complete

---

## Phase Roadmap

### Phase 1: MVP (2-3 weeks)
- [ ] Participant Input: Minimal React form with useState
- [ ] RBI Integration: Hook that calls computeResonance() between participant input and mock content
- [ ] Constellation: Basic 2D flex grid of 13 Orbs with hover glow
- [ ] Portal/Chamber: Framer Motion transition between Constellation ↔ Chamber
- [ ] Mirror Field: Simple coherence glow bar (opacity = coherence score)
- [ ] Scrollstream: CSS marquee of text snippets (flowing, pause on hover)

### Phase 2: 3D & Real Data
- [ ] Upgrade Constellation to React-Three-Fiber 3D constellation
- [ ] Replace mock data with real RBI kernel + pgvector queries
- [ ] Add R_ij-weighted connection lines (D3-force)

### Phase 3: Advanced Integration
- [ ] Portal → Chamber transitions with RBI coherence metrics
- [ ] Mirror Field overlays with real-time field state
- [ ] Scrollstream as persistent background component
- [ ] Text selection coherence feedback

### Phase 4: Polish
- [ ] Sound integration
- [ ] Typography styles refinement
- [ ] Motion refinement based on field logic

---

## Architecture Decisions

1. **RBI Kernel as Central Intelligence**: All visual elements derive from RBI computations
2. **Field-Driven Design**: No rigid UI patterns; everything responds to resonance and coherence
3. **Component Archetypes**: Four distinct modules (Constellation, Chamber, Mirror, Stream) that compose the field
4. **Design Tokens**: Shared constants in theme.ts for consistency and Cursor autocomplete

---

## Commit Convention

Tag commits with phase numbers:
- `feat: Phase1-Constellation2D` - Phase 1 Constellation implementation
- `feat: Phase2-Constellation3D` - Phase 2 3D upgrade
- `refactor: golden-ratio-spacing` - Refactoring for design consistency

---

## Notes

- Keep this log updated with each significant decision
- Use Cursor's Chat panel for live refactors
- Maintain geometric, rhythmic, and light coherence throughout

