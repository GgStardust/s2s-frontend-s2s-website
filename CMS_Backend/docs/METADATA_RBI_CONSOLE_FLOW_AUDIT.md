# Metadata → RBI → Console Flow Audit

**Date:** November 12, 2025  
**Purpose:** Validate data hierarchy and governance  
**Goal:** Confirm `CMS_Backend (metadata + logic) → RBI_Kernel (computation) → S2S_Console (presentation)`

---

## Executive Summary

**CRITICAL FINDINGS:**
1. ❌ **RBI_Kernel is NOT receiving metadata** - Called with `(content, title)` only
2. ❌ **Metadata extracted AFTER RBI** - Should be extracted BEFORE and passed to Kernel
3. ❌ **S2S_Console calls RBI directly** - Violates architecture (should only call CMS_Backend APIs)
4. ⚠️ **API responses lack unified structure** - No consistent `{content, metadata, rbi_output}` format
5. ⚠️ **Metadata used for scoring, not computation** - Metadata weights resonance scores but doesn't inform RBI analysis

---

## 1. Metadata Parsing

### ✅ Where YAML is Parsed

**Location:** Multiple places using `gray-matter` library:
- `app/api/content-files/sync/route.ts` (line 74): `const { data: frontmatter, content: markdownBody } = matter(fileContent);`
- `scripts/import-content.ts` (line 91): `const { data: frontmatter, content: markdownBody } = matter(fileContent);`
- `lib/content/field-experience-integration.ts` (line 236): Manual regex parsing
- `lib/codex/canonical-store.ts` (line 146): Custom regex parsing

**Storage:** 
- Parsed YAML stored in `content_files.yaml_frontmatter` (JSONB column)
- Also extracted to top-level columns: `orb_associations`, `tags`, `resonance_metrics`

### ✅ Metadata Fields in API Responses

**`/api/console/content`** (line 172-185):
```typescript
{
  id, title, file_path, markdown_body, content,
  console_context, console_relation, console_views,
  orb_associations, tags, created_at, updated_at
}
```
✅ Includes: `orb_associations`, `tags`, `console_context`, `console_relation`, `console_views`

**Missing from response:**
- ❌ `resonance_metrics` (stored but not returned)
- ❌ `category` (not in response)
- ❌ `integration_points` (not in response)
- ❌ `dashboard_component` (not in response)
- ❌ Full `yaml_frontmatter` object (only extracted fields)

### ⚠️ Metadata Transformation Before RBI

**Status:** Metadata is NOT transformed before RBI - it's extracted AFTER RBI analysis.

**Current Flow:**
1. Content file fetched from database
2. `yaml_frontmatter` extracted
3. RBI called with `content` only: `analyzeContentWithMathematics(content, title)`
4. Metadata used AFTER for scoring: `calculateEnhancedResonanceScore(..., metadata)`

**Should Be:**
1. Content file fetched
2. `yaml_frontmatter` extracted
3. Metadata passed to RBI: `analyzeContentWithMathematics(content, title, metadata)`
4. RBI uses metadata to weight computation

---

## 2. RBI_Kernel Invocation

### ❌ CRITICAL: RBI Called WITHOUT Metadata

**Evidence:**

**`app/api/ai/resonance-source-selection/route.ts`** (line 173):
```typescript
// Analyze with Enhanced Resonance Engine
const resonanceAnalysis = await resonanceEngine.analyzeContentWithMathematics(content);
```
❌ Only passes `content` - no metadata!

**`app/api/ai/process-content/route.ts`** (line 43):
```typescript
const analysis = await enhancedEngine.analyzeContentWithMathematics(content, title);
```
❌ Only passes `content, title` - no metadata!

**`app/api/resonance/analyze/route.ts`** (line 28):
```typescript
const resonanceAnalysis = await resonanceEngine.analyzeContentWithMathematics(content);
```
❌ Only passes `content` - no metadata!

**`lib/resonance-api.ts`** (line 21):
```typescript
const analysis = await engine.analyzeContentWithMathematics(markdown, title);
```
❌ Only passes `markdown, title` - no metadata!

### ❌ Data Object Passed to Kernel

**Current:** `{ content: string, title?: string }`

**Should Be:** `{ content: string, title?: string, metadata: { orb_associations, field_function, book_threading, integration_points, tags, ... } }`

