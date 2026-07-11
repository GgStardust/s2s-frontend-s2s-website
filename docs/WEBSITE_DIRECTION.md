# Website Direction

How **stardusttosovereignty.com** should read for new visitors, grounded in Book One (Author's Edition v12). Companion: [BOOK_ONE_WEB_BRIEF.md](./BOOK_ONE_WEB_BRIEF.md), [WEBSITE_VESSEL_BRIEF.md](./WEBSITE_VESSEL_BRIEF.md).

---

## Purpose

The site sells and orients **Book One: The Cosmic Tapestry**. It is the **vessel membrane**: cover, voice sample, buy.

It is not the book. It is not the platform. RBI, Console, Source Field, and Codex metadata belong to **upstream architecture** and live outside this site until (if ever) they have their own home.

**Success:** A curious visitor understands what the book is, why it was written, and how to buy it within 60 seconds.

---

## Build strategy: revise in place (not parallel v2)

**Recommendation:** Edit the current Next.js site; do not maintain a parallel v2 codebase.

| Revise in place | Parallel v2 site |
|-----------------|------------------|
| Stripe, routes, metadata already work | Duplicate env, checkout, deploy wiring |
| Threshold fix is copy + CSS + IA on ~4 pages | Two codebases to merge or swap |
| Git branch + Vercel preview for steward review | Same preview possible, more overhead |
| One subtree push to production | Risk of drift between v1 and v2 |

Use a **preview branch** (e.g. `book-vessel-pass`) for your read-aloud test. Merge to `main` when the brief is confirmed and Home passes the 60-second test. No second repository unless the stack itself were wrong (it is not).

---

## Visitor paths (book only)

### Curious browser

**Needs:** Plain language, cover, one structural sentence, clear CTA.  
**Path:** Home → Order (or Read if they want voice first).  
**Avoid:** Orb list, platform links, patent language, animated system chrome.

### Serious reader

**Needs:** Proof of voice, excerpt quality, trilogy context.  
**Path:** Home → Read → About → Order.  
**Avoid:** Duplicating full paradigm on Home and About.

Depth seekers find essays and platform tools **off this site** (future platform URL or direct channels), not through book-site footer.

---

## Page roles

| Page | Job | Primary manuscript sources |
|------|-----|----------------------------|
| **Home** | Orient + commerce | Introduction tone; Series Note one line; cover |
| **Read** (`/books`) | Prologue + structural excerpt + interlude sample + trilogy | Prologue; chapter anchors; interlude role named |
| **About** | Paradigm + author + optional Orbs (collapsed) | Paradigm; Author's Note; Appendix A if needed |
| **Order** | Commerce only | `publishingMetadata`; Stripe |

### Navigation

**Primary nav:** Read · About · Order (Home via logo/title)  
**Footer:** Author, legal, contact if any. **No** Source Field, Console, RBI.  
**Legacy:** Redirect `/thank-you-preorder` → `/order/success`. Plan to remove book-site routes for `/source-field`, `/console`, `/codex` from sitemap and nav (routes may 404 or redirect when platform exists).

---

## Layered disclosure

```
Layer 0 — Home
  Cover + what / why / how to enter + Order + Read excerpt

Layer 1 — Read
  Prologue, structural passage, interlude sample, trilogy, Order

Layer 2 — About
  Paradigm prose, author, optional Orbs in details

Layer 3 — Off site
  Platform, essays, Console, RBI (upstream; not book website)
```

---

## Design threshold

Current site reads as **platform landing page** before **book**. Fixes:

- Remove or disable 13-node starfield animation on Home and Order
- Reduce cyan UI chrome and terminator-border boxes on Home
- Serif-led voice blocks; sticky commerce strip optional (steward choice)
- Interludes named on Read as connection layer, not "mythic frame" marketing

---

## Copy authority stack

1. Author's Edition v12 (Introduction, Author's Note, Series Note, Paradigm, Appendix A)
2. Steward edits in [WEBSITE_VESSEL_BRIEF.md](./WEBSITE_VESSEL_BRIEF.md)
3. Style guide: `docs/archive/STYLE_AND_LANGUAGE_UPDATES.md`
4. `publishingMetadata.ts` for price/format only, not spiritual voice

---

## Process (current phase)

1. **Steward confirms** [WEBSITE_VESSEL_BRIEF.md](./WEBSITE_VESSEL_BRIEF.md) (checklist at bottom).
2. **Implement on preview branch:** boundary (remove platform links), quiet Home, copy from brief.
3. **Read-aloud test:** 60 seconds, stranger, path to order.
4. **About + Order polish**, then merge to `main` and deploy.

---

*Updated: July 2026. Book-site-only boundary; revise-in-place strategy.*
