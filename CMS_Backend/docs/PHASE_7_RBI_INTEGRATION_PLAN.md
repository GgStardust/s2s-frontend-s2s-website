# Phase 7: RBI Integration Plan
## Field-Level Coherence Architecture Integration

**Date:** 2025-01-26  
**Status:** Ready to Start  
**Priority:** Critical for V3  
**Reference:** `CMS_Backend/docs/RBI_ARCHITECTURE_LEVERAGE_ASSESSMENT.md`

---

## How This Fits Into the Build Plan

### Current State
- ✅ **Phase 1.5:** Critical fixes completed (SFI results, practices populating, content connection)
- ✅ **Phase 0:** Content tagging migration created (ready to run)
- ✅ **Phase 2.5:** Question management migration created (ready to run)
- ⏳ **Phase 4.5:** Console frontend basic flow complete
- ⏳ **Phase 7:** RBI Integration - **READY TO START NOW**

### Why Start Phase 7 Now

**Current Implementation Gap:**
- Console V3 is using **manual cosine similarity** instead of RBI's field-level coherence architecture
- This is a **critical architectural gap** that should be fixed before building more features on top

**Benefits of Starting Now:**
1. **Foundation First** - Build on proper RBI architecture from the start
2. **Accurate Field Signatures** - RBI provides true coherence computation, not approximations
3. **Content Validation** - Proof-of-Meaning ensures content integrity
4. **Resonance-Based Matching** - Coherence-based pathway matching, not semantic similarity

**Risk of Waiting:**
- More code built on manual cosine similarity = more to refactor later
- Pathway matching will be less accurate without RBI coherence
- Content validation won't happen without RBI

---

## Phase 7.1: RBI Integration into Sovereign Field Inquiry

### Step 1: Replace Manual Computation with RBI Kernel

**File:** `CMS_Backend/lib/services/console-v3/rbi-integration-service.ts`

**Current Code:**
```typescript
// Manual cosine similarity
const dotProduct = (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z) + (v1.w * v2.w);
const similarity = dotProduct / (mag1 * mag2);
```

**Target Code:**
```typescript
import { EnhancedResonanceEngine } from 'rbi-kernel';
import type { ContentMetadata } from 'rbi-kernel/types';

const engine = EnhancedResonanceEngine.getInstance();

// Build content from diagnostic responses
const diagnosticContent = JSON.stringify({
  responses: responses.map(r => ({
    question_id: r.question_id,
    answer: r.raw_answer,
    orb_weights: questions.find(q => q.id === r.question_id)?.orb_weights
  }))
});

// Build metadata
const metadata: ContentMetadata = {
  orb_associations: extractOrbAssociations(responses, questions),
  field_function: {
    content_purpose: 'sovereign_field_inquiry',
    primary_mechanism: 'diagnostic_analysis',
    console_context: 'sfi_computation',
  }
};

// Use RBI's full field analysis
const analysis = await engine.analyzeContentWithMathematics(
  diagnosticContent,
  `Diagnostic Session ${session.id}`,
  metadata
);

// Extract field signature from RBI analysis
return {
  orb_profile: buildOrbProfile(analysis),
  undercurrent_profile: buildUndercurrentProfile(analysis),
  coherence_metrics: {
    field_strength: analysis.mathematical.fieldDynamics.fieldStrength,
    coherence: analysis.mathematical.sovereignLogic.coherence,
    stability: analysis.mathematical.fieldDynamics.stability,
    gradient: analysis.mathematical.fieldDynamics.gradient,
  },
  resonance_vector: analysis.mathematical.resonanceVector,
  proof_status: analysis.mathematical.sovereignLogic.validity,
};
```

**Tasks:**
- [ ] Import `EnhancedResonanceEngine` from `rbi-kernel`
- [ ] Replace manual cosine similarity with `analyzeContentWithMathematics()`
- [ ] Build ContentMetadata from diagnostic responses
- [ ] Extract results from `analysis.mathematical`
- [ ] Update `computeSFI()` to use RBI results
- [ ] Add error handling with fallback to weighted sum

