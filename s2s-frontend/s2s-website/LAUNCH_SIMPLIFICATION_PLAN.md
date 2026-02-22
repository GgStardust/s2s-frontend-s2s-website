# S2S Website Launch Simplification Plan

**Goal:** Scale back the site for Book One launch: one primary purchase path (POD widget), retire preorder, hide Codex until Console, slim Console page. Then reorganize existing copy to focus on Book One. No rewrites—reuse and reorganize.

**Order of work:** Codex (Option A) → Console → Retire preorder + POD → Content focus on Book One.

---

## Phase 1: Codex — Option A (remove from nav and homepage, keep route)

**Intent:** Codex stays in the codebase and at `/codex` for future/Console use. Users no longer see it in nav or on the homepage.

### 1.1 Navigation
- **File:** `components/Navigation.tsx`
- **Change:** Remove the Codex item from `navItems` (remove `{ href: '/codex', label: 'Codex' }`).
- **Result:** No Codex link in header (desktop or mobile).

### 1.2 Homepage
- **File:** `app/page.tsx`
- **Change:** No Codex mentions on homepage (audit: there are no direct links to `/codex` on the homepage currently; no change needed unless you add some later).
- **Optional:** If any “Explore more” or footer link points to Codex, remove or point elsewhere.

### 1.3 Sitemap / SEO
- **File:** `app/sitemap.ts`
- **Change:** Either remove `/codex` from the sitemap (so it’s not promoted to search) or leave it (page still exists, just not linked). **Recommendation:** Remove from sitemap so the launch site doesn’t emphasize Codex.

### 1.4 What we are NOT doing
- Not deleting `app/codex/` or `app/codex/[id]/` or `content/essays-data.ts`.
- Not changing Codex page content; it remains available for direct URL or future Console linking.

---

## Phase 2: Console — slim copy, one CTA

**Intent:** Console page stays, but copy is minimal: what it is in one short paragraph, “Coming Summer 2026,” and one CTA (e.g. newsletter or “Notify me”), no preorder link.

### 2.1 Console page content
- **File:** `app/console/page.tsx`
- **Changes:**
  - Replace the current multi-section copy with:
    - **Headline:** e.g. “The Console” (keep).
    - **Subhead:** e.g. “Real-time coherence system. Coming Summer 2026.”
    - **One short paragraph:** Use existing copy from “What the Console Is” (e.g. “The Console functions as a real-time application layer…”) and trim to 2–4 sentences. No need to list all features (Sovereign Field Inquiry, Orb Activation Cluster, etc.)—save that for when Console launches.
    - **Single CTA:** Newsletter signup and/or “Get notified when the Console launches” (can use same NewsletterSignup component with a different label or a dedicated list).
  - Remove or collapse: “How It Works,” “What You Receive,” “Early Access for Preorder Participants” (and any Button linking to `/preorder`).
- **Copy source:** Pull from existing `app/console/page.tsx` paragraphs; no new writing, just shorten and remove preorder.

### 2.2 Console in navigation
- **File:** `components/Navigation.tsx`
- **Change:** Keep Console in nav. Optional: add `comingSoon: true` if you have that UI (e.g. “Console (Soon)”) so it’s clear it’s not live yet.

### 2.3 Content / lib
- **File:** `lib/content.ts`
- **Change:** `CONSOLE_INFO.earlyAccess` (and any similar) can be updated to remove “Preorder Book One to secure your early access.” Replace with something like “Join the newsletter to be notified when the Console launches.” Use wherever Console CTA is shown.

---

## Phase 3: Retire preorder + one primary path (POD widget)

**Intent:** As of the cutoff date, preorder is over. Single path to purchase = POD widget. No form-based preorder flow as primary.

### 3.1 Preorder route behavior
- **Option A (recommended):** Redirect `/preorder` to `/books` (or to the page that hosts the POD widget) so old links and bookmarks still land on the purchase path.
- **Files:**
  - `app/preorder/page.tsx`: Replace page content with a client-side or server-side redirect to `/books` (or create `app/preorder/route.ts` redirect, or use Next.js `redirect()` in a minimal page).
  - **Option B:** Keep preorder page as a static “Preorder has closed. Purchase Book One below.” and embed the POD widget on that page only. Then all “Buy” CTAs point to `/preorder` (or `/books` if widget lives there).
