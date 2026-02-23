# Quick Start Guide

## First Time Setup

1. **Open the app:**
   - Navigate to `post-preview-app/` folder
   - **Simply open `index.html` in your browser** (works without a server!)
   - Or use a local server: `python3 -m http.server 8000` then visit `http://localhost:8000`

2. **Verify content loads:**
   - You should see 8 sample posts in the grid (3 Gateway, 2 Scrollstreams, 2 Definitions, 1 Excerpt)
   - The app uses embedded data, so it works even when opening the file directly
   - If you see "No posts match", check your filters

## Convert Markdown to JSON (One-Time)

**Note:** The conversion script paths assume specific file locations. You may need to adjust paths.

1. **Run conversion script:**
   ```bash
   cd "Marketing S2S Book 1/post-preview-app"
   node convert-markdown-to-json.js
   ```

2. **If paths don't match:**
   - Edit `convert-markdown-to-json.js`
   - Update `GATEWAY_SOURCE` and `SCROLLSTREAM_SOURCE` paths
   - Re-run script

3. **Verify output:**
   - Check `data/gateway.json` has posts
   - Check `data/scrollstreams.json` has posts
   - Refresh browser to see new content

## Using the App

### Filtering Posts

1. **By Stage:** Check/uncheck stage checkboxes
2. **By Tier:** Check/uncheck tier checkboxes (default: Tier 1a)
3. **By Invariant:** Select from dropdown
4. **By Pattern:** Select from dropdown
5. **By Content Type:** Check/uncheck content types
6. **By Status:** Check/uncheck status types
7. **Glyph Only:** Check to show only posts with glyphs

### Selecting Posts

1. **Click any card** to select/deselect
2. **Selected count** appears in header
3. **Selected summary** appears at bottom right
4. **Multi-select** is supported

### Generating Draft Posts

1. Fill in "Generate New Post" form:
   - Select Invariant (1-10)
   - Select Pattern (P1-P10)
   - Select Tier (0, 1a, 1, 1b)
   - Select Stage (Arrival, Stabilization, Deepening, Activation)
   - Select Content Type
2. Click "Generate Draft"
3. Draft appears in feed (marked as "Draft")
4. Edit `data/drafts.json` to complete content
5. Change status to "canonical" when ready

### Screenshot Workflow

1. **Filter to desired posts**
2. **Select posts** you want to schedule
3. **Use browser dev tools:**
   - Right-click card → Inspect
   - Find `.card-preview` element
   - Right-click → Capture node screenshot
   - Or use browser screenshot extension
4. **Export list:** Click "Export List" to save selected post IDs

### Adding New Content

**Method 1: Edit JSON directly**
1. Open `data/gateway.json` (or appropriate file)
2. Add new post object following schema
3. Save file
4. Refresh browser

**Method 2: Use Generate interface**
1. Generate draft using form
2. Edit `data/drafts.json` to complete
3. Move to appropriate file when ready

## Troubleshooting

**No posts showing:**
- Check browser console for errors
- Verify JSON files exist in `data/` folder
- Check JSON syntax is valid

**Glyphs not showing:**
- Verify `glyphs/` folder has PNG files
- Check glyph file paths in JSON match actual filenames
- Check browser console for 404 errors

**Filters not working:**
- Check browser console for JavaScript errors
- Verify all filter IDs match in HTML and JS

**Cards not rendering:**
- Check JSON structure matches schema
- Verify required fields are present
- Check browser console for errors

---

**The app is ready to use!**  
**Start by opening `index.html` in your browser.**