### ⚠️ Metadata Used for Scoring, Not Computation

**Evidence from `app/api/ai/resonance-source-selection/route.ts`** (line 176-188):
```typescript
// Calculate enhanced resonance score using YAML metadata
const resonanceScore = calculateEnhancedResonanceScore(
  orbitalContext.resonanceMetrics,  // From RBI
  allOrbAssociations,               // From metadata
  chapter.orb_focus,
  {
    fieldFunction,                   // From metadata
    bookThreading,                   // From metadata
    integrationPoints,               // From metadata
    inlineTags,                     // From metadata
    ...
  }
);
```

**Problem:** Metadata is used to WEIGHT the RBI output, but RBI computation itself doesn't use metadata to inform its analysis.

**Should Be:** RBI_Kernel should receive metadata and use `metadata.orb_associations` to weight resonance computation internally.

---

## 3. API Response Composition

### ❌ No Unified Structure

**Current API Responses:**

**`/api/console/content`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "...",
      "content": "...",
      "console_context": "...",
      "orb_associations": [...],
      "tags": [...]
    }
  ],
  "metadata": { "count": 5, "filters": {...} }
}
```
❌ No `rbi_output` field
❌ Metadata fields scattered, not nested

**`/api/ai/conversation`**:
```json
{
  "content": "...",
  "cocValidation": {...},
  "updatedContent": "...",
  "updatedTitle": "..."
}
```
❌ No unified structure
❌ No `metadata` or `rbi_output` fields

**`/api/ai/resonance-source-selection`**:
```json
{
  "selected_sources": [
    {
      "id": "...",
      "resonance_score": 0.85,
      "resonance_metrics": {...},
      "yaml_metadata": {...}
    }
  ]
}
```
⚠️ Has `yaml_metadata` but not structured as `{content, metadata, rbi_output}`

### ✅ Should Be:

```json
{
  "content": "...markdown...",
  "metadata": {
    "orb_associations": [...],
    "field_function": {...},
    "integration_points": {...},
    "tags": [...],
    "category": "...",
    "dashboard_component": "..."
  },
  "rbi_output": {
    "resonance_metrics": {...},
    "coherence": 0.85,
    "proof_status": "proven",
    "mathematical": {...}
  }
}
```

---

## 4. Console Data Handling

### ❌ CRITICAL: Console Calls RBI Directly

**Evidence:**

**`S2S_Console/src/components/InquiryInterface.tsx`** (line 45):
```typescript
const vector = await generateResonanceVector(input.trim());
```
❌ Console directly calls RBI function!

**`S2S_Console/src/lib/rbi/generateResonanceVector.ts`** (line 20-23):
```typescript
export async function generateResonanceVector(text: string): Promise<ResonanceVector> {
  const engine = ResonanceEngine.getInstance();
  const analysis = await engine.analyzeContent(text);
  return ResonanceVectorMath.signatureToVector(analysis.signature);
}
```
❌ Console imports and uses RBI_Kernel directly!

**`S2S_Console/app/api/rbi/score/route.ts`** (line 24):
```typescript
const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
```
❌ Console has local API routes that call RBI!

**`S2S_Console/app/api/rbi/neighbors/route.ts`**:
❌ Console has local RBI API routes!

### ❌ Hardcoded Data in Console

**Evidence:**
- `S2S_Console/src/lib/content/codexLoader.ts` has static mode with hardcoded JSON files
- `S2S_Console/app/api/orbs/route.ts` has hardcoded Orb data
- `S2S_Console/app/api/content/route.ts` uses static JSON

### ✅ Should Be:

Console should ONLY call CMS_Backend APIs:
- `GET /api/console/content` - for content
- `GET /api/orbital/personalities` - for Orbs
- `POST /api/ai/conversation` - for inquiries
- `POST /api/rbi/field-sense` - for field sensing

**No direct RBI imports or local API routes!**

---

## 5. Governance Check

### ❌ RBI Computation Without Metadata Context

**Locations Found:**

1. **`app/api/ai/resonance-source-selection/route.ts`** (line 173):
   ```typescript
   const resonanceAnalysis = await resonanceEngine.analyzeContentWithMathematics(content);
   ```
   - Metadata extracted AFTER (line 126-161)
   - Used for scoring AFTER (line 176)

2. **`app/api/ai/process-content/route.ts`** (line 43):
   ```typescript
   const analysis = await enhancedEngine.analyzeContentWithMathematics(content, title);
   ```
   - No metadata passed at all
   - Metadata generated FROM analysis (line 47-54)

3. **`app/api/resonance/analyze/route.ts`** (line 28):
   ```typescript
   const resonanceAnalysis = await resonanceEngine.analyzeContentWithMathematics(content);
   ```
   - No metadata passed

4. **`lib/resonance-api.ts`** (line 21):
   ```typescript
   const analysis = await engine.analyzeContentWithMathematics(markdown, title);
   ```
   - No metadata passed

5. **`S2S_Console/src/lib/rbi/generateResonanceVector.ts`** (line 22):
   ```typescript
   const analysis = await engine.analyzeContent(text);
   ```
   - Console calling RBI directly without metadata

### ✅ Restructuring Required

**All RBI calls should be:**
```typescript
// 1. Extract metadata FIRST
const yaml = file.yaml_frontmatter || {};
const metadata = {
  orb_associations: extractOrbAssociations(yaml),
  field_function: yaml.field_function || {},
  book_threading: yaml.book_threading || {},
  integration_points: yaml.integration_points || {},
  tags: yaml.tags || []
};