- **Decision needed:** Where will the POD widget live? Suggested: **Books page** (next to cover + description) as primary; optionally also on Home hero. Plan below assumes **Books** is the main purchase page.

### 3.2 Thank-you page
- **File:** `app/thank-you-preorder/page.tsx`
- **Change:** Either redirect to a generic “Thank you” page (e.g. “Thanks for your order”) or keep this page but update copy to be POD-post-purchase (e.g. “Thank you for your order. You’ll receive a confirmation from [POD provider].”). If POD handles its own thank-you URL, you can redirect `/thank-you-preorder` to that or to `/books` with a query like `?ordered=1` and show a short “Thank you” message.

### 3.3 Add POD widget (single purchase path)
- **Placement:** Books page (`app/books/page.tsx`) — primary. Optionally add a compact “Buy” (POD) block on Home hero.
- **Implementation:**
  - Add a new component or section that embeds your POD snippet (e.g. iframe or script they provide). Ensure it’s accessible (focus not trapped, labels if needed).
  - On Books: Replace “Preorder Book One” button with the POD widget and/or a single “Buy Book One” button that scrolls to or opens the widget.
  - On Home: Replace “Preorder Book One” / “Reserve your copy” CTA with one primary “Get Book One” or “Buy” that links to `/books` (or scrolls to POD on same page if you put widget on Home).
- **Files to touch:**
  - `app/books/page.tsx` — add POD widget section; change primary CTA from preorder to purchase.
  - `app/page.tsx` — change Preorder buttons to “Get Book One” or “Buy” → link to `/books` (or to POD widget on same page).

### 3.4 Replace all preorder CTAs with “Buy” / “Get Book One” (point to POD path)
- **Files and current preorder usage:**
  - `app/page.tsx` — PresaleBanner (see 3.5); hero “Preorder Book One”; “Begin Your Journey” section “Preorder Book One →”. Change to “Get Book One” or “Buy” → `/books`.
  - `app/books/page.tsx` — “Preorder Book One” button → replace with POD widget or “Buy” CTA.
  - `app/about-the-book/page.tsx` — “Preorder” button → “Get Book One” → `/books`.
  - `app/about/page.tsx` — Preorder button → “Get Book One” → `/books`.
  - `app/console/page.tsx` — Remove “Preorder Book One” button (Phase 2); if any “early access” link pointed to preorder, remove or replace with newsletter.
  - `components/BookDescription.tsx` — Preorder button → “Get Book One” → `/books`.
  - `components/Navigation.tsx` — Change “Preorder” nav item to “Buy” or “Get Book One”, href `/books` (or keep “Books” as main and remove separate “Preorder” if Books is the purchase page).
- **Content strings:** `lib/content.ts` — `BUTTON_LABELS.preorder` → e.g. `getBookOne: "Get Book One"` or `buy: "Buy Book One"` and use where the primary purchase CTA is shown.

### 3.5 Banner and messaging
- **File:** `components/PresaleBanner.tsx` + `lib/content.ts`
- **Change:** Update `PRESALE_INFO` (e.g. `announcement`, `shortAnnouncement`) from “Presale Now Open” / “Preorder” to “Book One available” / “Order now” or similar. Use existing tone; switch from preorder to general availability.
- **Optional:** If you want a “First edition” or “Author’s edition” line, keep that in copy; just remove “preorder” and “reserve” language.

### 3.6 Terms, Privacy, Footer
- **File:** `app/terms/page.tsx` — Update payment/shipping/refund copy to reflect POD (e.g. “You purchase through [POD provider]. Payment and fulfillment are handled by them.”). Remove or adjust “preorder” and “Zelle/Venmo” if no longer used. Keep Console access line (e.g. “Console access will be announced… Summer 2026”) and point to newsletter for updates.
- **File:** `app/privacy/page.tsx` — Change “when you preorder” to “when you purchase” or “when you order” where applicable.
- **File:** `app/layout.tsx` (footer) — “Stay updated with preorder announcements and Console releases” → “Stay updated with Console releases and news” (or “book and Console updates”). Link to newsletter.
- **File:** `components/Footer.tsx` (if used) — Same footer copy update as layout.

### 3.7 SEO and schema
- **File:** `app/layout.tsx` — Book schema: update `offers.url` from `/preorder` to `/books` (or wherever POD lives). If you have `availability: PreOrder`, change to `InStock` or as appropriate for POD.
- **File:** `app/preorder/layout.tsx` — If you redirect preorder, you can leave layout minimal or remove metadata for preorder (since the URL redirects).
- **File:** `app/sitemap.ts` — Remove `/preorder` from sitemap or leave and let redirect handle it (recommend remove to avoid indexing a redirect-only URL).

