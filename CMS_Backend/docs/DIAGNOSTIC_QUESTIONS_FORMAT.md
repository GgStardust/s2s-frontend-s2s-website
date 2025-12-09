# Diagnostic Questions Format Guide

**Last Updated:** 2025-01-26

---

## ✅ What We Already Have

You **already have diagnostic questions** in the database! Currently:
- **8 diagnostic questions** in the `beta` question set
- All are active and ready to use
- They follow the correct format

---

## 📋 Required Format for Diagnostic Questions

**Key Difference:** Diagnostic questions are **questions WE ask THEM** (with answer options), not questions they ask us.

### Required Fields

```json
{
  "question_text": "The question to ask the user",
  "question_description": "Optional description of what this maps to",
  "response_type": "single_choice" | "multi_choice" | "scale",
  "answer_options": ["Option 1", "Option 2", "Option 3", "..."],
  "orb_weights": {
    "1": 0.4,  // Weight for Orb 1 (0.0 - 1.0)
    "2": 0.3,  // Weight for Orb 2
    "12": 0.3  // Weight for Orb 12
  },
  "order_index": 1,  // Sequential order (1, 2, 3, ...)
  "question_set": "beta",  // 'beta', 'early_reader', 'inquiry', 'contextual', 'system_generated'
  "source": "system_generated",  // 'early_reader_feedback', 'system_generated', 'user_submitted', 'beta_test'
  "is_active": true
}
```

### Optional Fields

```json
{
  "undercurrent_weights": {
    "uc_1": 0.5,
    "uc_3": 0.5
  },
  "practice_weights": {
    "practice_1": 0.3,
    "practice_5": 0.7
  },
  "tags": ["entry", "relational", "time", "signal"],
  "inquiry_context": "when_orb_5_active",
  "triggers": {
    "orb_profile": {"orb_5": 0.7},
    "sfi_state": "coherent"
  },
  "follow_up_question_ids": [10, 11, 12],
  "selection_priority": 7,  // 1-10, higher = more likely to be selected
  "layer_focus": "foundational"  // 'foundational', 'functional', 'advanced', 'mixed', 'all'
}
```

---

## 📊 Example: Existing Diagnostic Question

Here's one of your existing questions:

```json
{
  "id": 1,
  "question_text": "When you enter a room, what registers first?",
  "question_description": "This question maps to Signal Orientation and field awareness",
  "response_type": "single_choice",
  "answer_options": [
    "tone / atmosphere",
    "people & emotions",
    "expectations",
    "nothing specific"
  ],
  "order_index": 1,
  "orb_weights": {
    "1": 0.4,
    "2": 0.3,
    "12": 0.3
  },
  "question_set": "beta",
  "source": "system_generated",
  "is_active": true
}
```

---

## 🔄 Diagnostic Questions vs Inquiry Questions

### Diagnostic Questions (Phase 2.5)
- **We ask them** - Questions with answer options
- **Purpose:** Assess user's field state, orb profile, practice readiness
- **Format:** Must have `answer_options` array
- **Response types:** `single_choice`, `multi_choice`, `scale`
- **Stored in:** `diagnostic_questions` table
- **Example:** "When you enter a room, what registers first?" with 4 answer options

### Inquiry Questions (Phase 8)
- **They ask us** - Questions users might ask
- **Purpose:** Provide answers to user questions
- **Format:** No answer options (they're questions, not choices)
- **Stored in:** `inquiry_questions` table
- **Example:** "What does sovereignty mean here, and how do I recognize it in my own life?"

---

## ✅ What You Have

**Current Status:**
- ✅ 8 diagnostic questions in database (beta set)
- ✅ All have answer options
- ✅ All have orb_weights
- ✅ All are active

**What You Might Want:**
- More diagnostic questions (to expand the beta set)
- Additional question sets (early_reader, contextual, etc.)
- Questions that map to specific practices or undercurrents

---

## 📝 How to Add More Diagnostic Questions

### Option 1: Use the API
```bash
POST /api/console/v3/questions
Content-Type: application/json

{
  "question_text": "Your question here",
  "response_type": "single_choice",
  "answer_options": ["Option 1", "Option 2", "Option 3"],
  "orb_weights": {"1": 0.5, "2": 0.5},
  "order_index": 9,
  "question_set": "beta",
  "source": "system_generated"
}
```

### Option 2: Create a JSON file and use loader script
Create `data/diagnostic-questions-new.json`:
```json
{
  "questions": [
    {
      "question_text": "Your question",
      "response_type": "single_choice",
      "answer_options": ["Option 1", "Option 2"],
      "orb_weights": {"1": 0.5},
      "order_index": 9
    }
  ]
}
```

Then modify `load-early-reader-questions.ts` to work with diagnostic questions, or create a new loader.

---

## 🎯 Summary

**You already have diagnostic questions!** The 8 beta questions are working.

**If you want to add more:**
- They need `answer_options` (unlike inquiry questions)
- They need `orb_weights` to map answers to orbs
- They can have `undercurrent_weights` and `practice_weights`
- Use `order_index` to sequence them

**The 53 inquiry questions you provided are different** - those are questions users ask, not questions we ask them. Those are already loaded in Phase 8.

