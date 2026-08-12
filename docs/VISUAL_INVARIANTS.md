# Visual invariants — Stardust to Sovereignty

These rules make radically different page compositions feel like one website.

Cohesion comes from **discipline**, not from repeating a visual motif.

Page roles remain distinct:

| Page | Function |
|------|----------|
| Home | Threshold |
| S2S | Dispersed field / recognition through encounter |
| Inquiry | Open attention |
| Orbs | Differentiated architecture |
| Book One | Literary traversal |
| Gigi | Provenance / human process |
| Order | Transaction |
| Privacy / Terms | Utility |

Do **not** seek cohesion by making primary pages more visually alike.

---

## 1. Color / ground

- Warm editorial cream (`--paper`)
- Near-black / deep dark field (`--ink`)
- Restrained neutral text (`--muted`, `--ink-soft`, light-register equivalents)
- Limited warm accent use

Avoid proliferating intermediate theme colors.

**Light / dark transitions are semantic events.** Do not alternate cream and black merely for visual variety. A ground change should correspond to a change in mode, scale, or attention.

## 2. Typography

- Editorial serif: Cormorant (`--serif`)
- Small tracked metadata / navigation: IBM Plex Mono (`--mono`)
- Existing hierarchy logic

Variation must come from size, roman vs italic, line length, line-height, spacing, placement, and section height — **not** new typefaces.

## 3. Rules

- Thin, restrained dividers (`--rule`, `--rule-light`)
- No heavy boxed systems unless function truly requires them
- Prefer shared horizontal rules over full rectangular containment for editorial lists/fields

## 4. Space

- Generous margins
- Meaningful negative space
- Willingness to leave regions empty
- No impulse to fill unused desktop space

Absence is part of the design vocabulary.

## 5. Shape language

Avoid:

- Rounded app cards
- Pill-heavy interfaces
- Large drop shadows
- Glassmorphism
- Generic SaaS UI
- Decorative gradients without semantic purpose

## 6. Image scarcity

Images should change the register.

Do not add imagery simply because a region feels empty.

## 7. Asymmetry

Controlled asymmetry is part of the system.

Do not normalize every page into centered or symmetrical composition.

## 8. Page-specific composition

Do not create one universal section component and force all primary pages into it.

## 9. Mobile / responsive order

Desktop may use asymmetry, offsets, and scattered fragments.

On mobile:

- Preserve **conceptual dependency**
- Prefer a DOM order that is conceptually correct by default
- Do not use visual CSS reordering that mismatches screen-reader / keyboard order
- Translate spatial duration into paragraph/section spacing and typography — not enormous empty viewports

Test: “What becomes possible to understand here because of what the visitor has already encountered?”

## 10. Silence

A section may intentionally contain substantial visual silence.

If an element is added merely because space looked empty — remove it and reassess.
