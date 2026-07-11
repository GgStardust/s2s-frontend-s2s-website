# Website Vessel Brief

**Steward review document.** Mark wrong/right. Nothing ships to public pages until you confirm or edit this brief.

Companion: [BOOK_ONE_WEB_BRIEF.md](./BOOK_ONE_WEB_BRIEF.md) (manuscript distillations), [WEBSITE_DIRECTION.md](./WEBSITE_DIRECTION.md) (IA and process).

---

## Site boundary (authoritative)

**stardusttosovereignty.com is the book website.** It sells and orients **Book One: The Cosmic Tapestry** (Author's Edition).

The full Stardust to Sovereignty work includes upstream architecture: RBI, Console, Source Field, Codex metadata, platform tooling. That work **does not belong on this site**. It is not downstream of the book. The book is the **stabilized vessel** readers hold first. Platform layers live elsewhere when they are ready.

| On this site | Not on this site |
|--------------|------------------|
| Book One cover, voice, excerpts | Source Field essays |
| Trilogy context (Series Note) | Console placeholder or signup |
| Author credibility (brief) | RBI / patent language |
| Order (Stripe, format, ship) | Codex / Orb encyclopedia UI |
| Legal (privacy, terms) | Platform "same intelligence, different entry" framing |

**Success:** A curious visitor understands what Book One is, why it exists, and how to buy within 60 seconds. No platform vocabulary required.

---

## Design principle: vessel, not dashboard

The site should feel like **opening the book**, not parsing a product.

- Quiet surface: no animated 13-node starfield on Home or Order
- Serif for voice; sans for labels and commerce only
- One accent color from the cover; no fluorescent system UI
- Generous margin and whitespace (printed page, not landing page)
- Cover large and still on Home

---

## Pages (four surfaces)

| Route | Job | Manuscript source |
|-------|-----|-------------------|
| **Home** (`/`) | Cover + three plain blocks + two actions | Introduction; Series Note (one line); back cover tone |
| **Read** (`/books` or `/read`) | Prologue teaser + one structural excerpt + one interlude sample | Prologue; Stardust Within or body chapter; one interlude |
| **About** (`/about`) | Paradigm in plain prose + author + trilogy paragraph | Paradigm section; Author's Note; Series Note |
| **Order** (`/order`) | Price, format, checkout only | `publishingMetadata`; Stripe |

**Navigation:** Read · About · Order (Home = logo/title click). No platform links in nav or footer.

**Redirects to keep:** `/thank-you-preorder` → `/order/success`. Retire or redirect `/codex`, `/source-field`, `/console` when platform has its own home (or 404 with no nav links until then).

---

## Home copy (draft for steward edit)

Each block maps to manuscript language. Edit freely; keep affirmative tone, no em dashes.

### Block 1 — What this is

Book One maps how lawful order becomes recognizable in a human life: from stellar origin through the body, through time, memory, and relationship, toward sovereignty as participation without loss of origin.

*Source: Series Note (Book One scale); Introduction (living description of consciousness when whole).*

### Block 2 — Why it exists

Stardust to Sovereignty names an architecture for a moment when human and technological scales ask for coherent participation. This volume establishes recognition at human scale. Books Two and Three carry that design into civilization and species life.

*Source: Series Note (three-volume arc); author thesis (bridging present capacity to future intelligences).*

### Block 3 — How to enter

Structural chapters and imaginative interludes work together. Some passages land as recognition. Others bring structure gently into view. The book is offered as a companion in that recognition.

*Source: Introduction (environment, pace); Author's Note (companion in recognition).*

**Interludes (name their job on Read page):** connection, imagination, example, relief from density, creativity. Not decorative mythic frame.

### Actions

- **Order Author's Edition** → `/order`
- **Read an excerpt** → `/books` (or `/read`)

---

## Read page (draft structure)

1. **Prologue teaser** (1–2 sentences + expand or link to full prologue on same page)
2. **Structural sample** — e.g. Stardust Within opening or body-as-interface passage
3. **Interlude sample** — short; label: *Interlude*; one sentence on what interludes do (connection layer)
4. **Trilogy** — three titles, one line each (Series Note)
5. **Order** — single CTA

No Orb constellation on Read unless steward wants it collapsed in `<details>`.

---

## About page (draft structure)

1. **Paradigm** — plain prose from *The Paradigm of Stardust to Sovereignty* (compressed; relationship and recognition lead, not abstract "consciousness behaves")
2. **Author** — lived observation, translation into language; brief
3. **Trilogy** — same as Read; Book Two *The Living Civilization*, Book Three *The Resonant Species*
4. **Order** — single CTA

Optional: thirteen Orbs as collapsible list (Appendix A one-liners). **Not on Home.**

---

## Order page

Commerce only: cover thumbnail, format, price, ship region, Stripe button. No paradigm blocks, no newsletter unless steward wants post-purchase only.

---

## Style constraints

From `docs/archive/STYLE_AND_LANGUAGE_UPDATES.md`:

- No em dashes in public copy
- Affirmative language; avoid "not a system to adopt" style negatives
- Vary field / design / structure / architecture where natural
- Web tone: plain invitation; book-instruction tone ("participate at your own pace," "enter as coherence allows") stays in the book, not marketing headers

---

## Steward confirmation

Confirmed July 2026. Implemented in place on current site.

- [x] **Site boundary:** Book site only; platform links removed from nav and footer
- [x] **Block 1–3:** Voice from brief
- [x] **Nav:** Read · About · Order (Home via logo)
- [x] **Read route:** `/books` kept, labeled Read in nav
- [x] **Launch product:** Author's Edition primary CTA
- [x] **Title on first screen:** *The Cosmic Tapestry* primary

---

## Implementation process (after brief confirmed)

1. **Revise current site in place** (see WEBSITE_DIRECTION.md). Preview branch on Vercel for steward read-aloud test.
2. Remove platform surfaces from book site (footer, About links, Books asides).
3. Quiet design pass (globals, Home, Order).
4. Copy pass from confirmed brief blocks.
5. Read-aloud test: stranger, 60 seconds, path to order.
6. About and Order polish.

---

*Draft: July 2026. Update when steward marks confirmations.*
