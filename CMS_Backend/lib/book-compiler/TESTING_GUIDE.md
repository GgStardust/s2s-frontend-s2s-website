# Book Compiler Testing Guide

## Quick Test Commands

### 1. Test Standalone Script (Metadata-Only Mode)
```bash
cd CMS_Backend
tsx scripts/metadata-compiler.ts --mode=metadata
```

### 2. Test Standalone Script (Full Features)
```bash
cd CMS_Backend
tsx scripts/metadata-compiler.ts --mode=full --outline=09_PROCESSED/02b_book/COMPLETE_BOOK_OUTLINE_AND_OVERVIEW.md
```

### 3. Test API Endpoint (Single Chapter)
```bash
# Using curl
curl -X POST http://localhost:3000/api/books/[book-id]/compile-metadata \
  -H "Content-Type: application/json" \
  -d '{
    "chapter_id": "[chapter-id]",
    "mode": "metadata"
  }'

# Full features
curl -X POST http://localhost:3000/api/books/[book-id]/compile-metadata \
  -H "Content-Type: application/json" \
  -d '{
    "chapter_id": "[chapter-id]",
    "mode": "full"
  }'
```

## Testing Checklist

### Phase 1: Basic Functionality
- [ ] **Content Loading**: Verify content files are loaded correctly
  - Check Orb Essays directory
  - Check Codex Essays directory
  - Verify inline tags are extracted
  - Verify YAML frontmatter is parsed

- [ ] **Outline Loading**: Verify outline is parsed correctly
  - Test markdown outline parsing
  - Test database outline loading (if applicable)
  - Verify chapter numbers and titles

- [ ] **Metadata Matching**: Verify source selection works
  - Check book_threading matches
  - Check field_function matches
  - Check Orb focus matches
  - Verify top 3 sources are selected (metadata mode)

### Phase 2: RBI Layers
- [ ] **RBI Discovery**: Verify content expansion
  - Check that more than 3 sources are found (full mode)
  - Verify RBI neighbors are discovered
  - Check resonance scores

- [ ] **RBI Validation**: Verify coherence validation
  - Check coherence scores between sources
  - Verify low-coherence sources are filtered
  - Check chapter-level coherence

- [ ] **RBI Ordering**: Verify optimal ordering
  - Check sources are ordered by resonance flow
  - Verify smooth transitions between sources

### Phase 3: Narrative Layers
- [ ] **Orbital Brain**: Verify narrative generation
  - Check recognition-first openings are generated
  - Verify bridges are created for gaps
  - Check narrative voice matches S2S style

- [ ] **Style Training**: Verify voice consistency
  - Check generated content matches your writing style
  - Verify style patterns are applied

### Phase 4: Editorial Layer
- [ ] **Readability**: Verify readability analysis
  - Check clarity scores
  - Verify dense sections are identified

- [ ] **Recognition-First**: Verify restructuring
  - Check sections are reordered for recognition-first flow
  - Verify experience comes before concepts

- [ ] **Gap Detection**: Verify gap detection
  - Check coherence gaps are identified
  - Verify bridges are generated where needed

- [ ] **Flow Optimization**: Verify narrative flow
  - Check smooth transitions
  - Verify optimal section ordering

### Phase 5: Integration
- [ ] **Standalone Script**: Test full compilation
  - Run with metadata mode
  - Run with full mode
  - Verify output files are created
  - Check compilation report

- [ ] **API Endpoint**: Test API integration
  - Test single chapter compilation
  - Test with different modes
  - Verify response format
  - Check error handling

## Test Scenarios

### Scenario 1: Single Chapter (Metadata-Only)
**Goal**: Verify basic compilation works

```typescript
// Test script
import { compileChapter } from './lib/book-compiler/index.js';

const chapter = {
  chapter_number: 1,
  title: 'Chapter 1: The Stardust Within',
  description: 'Establishes the foundational intelligence',
  orb_focus: 1
};

const result = await compileChapter(chapter, {
  useRBIDiscovery: false,
  useRBIValidation: false,
  useOrbitalBrain: false,
  useEditorialLayer: false,
});

console.log('Sources:', result.sources.length);
console.log('Content length:', result.content.length);
```

