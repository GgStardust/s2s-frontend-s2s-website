# Book Compiler Implementation Plan

## Goals

1. **Better Manuscript**: Recognition-first, readable, coherent
2. **Modular Compiler**: Reusable for future books with configurable layers
3. **Editorial Layer**: Built-in readability and recognition-first restructuring

## Implementation Phases

### Phase 1: Foundation (Core Modules)
**Goal**: Extract and modularize existing compiler logic

**Tasks**:
1. Create `lib/book-compiler/core/` directory
2. Extract `metadata-selector.ts` from existing compiler
3. Extract `content-loader.ts` from existing compiler
4. Extract `chapter-compiler.ts` from existing compiler
5. Create `types.ts` with shared interfaces
6. Create `config.ts` with configuration interface

**Outcome**: Core compiler logic is modular and reusable

---

### Phase 2: RBI Discovery Layer
**Goal**: Find resonant content beyond metadata matches

**Tasks**:
1. Create `lib/book-compiler/rbi/discovery.ts`
2. Implement `findResonantNeighbors()` using RBI Kernel
3. Integrate with `findNeighbors` from RBI-Kernel
4. Expand content pool from top 3 to top 15
5. Combine metadata matches + RBI discoveries

**Outcome**: Compiler finds more relevant content through resonance

---

### Phase 3: RBI Validation & Ordering
**Goal**: Validate resonance and optimize ordering

**Tasks**:
1. Create `lib/book-compiler/rbi/validation.ts`
2. Implement `validateResonanceBetweenSources()`
3. Implement `validateChapterCoherence()`
4. Create `lib/book-compiler/rbi/ordering.ts`
5. Implement `findOptimalOrdering()` based on resonance flow
6. Build resonance chain for smooth flow

**Outcome**: Content is validated and optimally ordered

---

### Phase 4: Orbital Brain Integration
**Goal**: Generate narrative intelligence

**Tasks**:
1. Create `lib/book-compiler/orbital/narrative-generation.ts`
2. Implement `generateRecognitionFirstOpening()`
3. Implement `generateBridges()` for transitions
4. Integrate Orb personality for voice
5. Create `lib/book-compiler/orbital/bridges.ts`
6. Implement gap detection and bridge generation

**Outcome**: Chapters have recognition-first openings and smooth transitions

---

### Phase 5: Style Training Integration
**Goal**: Ensure voice consistency

**Tasks**:
1. Create `lib/book-compiler/style/style-integration.ts`
2. Integrate `writingStyleTrainer` from existing system
3. Load style patterns from library
4. Generate style-aware prompts for Orbital Brain
5. Apply style constraints to generated content

**Outcome**: Generated content matches your voice

---

### Phase 6: Editorial Layer ⭐
**Goal**: Recognition-first restructuring and readability

**Tasks**:
1. Create `lib/book-compiler/editorial/` directory
2. Create `readability.ts`:
   - RBI Clarity scoring
   - Readability analysis
   - Accessibility measurement
3. Create `recognition-first.ts`:
   - Analyze content for recognition quality
   - Score sections (experience vs. concept)
   - Reorder for recognition-first flow
4. Create `gap-detection.ts`:
   - Measure coherence between sections
   - Identify abrupt transitions
   - Flag gaps needing bridges
5. Create `flow-optimization.ts`:
   - Suggest optimal section ordering
   - Validate smooth transitions
   - Ensure narrative coherence

**Outcome**: Chapters are restructured for recognition-first readability

---

### Phase 7: Main Compiler Interface
**Goal**: Unified compiler with all layers

**Tasks**:
1. Create `lib/book-compiler/index.ts`
2. Implement `compileChapter()` with layer orchestration
3. Implement `compileBook()` for full book compilation
4. Add configuration system for enabling/disabling layers
5. Add backward compatibility (metadata-only mode)
6. Add error handling and logging

**Outcome**: Single entry point with all layers integrated

---

### Phase 8: Integration
**Goal**: Update existing scripts and APIs

**Tasks**:
1. Update `scripts/metadata-compiler.ts` to use new library
2. Update `app/api/books/[id]/compile-metadata/route.ts`
3. Create new `app/api/books/[id]/compile/route.ts` with full features
4. Add configuration UI in CMS (optional)
5. Test backward compatibility

**Outcome**: Existing systems use new modular compiler

---

### Phase 9: Recompile S2S Book
**Goal**: Generate better manuscript