**Estimated Time:** 2-3 days

### Step 2: Update SFI Calculation to Use RBI Results

**File:** `CMS_Backend/lib/services/console-v3/diagnostic-service.ts`

**Current Code:**
```typescript
// Uses RBI but scales incorrectly
const sfiScore = Math.max(0, Math.min(100, rbiCoherence * 100));
```

**Target Code:**
```typescript
// Use RBI's coherence directly (already 0-1 scale)
const sfiScore = analysis.mathematical.sovereignLogic.coherence * 100;

// Use RBI's field dynamics for state determination
const sfiState = determineSFIStateFromRBI(analysis.mathematical);
```

**Tasks:**
- [ ] Update `computeSFI()` to use RBI analysis results
- [ ] Use RBI's coherence metrics for SFI score
- [ ] Use RBI's field dynamics for SFI state
- [ ] Store RBI analysis results in diagnostic_sessions table

**Estimated Time:** 1 day

### Step 3: Add Content Coherence Validation ✅

**Files:**
- `CMS_Backend/lib/services/console-v3/content-validation-service.ts` ✅
- `CMS_Backend/app/api/codex/entries/[id]/route.ts` ✅
- `CMS_Backend/app/api/console/v3/practices/[id]/route.ts` ✅

**Implementation:**
- Created `content-validation-service.ts` with `validateCodexEntry()` and `validatePractice()` functions
- Validates orb/undercurrent associations against architecture
- Uses RBI to analyze content coherence and Proof-of-Meaning
- Non-blocking validation (includes results in response, doesn't filter)
- Validates coherence threshold (default: 0.7)
- Returns validation status, coherence, proof status, warnings

**Tasks:**
- [x] Add RBI validation to Codex API endpoints
- [x] Validate practices before serving
- [x] Return validation status in API responses
- [ ] Validate exercises before including in pathways (future)

**Status:** ✅ Complete

---

## Phase 7.2: Resonance-Based Pathway Matching

### Step 4: Replace Template Matching with RBI Resonance

**File:** `CMS_Backend/lib/services/console-v3/pathway-service.ts`

**Current Code:**
```typescript
// Simple orb alignment scoring
const alignmentScore = pathwayOrbs.reduce((sum, orb) => 
  sum + (userOrbProfile[`orb_${orb}`] || 0), 0
) / pathwayOrbs.length;
```

**Target Code:**
```typescript
// Compute user's field signature with RBI
const userAnalysis = await engine.analyzeContentWithMathematics(
  userFieldSignature,
  'User Field State',
  { orb_associations: userOrbProfile }
);

// For each pathway template, compute resonance
const pathwayMatches = await Promise.all(
  pathwayTemplates.map(async (template) => {
    const templateAnalysis = await engine.analyzeContentWithMathematics(
      template.description,
      template.name,
      { orb_associations: template.orb_focus }
    );
    
    // Calculate resonance similarity (coherence-based)
    const resonance = await engine.calculateResonanceSimilarity(
      userFieldSignature,
      template.description,
      { orb_associations: userOrbProfile },
      { orb_associations: template.orb_focus }
    );
    
    return {
      pathway: template,
      resonance_score: resonance,
      coherence: templateAnalysis.mathematical.sovereignLogic.coherence,
      field_alignment: computeFieldAlignment(userAnalysis, templateAnalysis)
    };
  })
);

// Rank by resonance (coherence-based matching)
const bestMatch = pathwayMatches
  .filter(m => m.coherence > 0.7) // Only coherent pathways
  .sort((a, b) => b.resonance_score - a.resonance_score)[0];
```

**Tasks:**
- [ ] Replace `matchPathway()` with RBI resonance-based matching
- [ ] Use `calculateResonanceSimilarity()` for coherence-based matching
- [ ] Filter pathways by RBI coherence (> 0.7 threshold)
- [ ] Rank by resonance score, not just orb alignment

**Estimated Time:** 2-3 days

---

## Phase 7.3: Coherence-Based Practice Sequencing

### Step 5: Generate Dynamic Practice Sequences

**File:** `CMS_Backend/lib/services/console-v3/pathway-service.ts`

**Target Code:**
```typescript
// Generate dynamic practice sequence using RBI coherence
const practiceCoherence = await Promise.all(
  practices.map(async (practice) => {
    const practiceAnalysis = await engine.analyzeContentWithMathematics(
      practice.description,
      practice.name,
      { orb_associations: practice.orb_associations }
    );
    
    // Calculate resonance with user's field state
    const resonance = await engine.calculateResonanceSimilarity(
      userFieldSignature,
      practice.description,
      { orb_associations: userOrbProfile },
      { orb_associations: practice.orb_associations }
    );
    
    return {
      practice,
      resonance,
      coherence: practiceAnalysis.mathematical.sovereignLogic.coherence,
      field_alignment: computeFieldAlignment(userAnalysis, practiceAnalysis)
    };
  })
);

// Build sequence based on coherence and resonance
const sequence = practiceCoherence
  .filter(p => p.coherence > 0.7) // Only coherent practices
  .sort((a, b) => {
    // Primary: resonance with field state
    if (Math.abs(a.resonance - b.resonance) > 0.1) {
      return b.resonance - a.resonance;
    }
    // Secondary: coherence score
    return b.coherence - a.coherence;
  })
  .map(p => p.practice);
```

**Tasks:**
- [ ] Replace fixed template sequences with RBI coherence-based sequences
- [ ] Use RBI resonance to determine optimal practice order
- [ ] Ensure practices resonate with each other
- [ ] Validate practice coherence with user's field state

**Estimated Time:** 3-4 days

---

## Implementation Order

### Week 1: Foundation (Phase 7.1)
1. **Day 1-2:** Replace manual computation with RBI Kernel
2. **Day 3:** Update SFI calculation to use RBI results
3. **Day 4-5:** Add content coherence validation

### Week 2: Matching & Sequencing (Phase 7.2 & 7.3)
4. **Day 6-8:** Resonance-based pathway matching
5. **Day 9-12:** Coherence-based practice sequencing

**Total Estimated Time:** 12 days (2.5 weeks)

---

## Testing Strategy

### Unit Tests
- [ ] Test RBI field signature computation
- [ ] Test coherence validation logic
- [ ] Test resonance-based matching
- [ ] Test practice sequence generation

### Integration Tests
- [ ] Test end-to-end diagnostic → SFI → pathway flow with RBI
- [ ] Test content validation in Codex API
- [ ] Test pathway matching with RBI resonance
- [ ] Test practice sequencing with RBI coherence

### Validation Tests
- [ ] Verify RBI produces different results for different answers
- [ ] Verify pathways match user's field state accurately
- [ ] Verify practices are ordered by coherence, not just readiness
- [ ] Verify content validation prevents low-coherence content

---

## Success Criteria

- [ ] RBI Kernel fully integrated (no manual cosine similarity)
- [ ] SFI computation uses RBI's field-level coherence architecture
- [ ] Content validation uses Proof-of-Meaning
- [ ] Pathway matching uses resonance-based matching
- [ ] Practice sequencing uses coherence-based ordering
- [ ] All RBI results stored in database
- [ ] Fallback mechanisms in place for RBI failures

---

## Next Steps

1. ✅ **Review this plan** - Confirm approach
2. ⏳ **Start Phase 7.1 Step 1** - Replace manual computation with RBI Kernel
3. ⏳ **Test RBI integration** - Verify field signature computation works
4. ⏳ **Continue with Steps 2-5** - Complete RBI integration

**Ready to proceed?** Start with Step 1: Replace manual computation with RBI Kernel.

