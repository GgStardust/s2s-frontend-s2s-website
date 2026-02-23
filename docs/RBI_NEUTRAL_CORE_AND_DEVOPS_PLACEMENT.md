# RBI: Neutral Core Extraction + Where It Sits in DevOps

**Purpose:** (1) What "code without sovereignty/coherent language" means and how to extract it. (2) Where RBI actually sits in DevOps and how it is invoked. (3) Where the "actual correct" RBI code lives (and that the language-neutral extraction was planned but not completed).

**Canonical location:** This doc lives in `S2S_RBI_System/docs/`. TPB v2 is used only as an example for tangible value.

---

## Pick-up summary (explicit outline)

Use this when you come back to the file. Everything below is spelled out in the sections that follow.

| Topic | Where in this doc | One-line takeaway |
|-------|-------------------|-------------------|
| **Where does the real RBI code live?** | §0 | RBI-Kernel + RBI-Architecture-Service (more complete). No separate "neutral" codebase yet; extraction was planned, not done. |
| **Paths** | §0, this table | RBI codebase root: `.../Projects/S2S_RBI_System/`. Canonical kernel: `RBI-Kernel/rbi_kernel_src/`. Extraction archive: `docs/archive/rbi-extraction/`. |
| **RBI vs Cursor/Opus** | This table only | RBI does **not** live in Cursor or Opus. RBI = your service (RBI-Architecture-Service). Cursor (via cursor-rbi-extension) and CI **call** that service over HTTP. |
| **What goes in the app repo (e.g. TPB)?** | §2, this table | **Only** a CI step that POSTs to RBI + env/secret for `RBI_SERVICE_URL`. **No** RBI source code or Kernel in the app repo. Jeff (or any dev) adds the **caller**, not the RBI code. |
| **How to get RBI without sovereignty/Orb language** | §1 | Extract: neutral API surface (e.g. `evaluate`, `verify`, `ValidationProof`) + optional S2S adapter. §1.1–1.3 spell out what to rename and where the language lives. |
| **Where RBI sits in DevOps** | §2 | RBI = separate service (URL). DevOps uses it from a **CI job** (e.g. GitHub Actions) that calls `/field/validate`, `/field/score`, `/field/enforce`. Diagram and example in §2.1–2.3. |
| **Tangible value (time, money, AI safety)** | §3 | Saves time/money by catching drift and violations earlier; allows modern AI dev with a deterministic "in bounds?" gate. TPB v2 example table in §3.2. |

**Next steps when you pick this up:** (1) For neutral core: do the extraction in §1 (neutral API + types; S2S as optional adapter). (2) For DevOps: run RBI-Architecture-Service somewhere, add a CI job in the app repo that POSTs to its URL, set `RBI_SERVICE_URL` in secrets.

---

## 0. Where the RBI Code Actually Lives (And the Language-Neutral Gap)

**Finding: There is no separate codebase that is fully free of sovereignty/Orb language.** The mechanics exist; the **language-neutral extraction was planned but not completed**.

