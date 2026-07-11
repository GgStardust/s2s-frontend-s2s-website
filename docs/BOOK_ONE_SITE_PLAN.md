# Book One Website Plan

**Goal:** The site helps a new visitor understand Book One, sample its voice, and buy the Author's Edition — without needing to know the wider S2S ecosystem first.

**Decision:** Edit this site in place (do not rebuild). Checkout, routes, and deploy are already working.

**Accessibility** here means: plain language, clear hierarchy, one job per page, readable on mobile, WCAG basics (contrast, focus, reduced motion — already partially in place).

---

## What each page does

| Page | Job | Why |
|------|-----|-----|
| **Home** | Answer: What is this book? Who is it for? How do I buy? | First-time visitors land here; keep it short. |
| **Books** | Prove the voice (excerpts) + purchase | Readers need to *feel* the book before buying. |
| **About** | Paradigm + author (for the curious) | Depth for people who want structure before buying. |
| **Order** | Commerce only | Price, format, checkout — no philosophy. |
| **Source Field** | Optional depth (footer link) | Essays for readers already in the work; not part of the front door. |

---

## Phased changes

### Phase 1 — Front door (Home)
**Why:** Home currently repeats Orbs, lineage, series, testimonials, and commerce. The manuscript asks readers to enter gently; the home page should mirror the Introduction, not the appendices.

| Change | Why |
|--------|-----|
| Hero: plain pitch + primary Order button | Visitor should know how to buy within one screen. |
| Remove Orbs from hero subcopy | Manuscript introduces Orbs after the invitation; naming them twice on Home adds jargon. |
| Keep one excerpt (Stardust Within Q&A) | Shows structural voice without mythic overwhelm. |
| Remove lineage block from Home | Lineage belongs on About; Home link is enough. |
| Move testimonials below the fold or remove | Social proof is optional; it competes with the book's own voice. |
| One commerce strip, clear invitation at bottom | Single CTA voice: Order Author's Edition, $44 shipped. |

### Phase 2 — About as paradigm gateway
**Why:** About currently includes a long first-person Orb monologue — powerful in the book, confusing on the web without context.

| Change | Why |
|--------|-----|
| Replace Orb monologue with scannable list (13 one-liners) | Accessible map; detail stays in the book. |
| Add short "Why now" (from Introduction themes) | Grounds the work without product jargon. |
| Link to Books for excerpts, Source Field for essays | Progressive disclosure. |

### Phase 3 — Books + cleanup
**Why:** Books page is mostly right; trim ecosystem noise.

| Change | Why |
|--------|-----|
| Shorten or remove Console/Source Field block on Books | Book One is the product; ecosystem is continuation. |
| Fix outdated trilogy title in Terms | Align with manuscript Series Note. |

### Phase 4 — Optional
- Console page: minimal placeholder
- Source Field essay alignment with chapters
- `/rbi` page when ready

---

## Copy source of truth

Manuscript: `authors-edition-v12.md` (Author's Edition v12).  
Web strings: `lib/homepageCopy.ts`, `lib/manuscriptWebsiteCopy.ts` (excerpts verbatim only).

---

*Phases 1–3 implemented. See git history for details.*
