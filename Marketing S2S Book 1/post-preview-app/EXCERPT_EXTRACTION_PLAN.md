# Excerpt Extraction Plan

## Source File
- **Manuscript**: `/Users/gigi/Projects/S2S_RBI_System/RBI_Editorial_Tools/S2S_Book1/Manuscripts/S2S_Field_Manual_v9_print.md`
- **Format**: Markdown with chapters marked as `# Chapter X: Title`
- **Total Chapters**: 15 (Chapter 1-15, with "Chapter X" being Chapter 8)

## Extraction Strategy

### 1. Parse Chapters
- Find all `# Chapter X: Title` headers
- Extract content between chapter headers (until next `# Chapter` or `# Interlude`)
- Skip "Voice of the Origin" sections (persona POV)
- Skip HTML tags and image references

### 2. Extract Candidate Excerpts
From each chapter, extract:
- Opening paragraphs (first 1-3 paragraphs after chapter header)
- Standalone declarative sentences (20-150 words)
- Bullet point statements (★ statements)
- Key conceptual statements from section bodies

### 3. Filter Criteria
Each excerpt must:
- ✅ Be 20-150 words
- ✅ End with punctuation (`.`, `!`, `?`)
- ✅ Be a complete thought (standalone, makes sense without context)
- ✅ No persona POV ("I am", "I speak", "I am the one", etc.)
- ✅ No meta-system references ("This system", "Book/Codex/Console", "was developed")
- ✅ No instructional language ("you should", "you must", "try to")
- ✅ No fragments ("It governs...", "This operates..." without context)

### 4. Selection Priority
For each chapter, select:
1. **Primary**: Opening paragraph(s) - best for Instagram (sets context)
2. **Secondary**: Key conceptual statements from body
3. **Tertiary**: Bullet point statements (★ statements)

### 5. Chapter Mapping
Map to correct chapter numbers:
- Chapter 1: The Stardust Within
- Chapter 2: The Body as Advanced Biological Technology
- Chapter 3: Photonic Intelligence
- Chapter 4: Harmonic Architectures
- Chapter 5: Defining Energetic Sovereignty
- Chapter 6: Stepping Beyond Limitations
- Chapter 7: The Alchemical Current
- Chapter 8: Quantum Intuition (marked as "Chapter X" in manuscript)
- Chapter 9: Temporal Fluidity
- Chapter 10: Ancestral Repatterning
- Chapter 11: Radiant Transparency
- Chapter 12: The Sovereign Field: Collective Resonance
- Chapter 13: Bridging Intelligence
- Chapter 14: The Living Blueprint for Transformation
- Chapter 15: Beyond Stardust: The Infinite Becoming

## Implementation Steps

1. Add `MANUSCRIPT_SOURCE` constant pointing to manuscript file
2. Create `parseManuscriptExcerpts()` function
3. Parse chapters using regex to find `# Chapter` headers
4. Extract and clean text (remove HTML, images, markdown formatting)
5. Apply filtering criteria
6. Select best 1-2 excerpts per chapter
7. Map to chapter numbers and titles
8. Return array of excerpt objects matching current schema

## Example Output Structure
```javascript
{
  id: 'excerpt-book1-001',
  contentType: 'excerpt',
  chapter: 'Chapter 1: The Stardust Within',
  content: 'Before form, before structure, before the first breath of biological life, there was origin. Stellar fire shaped the elements that would become your body. Cosmic currents moved through the void, carrying the intelligence that would one day recognize itself as you.',
  source: 'Book One: The Cosmic Tapestry',
  recommendedStage: ['Deepening', 'Activation'],
  visualMode: 'dark',
  // ... other fields
}
```