// 2. Pass metadata to RBI
const analysis = await engine.analyzeContentWithMathematics(
  content,
  title,
  metadata  // ← Metadata included
);

// 3. RBI uses metadata.orb_associations to weight computation
```

**RBI_Kernel signature should be:**
```typescript
analyzeContentWithMathematics(
  content: string,
  title?: string,
  metadata?: {
    orb_associations?: number[];
    field_function?: any;
    book_threading?: any;
    integration_points?: any;
    tags?: string[];
  }
): Promise<EnhancedResonanceAnalysis>
```

---

## 6. Correct Data Hierarchy

### ❌ Current (INCORRECT):

```
Content File → RBI_Kernel(content) → Analysis
                ↓
            Metadata extracted separately
                ↓
            Metadata used for scoring
                ↓
            Response to Console
```

### ✅ Should Be (CORRECT):

```
Content File → Extract Metadata FIRST
                ↓
            RBI_Kernel(content, metadata) → Analysis (metadata-weighted)
                ↓
            Combine: {content, metadata, rbi_output}
                ↓
            Response to Console
```

---

## 7. Recommendations

### Priority 1: CRITICAL

1. **Update RBI_Kernel signature** to accept metadata:
   ```typescript
   analyzeContentWithMathematics(content, title, metadata)
   ```

2. **Update all RBI calls** to extract metadata FIRST, then pass to Kernel

3. **Remove RBI from S2S_Console**:
   - Delete `S2S_Console/src/lib/rbi/`
   - Delete `S2S_Console/app/api/rbi/`
   - Update `InquiryInterface` to call `CMS_Backend/api/ai/conversation` only

4. **Unify API response structure**:
   ```typescript
   {
     content: string,
     metadata: {...},
     rbi_output: {...}
   }
   ```

### Priority 2: HIGH

5. **Update `/api/console/content`** to include full metadata:
   - Add `resonance_metrics`
   - Add `category`
   - Add `integration_points`
   - Add `dashboard_component`
   - Return full `yaml_frontmatter` or structured metadata object

6. **Update RBI_Kernel** to use `metadata.orb_associations` in computation, not just scoring

### Priority 3: MEDIUM

7. **Add metadata validation** before RBI calls
8. **Add metadata transformation layer** to normalize before RBI
9. **Document metadata → RBI → Console flow** in architecture docs

---

## 8. Summary

**Current State:**
- ❌ RBI_Kernel receives NO metadata
- ❌ Metadata extracted AFTER RBI
- ❌ Console calls RBI directly
- ❌ No unified API response structure
- ⚠️ Metadata used for scoring, not computation

**Required State:**
- ✅ Metadata extracted FIRST
- ✅ RBI_Kernel receives `{content, metadata}`
- ✅ RBI uses `metadata.orb_associations` in computation
- ✅ Console only calls CMS_Backend APIs
- ✅ Unified response: `{content, metadata, rbi_output}`

**Governance Violation:** RBI_Kernel is currently the controlling source (computes without metadata), when it should be subordinate to Codex metadata.

