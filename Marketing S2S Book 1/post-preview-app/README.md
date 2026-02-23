# S2S Post Preview App

**Purpose:** Local, static preview tool for Instagram post cards using S2S design system.

**Usage:** Weekly or bi-monthly for batch selection and screenshot for Buffer scheduling.

---

## Project Structure

```
post-preview-app/
├── index.html          # Main app interface
├── cards.css           # Design tokens and styles
├── cards.js            # Rendering and filtering logic
├── data/               # JSON content files
│   ├── gateway.json
│   ├── scrollstreams.json
│   ├── definitions.json
│   ├── excerpts.json
│   └── drafts.json
├── glyphs/             # Orb images (copied from website)
│   └── orb_*.png
└── README.md
```

---

## Design System

**Extracted from:** `s2s-frontend/s2s-website/`

**Colors:**
- Light Field: `#FFFFFF` background, `#0A0E27` text
- Dark Field: `#0A0E27` background, `#F4F1E8` text
- Accent: `#4DFFFF` (fluorescent cyan)
- Terminator Gradient: `#FFB347` → `#FFA500` → `#4A9EFF`

**Typography:**
- System Sans (SF Pro, Segoe UI, Helvetica Neue, Arial)
- Gateway Line 1: 20px
- Gateway Lines 2-3: 18px
- Gateway Line 4 (Question): 22px, Bold
- System Definition Title: 28px, Bold
- System Definition Body: 18px

**Card Size:** 1080x1080px (Instagram square)

---

## Content Metadata Schema

Each post in JSON files must follow this structure:

```json
{
  "id": "unique-identifier",
  "contentType": "gateway | scrollstream | definition | excerpt",
  "tier": "0 | 1a | 1 | 1b",
  "invariant": "1-10",
  "pattern": "P1-P10",
  "recommendedStage": ["Arrival", "Stabilization", "Deepening", "Activation"],
  "lines": ["line 1", "line 2", "line 3", "line 4"],  // For gateway posts
  "content": "text content",  // For scrollstream/definition/excerpt
  "title": "title",  // For definition posts
  "source": "source",  // For excerpt posts
  "attribution": "attribution",  // For scrollstream posts
  "glyph": {
    "used": true/false,
    "file": "orb number (1-13) or filename",
    "label": "Orb name",
    "placement": "corner | background"
  },
  "visualMode": "light | dark",
  "status": "canonical | generated | archived",
  "notes": "optional notes"
}
```

---

## Stage Definitions

### Arrival
**Purpose:** Recognition + orientation  
**Content:** Tier 1a Gateway Statements, minimal definitions  
**Reader state:** "This matches what I've been noticing"  
**Excludes:** CTAs, density, explanation

### Stabilization
**Purpose:** Normalize pattern recognition  
**Content:** Gateway + Scrollstreams + occasional Tier 1  
**Reader state:** "I can track this system comfortably"

### Deepening
**Purpose:** Increase density + architectural clarity  
**Content:** Tier 1 / 1b, Codex fragments, Book excerpts, glyphs  
**Reader state:** "I understand how this system operates"

### Activation
**Purpose:** Support sovereign engagement (book, console, participation)  
**Content:** Still governed by engine; tone unchanged  
**Reader state:** "I'm ready to engage directly"

---

## Adding New Content

### Method 1: Edit JSON Directly

1. Open the appropriate JSON file in `data/`
2. Add new post object following the schema
3. Save file
4. Refresh browser (app auto-reloads)

### Method 2: Use Generate Interface

1. Fill in the "Generate New Post" form
2. Click "Generate Draft"
3. Draft appears in feed (marked as "Draft")
4. Edit `data/drafts.json` to complete content
5. Change status to "canonical" when ready

---

## Content Conversion Script

**One-time conversion from Markdown to JSON:**

See `convert-markdown-to-json.js` (to be created)

**After conversion:**
- JSON is the source of truth
- Edit JSON directly
- Markdown is archive only

---

## Usage Workflow

1. **Open app:** Open `index.html` in browser
2. **Filter posts:** Use sidebar to filter by stage, tier, invariant, pattern, etc.
3. **Select posts:** Click cards to select (multi-select supported)
4. **Preview:** Cards render at 1080x1080 for screenshot
5. **Screenshot:** Use browser dev tools or screenshot tool
6. **Export list:** Click "Export List" to save selected post IDs as JSON
7. **Schedule:** Use screenshots and export list in Buffer

---

## Glyph Usage

**Rules:**
- Frequency: ~1 per 10-12 posts
- Stage bias: Deepening / Activation
- Placement: corner or subtle background
- Opacity: low (0.15 light, 0.2 dark)
- Text labels: optional, rendered separately

**Glyph files:** Located in `glyphs/` folder  
**Naming:** `orb_01_origin_intelligence.png`, etc.

---

## Notes

- **No publishing:** This app is preview-only
- **No automation:** Screenshot manually
- **No backend:** All local, static files
- **No tracking:** No analytics, no history
- **Buffer handles:** All scheduling and posting

---

## Future Enhancements (Out of Scope for Now)

- Search functionality
- Performance optimization for large content sets
- Advanced filtering combinations
- Content versioning
- Batch export of card images

---

**This app is the living operator surface for S2S social content.**  
**All planning documents are historical reference only.**