| Location | What it is | Sovereignty/Orb language? |
|----------|------------|---------------------------|
| **RBI-Kernel/rbi_kernel_src/** | Canonical RBI computation (Layers 2 & 4 complete; 1, 3, 5 were placeholders in this copy). | Yes: `verifyConsciousness`, sovereign-logic, resonance-vectors dimension names, `orb_associations` in types, proof-of-meaning API. |
| **RBI-Architecture-Service** (and its embedded `rbi-kernel` / `field/`) | More complete 5-layer implementation (temporal, propagation, stabilization, boundary validators). | Yes: same surface (verifyConsciousness, etc.). |
| **CMS_Backend/lib/rbi/core/** | Legacy minimal embed: `computeResonance`, `scoreVectors`, `findNeighbors`, Jaccard. Used by book compiler and some API routes. | Still has "Orb" in param names (`orbOverlap`) and in types (`validatedOrbs`). Not a neutral core. |
| **resonance-engine.ts** (inside RBI-Kernel and Architecture Service) | Core *calculations* are geometric/embedding-based; comments say "Mathematically neutral: No S2S/Orb language in core calculations." | **Calculations** are neutral; **output types** still expose `orb_associations`, `EnergeticSignature` (clarity, coherence, resonance, sovereignty). So the math is neutral; the API surface is not. |

**Extraction archive** (`docs/archive/rbi-extraction/`):

- **RBI_EXTRACTION_INQUIRY.md** — Canonical source = `RBI-Kernel/rbi_kernel_src/`; legacy embeds should migrate to the package.
- **RBI_KERNEL_CANDIDATES_ANALYSIS.md** — RBI-Architecture-Service has the more complete layers; plan was to move those into RBI-Kernel and **"Abstract S2S-Specific Terminology"** (remove `orb_associations`, `field_function`, etc. from core). That abstraction was an **action item**, not a completed separate codebase.
- **README.md** — Extraction outcome was packaging and embedding the kernel (v1.0.0); no mention of a finished language-neutral variant.

So: the **actual correct RBI code** lives in **RBI-Kernel** and in **RBI-Architecture-Service** (more complete). The **code without the sovereignty/Orb language** does not exist as a separate artifact yet. Next step: do the extraction (neutral API surface + optional S2S adapter) as in §1.

---

## 1. Extraction: Code Without Sovereignty / Coherent Language

The RBI codebase mixes **generic mechanisms** (math, boundaries, drift, validation) with **domain language** (sovereignty, consciousness, Orbs, resonance). A clean separation would look like this.

### 1.1 Already Largely Neutral (Minimal Rename)

| Component | What it does | Current language | Neutral equivalent |
|-----------|--------------|-------------------|---------------------|
| **Boundary validation** | Compare values to rules (path, operator, severity) | "boundary", "coherence" | Keep "boundary", "coherence" as technical terms or use "constraint", "score" |
| **BoundaryValidator** | Plugin interface: validate(content, boundaries) → violations | — | No change |
| **Drift detector** | Time-series slope, volatility, drift flag | — | No change |
| **Stabilization engine** | Adjust thresholds from drift | — | No change |
| **Coherence calculator** | Pairwise scores, vector math | "coherence", "resonance" | "coherence" = structural consistency; "resonance" → "alignment" or "similarity" |
| **Content metadata** | associations, contentFunction, threading | "orb_associations" (deprecated) | Use `associations` (numeric category IDs); no Orb mention |
| **Field operators** | Neighbor search in vector space | "field", "resonance" | "field" → "embedding space" or "vector space"; "resonance" → "similarity" |

So: **boundary validation, drift, stabilization, neighbor search** are already logic that doesn't depend on sovereignty/consciousness. They only need naming and docs to be "neutral."

### 1.2 Where the Sovereignty / Orb Language Lives

| Location | Role | Change for neutral core |
|----------|------|---------------------------|
| **sovereign-logic.ts** | Type-theoretic validation; proof terms; validity | Keep the *algorithm*. Expose as `validateStructure()` or `verifyProof()` with types like `ValidationProof`, `validity: 'proven' \| 'partial' \| 'unproven' \| 'error'`. Remove "consciousness", "ConsciousnessContext", "verifyConsciousness". |
| **resonance-vectors.ts** | 4D vector, harmonic analysis, matrix, field dynamics | Keep the math. Rename dimensions: e.g. `x,y,z,w` or `d1,d2,d3,d4`, or `clarity, consistency, alignment, authority` (no "sovereignty", "resonance" if fully neutral). Remove Orb relationship map and Orb preference weights from *core*; make them an optional "category system" plugin. |
| **proof-of-meaning.ts** | Wraps SovereignLogic; exports `verifyConsciousness` | New entry point: e.g. `verify(content, categoryIds?)` returning `{ verified, confidence, proof }`. No "consciousness" in the API. |
| **Contract spec / API** | `verifyConsciousness`, `orb_associations`, `sovereignLogic` | Neutral API: `evaluate(content, metadata?)` → `{ score, signature: { d1, d2, d3, d4 }, proof, validity }`. `metadata.associations` (numbers only). No "orb", "sovereign", "consciousness" in request/response. |

So the **extraction** is: a thin **neutral API + types** that call the same underlying math, with (a) sovereignty/consciousness/Orb names removed from the surface and (b) Orb-specific logic moved to an optional adapter or config so the core stays domain-agnostic.

### 1.3 What "The Code Ought to Exist Without That Language" Implies

- **Core package (e.g. `rbi-core` or `coherence-kernel`):**  
  - Input: `content: string`, optional `metadata: { associations?: number[], ... }`.  
  - Output: scores (0–1), 4D vector, proof, validity, optional boundary violations.  
  - No exports named "sovereignty", "consciousness", "Orb", "verifyConsciousness".  
  - Boundary validation, drift, stabilization, neighbor search unchanged in behavior, neutral in naming.

- **Optional layer (e.g. S2S or "Orb" adapter):**  
  - Maps "Orb" IDs to the generic `associations` and optional relationship/preference config; can still use the same core.

That way the "code" that does the work exists without the sovereignty/coherent language; the language becomes an optional interpretation on top.

---

## 2. DevOps: Where RBI Sits and How It Works

RBI does **not** live inside the application repo. It sits **outside**, as a **separate service** that DevOps (and optionally the IDE) **calls**.

### 2.1 Where It Sits (Architecture)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Your app repo (e.g. TPB, or any product codebase)                       │
│  - Source code, configs, docs                                            │
│  - CI config (e.g. GitHub Actions, GitLab CI)                            │
└─────────────────────────────────────────────────────────────────────────┘
                    │
                    │  HTTP POST (e.g. on push/PR, or on deploy)
                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  RBI Architecture Service (separate deployment)                          │
│  - Same codebase as today (RBI-Architecture-Service)                     │
│  - Runs as a REST API (e.g. on a small VM, or serverless)                │
│  - Endpoints: /field/validate, /field/score, /field/enforce,             │
│    /field/analyze, /field/neighbors, /field/analyze/codebase, etc.        │
└─────────────────────────────────────────────────────────────────────────┘
```

So: **RBI = sidecar/shared service**. Same service can be used by many repos or pipelines.

### 2.2 Where It Runs in the Pipeline (Concrete)

| Stage | Where | What calls RBI | What gets sent | What RBI returns | Typical use |
|-------|--------|----------------|----------------|-------------------|-------------|
| **PR / pre-merge** | CI job in your repo | Script or CI step | e.g. changed files' content, or key config/docs | `verified`, `score`, `violations` | Gate merge if score < threshold or boundary violations |
| **Pre-deploy** | CI/CD (e.g. after build, before deploy) | Same | Config diff, release notes, or critical paths | Same | Block deploy if boundaries violated or coherence too low |
| **IDE** | Developer machine | Editor extension (e.g. cursor-rbi-extension) | Current file or selection | Score, hints | Real-time feedback; no pipeline change |
| **Scheduled / ops** | Cron or pipeline | Script | Snapshot of configs, or time-series of metrics | Drift report, baseline comparison | Alert on drift or regression |

So for **DevOps**, the primary "where" is: **inside a CI job** (or a pre-deploy step), which runs in the same place as your other lint/test jobs. That job is the only thing that "knows" about RBI; the rest of the app does not.

### 2.3 Example: One CI Job That Uses RBI

```yaml
# .github/workflows/rbi-check.yml (or similar)
jobs:
  rbi-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate with RBI
        run: |
          content=$(cat docs/architecture.md)
          response=$(curl -s -X POST "${{ secrets.RBI_SERVICE_URL }}/field/validate" \
            -H "Content-Type: application/json" \
            -d "{\"content\": $(echo "$content" | jq -Rs .)}")
          score=$(echo "$response" | jq -r '.sovereignLogic.coherence // .signature.coherence')
          if (( $(echo "$score < 0.7" | bc -l) )); then
            echo "RBI coherence below 0.7: $score"
            exit 1
          fi
```

- **Where does RBI sit?** → On a URL (the RBI Architecture Service).
- **Where does the check run?** → In CI, as one job among many (lint, test, build, …).

### 2.4 Boundary / "DevOps" Use (Enforce Rules)

Same RBI service; endpoints like `/field/validate` (with `boundaries` + `domain`) or `/field/enforce`, `/field/pre-validate`. A CI step builds a payload (`content` + `boundaries` + `domain`), POSTs to RBI, fails the job if `valid: false` or `violations.length > 0`.

### 2.5 Summary: "Where" and "How"

- **Where RBI sits:** As its own **service** (RBI Architecture Service), deployed once and called over HTTP. Not inside the app binary; not inside the app repo as a library (unless you later embed the Kernel in a CLI for offline use).
- **Where DevOps uses it:** In **CI/CD** (and optionally in the IDE). A **job** or **step** in your pipeline is the only thing that invokes RBI; the rest of the app stays unaware.
- **How it works:** Pipeline sends **content** (and optionally **boundaries** + **domain**) → RBI returns **scores + proof + validity** (and optionally **violations**) → pipeline passes or fails the job based on your policy (e.g. score > 0.7 and no critical violations).

---

## 3. Tangible Value of RBI for TPB v2 (Example)

Using TPB v2 as the example: what RBI actually gives you, in concrete terms.

### 3.1 The TPB v2 Context (Brief)

- **Phase 1:** Schema, RLS, auth, deployment (external senior). Foundation is "irreversible" — get it right.
- **Phase 2:** Verify Jeff's 5 POS adapters (TL review + fix), integrate CMS/Kiosk to API, E2E QA.
- **Two code streams:** External (foundation) + Jeff (adapters). TL must review Jeff's code before production.
- **API contract** = source of truth between UIs and backend. **POS test fixtures** = answer key for adapter verification.
- **CodeScene** already in use for all code.

RBI does **not** replace CodeScene, the TL, or the mandate. It adds a **deterministic coherence-and-boundary layer** that can gate or prioritize work.

### 3.2 Tangible Value by Risk / Phase

| Risk or need | What RBI does (concretely) | Tangible outcome for TPB v2 |
|--------------|----------------------------|-----------------------------|
| **Adapter vs API contract drift** | Score "this adapter (or route) vs the documented API contract." Track over time. | Catch mismatches before TL review or E2E; focus TL time on low-coherence PRs. |
| **Schema/RLS boundaries** | Define boundaries (e.g. "no cross-tenant access," "RLS policy present for table X"). Validate schema docs or config against them. | Extra automated check that critical constraints are reflected; fail CI if violated. |
| **Two streams (Jeff + external)** | Score each PR: does it move the codebase toward or away from agreed patterns (e.g. from API contract, schema, or KB)? | Objective "coherence delta" per PR; prioritize which PRs need the hardest look. |
| **POS verification (Phase 2)** | Input: adapter code + POS fixtures (or expected shapes). Coherence = "does this code match the expected behavior/shape?" | Not a full test suite — a **structural consistency** signal; TL still does semantic review and E2E. |
| **Docs/code alignment** | Score "this change vs the 127K-line KB (or key docs)." | Keep KB as single source of truth; catch when code diverges from documented patterns so AI and humans stay aligned. |
| **Pre-merge gate** | CI job: on every PR, send changed files (or key artifacts) to RBI; boundaries = "multi-tenant rules, no PII in logs," etc. Fail if score < threshold or boundary violations. | Fewer "how did this get in?" moments; review time spent on exceptions, not everything. |

### 3.3 What You Don't Get (So It's Honest)

- **RBI is not a substitute for:** E2E tests, the TL's sign-off, CodeScene, or human judgment on "is this the right design?"
- **RBI does not:** Run your tests, deploy your app, or validate the mandate. It evaluates **coherence and boundaries** on content you send it (code, config, docs).

### 3.4 Does It Save Time, Save Money, and Allow Modern (AI) Dev with More Safety?

| Question | Answer |
|----------|--------|
| **Save time?** | **Yes, indirectly.** Fewer "wrong merge then fix" cycles; TL and QA focus on low-coherence PRs instead of reviewing everything equally. Less rework when adapter/API or code/docs drift is caught in CI instead of in E2E or production. |
| **Save money?** | **Yes, to the extent rework and late-stage bugs cost more.** Catching boundary violations and drift early reduces Phase 2 rework and Phase 3 firefighting. The cost of running RBI (one service + a CI step) is small compared to a few avoided "foundation fix" or "adapter redo" sprints. |
| **Allow modern (AI) dev with more safety?** | **Yes.** TPB v2 already relies on AI-assisted dev (Cursor, Jeff's pace). RBI adds a **deterministic gate**: AI-generated or human-edited code is checked for coherence with API contract, schema/RLS, and key docs before merge. So you can move fast with AI while having an automated "did we stay in bounds?" check — more safety without blocking the speed. |

**Short version:** RBI saves time and money by catching drift and boundary violations earlier and by focusing human review; it makes AI-assisted development safer by adding a repeatable coherence-and-boundary check so you can ship faster without giving up guardrails.

### 3.5 Summary: One-Line Tangible Value for TPB v2

**RBI gives you an automated, deterministic check that code and config stay structurally consistent with your API contract, schema/RLS boundaries, and key docs — and a way to gate or prioritize reviews so the TL and E2E focus where coherence is lowest.**