**Tasks**:
1. Configure compiler with all layers enabled:
   - RBI Discovery: ON
   - RBI Validation: ON
   - RBI Ordering: ON
   - Orbital Brain: ON
   - Style Training: ON
   - Editorial Layer: ON
   - Recognition-First: ON
2. Run compilation for all chapters
3. Review compiled chapters
4. Iterate on configuration if needed
5. Generate final manuscript

**Outcome**: Better, more readable manuscript

---

### Phase 10: Priority 1 - Bridge Insertion (CRITICAL FIX)
**Goal**: Actually insert generated bridges into compiled content

**Problem Identified**: Bridges are generated but never inserted into the final chapter content.

**Tasks**:
1. Fix bridge insertion logic in `index.ts` line 239
2. Use existing `insertBridges()` function from `orbital/bridges.ts`
3. Properly integrate bridges into compiled chapter content
4. Test with Chapter 1 to verify bridges appear

**Outcome**: Narrative transitions between sources actually appear in compiled chapters

---

### Phase 11: Priority 2 - Content Curation Layer
**Goal**: Extract key sections instead of including full essays

**Problem Identified**: Compiler includes entire essays (240k+ chars), making chapters too long and unfocused.

**Tasks**:
1. Create `lib/book-compiler/editorial/content-curation.ts`:
   - `extractKeySections(content, maxLength)` - Extract most relevant sections
   - `synthesizeOverlappingContent(sources)` - Merge overlapping concepts
   - `createRecognitionFirstExcerpt(essay)` - Extract recognition-first sections
2. Integrate into `core/chapter-compiler.ts`:
   - Curate each source before adding to chapter
   - Limit each source to top 2-3 most relevant sections
   - Preserve inline tags and metadata
3. Add configuration options:
   - `maxSectionsPerSource` (default: 3)
   - `maxLengthPerSource` (default: 5000 chars)
   - `enableContentCuration` (default: true)

**Outcome**: Chapters are focused and readable length (not 240k+ chars)

---

### Phase 12: Priority 3 - Restructure Source Content
**Goal**: Apply recognition-first restructuring within sources, not just between them

**Problem Identified**: Editorial layer only reorders whole sources, doesn't restructure content within essays.

**Tasks**:
1. Extend `editorial/recognition-first.ts`:
   - Parse essays into sections (paragraphs, subsections)
   - Score sections within each essay for recognition quality
   - Reorder sections within essays for recognition-first flow
2. Create `editorial/section-parser.ts`:
   - `parseIntoSections(content)` - Split essay into logical sections
   - `identifySectionTypes(sections)` - Classify as intro/body/conclusion
   - `extractRecognitionSections(sections)` - Find experience-based sections
3. Integrate into compilation pipeline:
   - Apply recognition-first restructuring to each source before compilation
   - Preserve section relationships and flow
4. Update `compileChapterCore` to handle restructured sources

**Outcome**: Essays are restructured for recognition-first flow before compilation

---

### Phase 13: Priority 4 - Synthesis Layer
**Goal**: Create unified narrative from multiple sources, not just concatenation

**Problem Identified**: Compiler concatenates sources with separators, doesn't synthesize into cohesive narrative.

**Tasks**:
1. Create `lib/book-compiler/editorial/synthesis.ts`:
   - `synthesizeChapter(sources)` - Create unified narrative from multiple sources
   - `mergeRelatedConcepts(sections)` - Combine overlapping ideas
   - `createNarrativeFlow(sections)` - Generate smooth transitions
   - `identifyRedundancy(sources)` - Find repeated concepts
2. Create `editorial/narrative-structure.ts`:
   - `createChapterStructure(sources)` - Design chapter architecture
   - `organizeByTheme(sections)` - Group related content
   - `createThematicFlow(themes)` - Build narrative progression
3. Integrate synthesis into compilation:
   - Run synthesis after content curation
   - Generate cohesive narrative, not source compilation
   - Preserve key concepts while eliminating redundancy

**Outcome**: Chapters read as unified narratives, not source compilations

---

### Phase 14: Post-Compilation Global Editing Sweeps
**Goal**: Apply book-wide editorial passes after all chapters are compiled

**Problem Identified**: Individual chapters are compiled, but the book as a whole needs:
- Cross-chapter consistency checks
- Thematic coherence across the entire book
- Narrative flow between chapters
- Style consistency across all chapters
- Terminology consistency (Orb names, concepts, etc.)
- Redundancy elimination across chapters
- Cross-references and chapter connections