---

## Phase 4: Reorganize content to focus on Book One

**Intent:** Use existing copy only; reorganize so the site clearly centers “Book One: The Cosmic Tapestry” and one purchase path.

### 4.1 Homepage
- **File:** `app/page.tsx`
- **Current:** Hero → Paradigm box → Glimpse box → About This Work → Begin Your Journey (Preorder).
- **Reorganize:**
  - **Hero:** Keep title, Book One subtitle, 1–2 short lines from `BOOK_DESCRIPTIONS.bookOne` (or `HOMEPAGE_SECTIONS.glimpse`). One primary CTA: “Get Book One” → `/books` (or scroll to POD if on page).
  - **One “What this is” block:** Combine or shorten Paradigm + Glimpse into a single block (use `HOMEPAGE_SECTIONS.paradigm` and one paragraph from `glimpse`). Link “Read more” → About the book.
  - **About This Work:** Keep but shorten; remove “Your Preorder Matters” (replace with “Order Book One” or remove). Use `SELF_PUBLISHING.why` if desired.
  - **Begin Your Journey:** Single CTA to get the book (link to Books or POD). No second “Preorder” button.
- **Copy:** All from `lib/content.ts` and existing `app/page.tsx`; rearrange and trim only.

### 4.2 Books page
- **File:** `app/books/page.tsx`
- **Reorganize:**
  - **Primary block:** Book One only: cover, title, short description (from `BOOK_DESCRIPTIONS.bookOne`), POD widget (or “Buy” button that scrolls to widget).
  - **Testimonials:** Keep “Report from the Field” / TestimonialsTicker.
  - **From the Manuscript:** Keep 1–2 expandable excerpts; “More from the Manuscript” can stay as details/summary. Ensures Book One is the star.
  - **Future volumes:** One short paragraph (Book Two, Three “in development”); no big sections. Optional: “Join the newsletter for announcements.”
- **Copy:** Existing; no new writing.

### 4.3 About the book
- **File:** `app/about-the-book/page.tsx`
- **Reorganize:** Keep “What This Is,” “The Paradigm,” and any “Who This Is For” / “What Book One Contains” sections. Remove or shorten repeated presale/preorder callouts; single CTA at bottom: “Get Book One” → `/books`. Use `SECTION_HEADINGS`, `HOMEPAGE_SECTIONS`, `BOOK_DESCRIPTIONS` from content.ts.

### 4.4 About (author)
- **File:** `app/about/page.tsx`
- **Reorganize:** Keep as is structurally; ensure single CTA is “Get Book One” → `/books`. No preorder language.

### 4.5 Content constants
- **File:** `lib/content.ts`
- **Changes:** Already partially covered in Phase 3 (button labels, PRESALE_INFO, CONSOLE_INFO). Add or rename keys as needed (e.g. `getBookOne`, `buyBookOne`) and remove or repurpose preorder-specific strings so all pages use the same Book One + purchase messaging.

---

## Checklist summary

- [ ] **Phase 1 — Codex:** Remove from nav; remove from sitemap; leave `/codex` route and content.
- [ ] **Phase 2 — Console:** Slim copy to one paragraph + “Coming Summer 2026” + one CTA; remove preorder button and long feature lists.
- [ ] **Phase 3 — Preorder retired + POD:** Redirect or repurpose `/preorder`; add POD widget (primary on Books); replace all Preorder CTAs with Get Book One / Buy → Books; update Terms/Privacy/Footer/schema/banner.
- [ ] **Phase 4 — Book One focus:** Reorganize Home, Books, About the book, About (author) and content.ts so Book One and one purchase path are unmistakable; reuse existing copy only.

---

## POD widget note

When you have the POD snippet (embed code or script), add it in the place chosen in 3.3 (e.g. Books page). Ensure:

- One clear “Buy” or “Get Book One” that leads to that widget (or to a page that contains it).
- No competing primary CTA (no “Preorder” and “Buy” both as primary).
- Accessibility: focus management and labels for the widget if it’s an iframe or custom control.

---

*Plan created so the site can be scaled back first (Codex, Console, preorder → POD), then content reorganized around Book One without rewrites.*
