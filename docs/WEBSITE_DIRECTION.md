# Website Direction

How **stardusttosovereignty.com** should read for new visitors, grounded in Book One (Author's Edition v12). Companion: [BOOK_ONE_WEB_BRIEF.md](./BOOK_ONE_WEB_BRIEF.md).

---

## Purpose

The site sells and orients **Book One: The Cosmic Tapestry**. It is not the book, not the full paradigm encyclopedia, and not a product landing page for RBI/Console yet.

**Success:** A curious visitor understands what the book is, who it is for, and how to buy it within 60 seconds — without needing to know what an Orb is.

---

## Three doors (visitor paths)

### Door 1 — Curious browser

**Needs:** Plain language, one emotional hook, one structural sentence, clear CTA.  
**Path:** Home → Order (or Books if they want more before buying).  
**Avoid:** Orb list, lineage essay, Source Field jargon, multiple competing narratives.

### Door 2 — Serious reader

**Needs:** Proof of voice, excerpt quality, trilogy context, author credibility.  
**Path:** Home → Books (prologue + anchor excerpt) → About (paradigm) → Order.  
**Avoid:** Duplicating full paradigm on Home and About.

### Door 3 — Depth seeker

**Needs:** Essays, glossary-adjacent material, Orb exploration, optional RBI context later.  
**Path:** Footer **Source Field** → individual essays; About for paradigm + constellation.  
**Avoid:** Putting Source Field in primary nav (keeps Door 1 clean).

---

## Page roles

| Page | Job | Primary manuscript sources |
|------|-----|----------------------------|
| **Home** | Orient + one mythic sample + commerce | Introduction tone; prologue teaser; anchor excerpt; Series Note one line |
| **About** | Paradigm + author + Orbs constellation | Paradigm section; Appendix A one-liners; Author's Note |
| **Books** | Read before buy: excerpts, map, trilogy | Prologue, Field sample, chapter anchors, back matter in `<details>` |
| **Source Field** | Optional depth (essays) | Essays aligned to chapters/Orbs; no broken `/rbi` until page exists |
| **Order** | Commerce only | `publishingMetadata`; Stripe direct; no paradigm blocks |
| **Console** | Placeholder / future | Minimal; not in main conversion path |

### Navigation

**Primary nav:** Home · About · Books · Order  
**Footer only:** Source Field, legal, sitemap  
**Legacy redirects:** `/codex` → `/source-field`; `/thank-you-preorder` → `/order/success`

---

## Layered disclosure (how much esoteric, where)

```
Layer 0 — Home hero
  "Structured map of consciousness" + recognition frame + CTA

Layer 1 — Home body
  What this is · Who it's for · Prologue teaser · Anchor Q&A · Series one paragraph

Layer 2 — About
  Full paradigm lead · Orb constellation (names + one-liners) · Author

Layer 3 — Books
  Long excerpts · interludes · consciousness overview · collapsed back matter

Layer 4 — Source Field
  Essays · codex entries · RBI mention without dead links

Layer 5 — Book itself
  Full mythic frame · all chapters · appendices · glossary
```

**Rule:** Never skip a layer on Home. Orbs are Layer 2+, not Layer 0.

---

## Copy principles

1. **Manuscript over archive** — v12 and [BOOK_ONE_WEB_BRIEF.md](./BOOK_ONE_WEB_BRIEF.md) beat old plans in `docs/archive/`.
2. **Recognition before theory** — match Introduction contract.
3. **One CTA voice** — `Order Author's Edition, $44 shipped` (from `ORDER_CTA` in `lib/content.ts`).
4. **Affirmative, varied vocabulary** — see style docs in archive; no em dashes in marketing strings.
5. **Poetic where sampled, plain where orienting** — comet voice on Books; clear sentences on Home/Order.
6. **No duplicate blocks** — paradigm quote lives on About; Home uses distinct hero (`lib/homepageCopy.ts`).

---

## Orbs: placement rules

| Location | Allowed |
|----------|---------|
| Home hero | No Orb list; at most one phrase ("thirteen Orbs") |
| Home "What this is" | One sentence on Orbs as movements |
| About | Full constellation (13 one-liners) + link to Books/Source Field |
| Books | Chapter/Orb map; excerpts tied to chapters |
| Source Field | Deep dives per theme |
| Order | None |

---

## Commerce

- **Live path:** `/order/direct` (Stripe) → `/order/success`
- **Hub:** `/order` lists channels from `publishingMetadata`
- **Removed from active UX:** preorder countdown, presale banner, thank-you-preorder content
- Sticky/inline **OrderCommerceStrip** on Home and Books only

---

## Technical / content hygiene (done or ongoing)

**Completed (cleanup pass):**

- Removed unused components: `ParadigmSection`, `PresaleBanner`, `BookDescription`, `ManuscriptQuote`, `AudienceCarousel`, `PreorderCountdown`, `Footer.tsx`
- `thank-you-preorder` redirects to `/order/success`
- Removed broken `/rbi` link on Source Field page
- Moved `BOOK_2_3_UPDATE_PLAN.md` to `docs/archive/` (superseded by Series Note)
- Removed unused `HOMEPAGE_SECTIONS` from `lib/content.ts`

**Still optional:**

- Add `/rbi` page or keep RBI as plain text until ready
- Trim `lib/content.ts` legacy quotes if unused
- Align Source Field essay metadata with Orb map

---

## Next step: copy pass (after you approve this doc)

1. Read site aloud as Door 1 visitor (Home → Order).
2. Apply [BOOK_ONE_WEB_BRIEF.md](./BOOK_ONE_WEB_BRIEF.md) gaps list.
3. Add About Orbs constellation component (static data from brief).
4. Fix Book 2/3 teaser titles on Books page if still outdated.
5. One more dedupe pass: Home vs About vs Books shared paragraphs.

**Do not** rewrite manuscript excerpts in `lib/manuscriptWebsiteCopy.ts` without explicit editorial approval.

---

## Files to treat as canonical for web work

| File | Role |
|------|------|
| `lib/homepageCopy.ts` | Home strings (Atticus-aligned) |
| `lib/content.ts` | CTAs, catalog, order channels |
| `lib/manuscriptWebsiteCopy.ts` | Verbatim excerpts |
| `lib/publishingMetadata.ts` | ISBN, pricing, KDP |
| `docs/BOOK_ONE_WEB_BRIEF.md` | Manuscript distillations |
| `docs/WEBSITE_DIRECTION.md` | This document |

---

*Approved for implementation planning. Copy pass waits on steward sign-off.*