**Tasks**:
1. Create `lib/book-compiler/editorial/global-editing.ts`:
   - `analyzeBookCoherence(compiledChapters)` - Measure coherence across entire book
   - `checkTerminologyConsistency(chapters)` - Ensure consistent use of terms
   - `identifyCrossChapterRedundancy(chapters)` - Find repeated concepts
   - `analyzeNarrativeFlow(chapters)` - Check flow between chapters
   - `generateChapterConnections(chapters)` - Create cross-references
2. Create `editorial/style-consistency.ts`:
   - `checkStyleConsistency(chapters)` - Ensure voice consistency
   - `normalizeTerminology(chapters)` - Standardize terms across book
   - `checkOrbReferences(chapters)` - Validate Orb references are consistent
3. Create `editorial/thematic-coherence.ts`:
   - `analyzeThematicProgression(chapters)` - Track theme development
   - `identifyThematicGaps(chapters)` - Find missing theme connections
   - `suggestThematicBridges(chapters)` - Propose connections
4. Integrate into compilation workflow:
   - Run after all chapters are compiled
   - Generate global editing report
   - Apply fixes automatically where possible
   - Flag issues for manual review

**Outcome**: Book-wide consistency, coherence, and flow

---

## Editorial Layer Details

The editorial layer is **critical** for achieving your goal of a better manuscript. It includes:

### 1. Recognition-First Restructuring
- **Problem**: Content starts with concepts before experience
- **Solution**: Reorder sections to start with experience/recognition
- **Method**: 
  - Score each section for "recognition quality" (experience vs. concept)
  - Reorder: High recognition → Medium → Low (concepts)
  - Ensure smooth flow from experience to concept

### 2. Gap Detection
- **Problem**: Abrupt transitions between sections
- **Solution**: Detect coherence gaps and generate bridges
- **Method**:
  - Measure RBI coherence between adjacent sections
  - Flag gaps where coherence < threshold
  - Generate bridging content via Orbital Brain

### 3. Flow Optimization
- **Problem**: Sections don't flow naturally
- **Solution**: Optimize ordering based on resonance flow
- **Method**:
  - Build resonance matrix between all sections
  - Find optimal ordering (highest resonance chain)
  - Validate smooth transitions

### 4. Readability Scoring
- **Problem**: Dense, inaccessible content
- **Solution**: Measure and improve readability
- **Method**:
  - Use RBI Clarity dimension as readability metric
  - Identify dense sections (low clarity)
  - Flag for simplification or restructuring

## Configuration Example

```typescript
const fullFeatureConfig = {
  // Core (always enabled)
  useMetadataMatching: true,
  
  // RBI Layers
  useRBIDiscovery: true,        // Find more content
  useRBIValidation: true,      // Validate coherence
  useRBIOrdering: true,        // Optimal ordering
  
  // Narrative Layers
  useOrbitalBrain: true,       // Generate openings/bridges
  useStyleTraining: true,      // Voice consistency
  
  // Editorial Layer ⭐
  useEditorialLayer: true,     // Readability & recognition-first
  
  // Options
  maxSources: 15,              // Expanded pool
  recognitionFirst: true,      // Recognition-first flow
  minCoherence: 0.7,          // Quality threshold
  enableGapBridging: true      // Auto-bridge gaps
};
```

## Success Criteria

1. ✅ **Modular**: Each layer can be enabled/disabled independently
2. ✅ **Reusable**: Works for any book project
3. ✅ **Backward Compatible**: Can run in metadata-only mode
4. ✅ **Editorial**: Includes recognition-first restructuring
5. ✅ **Better Manuscript**: More readable, coherent, accessible

## Timeline Estimate

- **Phase 1-2**: 2-3 days (Foundation + RBI Discovery)
- **Phase 3**: 1-2 days (RBI Validation & Ordering)
- **Phase 4**: 2-3 days (Orbital Brain)
- **Phase 5**: 1 day (Style Training)
- **Phase 6**: 2-3 days (Editorial Layer) ⭐
- **Phase 7**: 1-2 days (Main Interface)
- **Phase 8**: 1 day (Integration)
- **Phase 9**: 1-2 days (Recompile)

**Total**: ~12-18 days of focused development

## Next Steps

1. Start with Phase 1 (Foundation)
2. Build incrementally (one phase at a time)
3. Test each phase before moving to next
4. Iterate based on results