### Scenario 2: Single Chapter (Full Features)
**Goal**: Verify all layers work together

```typescript
const result = await compileChapter(chapter, {
  useRBIDiscovery: true,
  useRBIValidation: true,
  useRBIOrdering: true,
  useOrbitalBrain: true,
  useStyleTraining: true,
  useEditorialLayer: true,
  maxSources: 15,
});

console.log('Layers applied:', result.layersApplied);
console.log('RBI metrics:', result.rbi_metrics);
console.log('Warnings:', result.warnings);
```

### Scenario 3: Full Book Compilation
**Goal**: Verify book-level compilation

```bash
# Run full book compilation
tsx scripts/metadata-compiler.ts --mode=full

# Check output
ls -la 09_PROCESSED/02g_generated_book_content/
cat COMPILATION_REPORT.md
```

## Debugging Tips

### Enable Debug Logging
Set environment variable:
```bash
DEBUG=book-compiler:* tsx scripts/metadata-compiler.ts --mode=full
```

### Check Individual Layers
Test each layer independently:

```typescript
// Test RBI Discovery only
const config = {
  useRBIDiscovery: true,
  useRBIValidation: false,
  useRBIOrdering: false,
  useOrbitalBrain: false,
  useEditorialLayer: false,
};

// Test Orbital Brain only
const config = {
  useRBIDiscovery: false,
  useRBIValidation: false,
  useRBIOrdering: false,
  useOrbitalBrain: true,
  useEditorialLayer: false,
};
```

### Verify Content Sources
Check which sources are selected:

```typescript
const result = await compileChapter(chapter, config);
result.sources.forEach((source, idx) => {
  console.log(`${idx + 1}. ${source.title}`);
  console.log(`   File: ${source.file_path}`);
  console.log(`   Orbs: ${source.orb_tags.join(', ')}`);
  console.log(`   Tags: ${source.inline_tags.slice(0, 5).join(', ')}`);
});
```

## Expected Outputs

### Metadata-Only Mode
- **Sources**: 3 per chapter (top metadata matches)
- **Layers**: `['metadata_matching']`
- **RBI Metrics**: None
- **Content**: Concatenated source content with YAML frontmatter

### Full Features Mode
- **Sources**: Up to 15 per chapter (metadata + RBI discovery)
- **Layers**: `['metadata_matching', 'rbi_discovery', 'rbi_validation', 'rbi_ordering', 'orbital_brain', 'style_training', 'editorial']`
- **RBI Metrics**: Coherence, field strength, stability scores
- **Content**: Compiled with recognition-first openings, bridges, optimized ordering

## Common Issues

### Issue: No sources found
**Solution**: 
- Check content file paths in config
- Verify YAML frontmatter has `book_threading` or `field_function`
- Check chapter description matches content purpose

### Issue: RBI discovery not working
**Solution**:
- Verify RBI Kernel is initialized
- Check RBI API endpoint is accessible
- Verify content has enough text for resonance calculation

### Issue: Orbital Brain not generating content
**Solution**:
- Check OpenAI API key is set
- Verify style training has run
- Check network connectivity

### Issue: Editorial layer not restructuring
**Solution**:
- Verify `useEditorialLayer: true` in config
- Check readability analysis is running
- Verify recognition-first scoring is working

## Performance Testing

### Measure Compilation Time
```typescript
const start = Date.now();
const result = await compileChapter(chapter, config);
const duration = Date.now() - start;
console.log(`Compilation took ${duration}ms`);
```

### Test with Large Content Library
- Test with 100+ content files
- Measure RBI discovery performance
- Check memory usage

## Next Steps After Testing

1. **Fix Issues**: Address any bugs or errors found
2. **Optimize Performance**: Improve slow operations
3. **Refine Config**: Adjust thresholds and parameters
4. **Recompile Book**: Run full book compilation once tests pass

