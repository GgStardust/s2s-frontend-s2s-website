# RBI Pitch Deck

This directory contains the RBI Pitch Deck presentation files.

## Files

- `RBI_PITCH_DECK_SLIDEV.md` - Slidev markdown source file
- `RBI_PITCH_DECK_SLIDEV.pdf` - Exported PDF version
- `rbi-pitch/` - Built static HTML version

## Quick Start

**Development Mode (with hot reload & presenter mode):**
```bash
pnpm slidev
# Opens at http://localhost:3030 (or next available port)
```

**Static Build (view built HTML):**
```bash
pnpm slidev:build  # Build first
pnpm slidev:serve  # Then serve
# Opens at http://localhost:8080
```

## Running the Deck

### Development Mode (with hot reload)

```bash
cd RBI-Architecture-Service
pnpm slidev
```

This will start the Slidev dev server, typically on `http://localhost:3030`

### Presenter Mode

**To access presenter mode:**

1. Start the dev server: `pnpm slidev`
2. Open the presentation in your browser (check terminal for the exact URL, usually `http://localhost:3030`)
3. **Method 1:** Press **`p`** key while viewing the slides
4. **Method 2:** Navigate directly to: `http://localhost:3030/presenter` (replace 3030 with your actual port)
5. **Method 3:** Click the presenter icon in the bottom-right corner of the slide view

**Presenter mode features:**
- Shows current slide + next slide preview
- Speaker notes (if added to slides)
- Timer
- Drawing tools
- Remote control (if enabled)

**Troubleshooting presenter mode:**

If presenter mode doesn't work:
1. **Check the URL:** Make sure you're using the dev server URL (not a static build). The URL should show the slide number, e.g., `http://localhost:3030/1`
2. **Check the port:** Verify the port number in the terminal output when you run `pnpm slidev`
3. **Try direct URL:** Navigate to `http://localhost:3030/presenter` (replace 3030 with your port)
4. **Browser console:** Open browser DevTools (F12) and check for JavaScript errors
5. **Browser compatibility:** Use a modern browser (Chrome, Firefox, Edge, Safari)
6. **Restart server:** Stop the Slidev server (Ctrl+C) and restart with `pnpm slidev`
7. **Clear cache:** Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**Note:** Presenter mode only works in dev mode (`pnpm slidev`), not in the static build (`rbi-pitch/` directory).

### Building Static Version

```bash
pnpm slidev:build
```

This creates a static HTML version in the `rbi-pitch/` directory with relative paths, so it can be opened directly or served.

**To view the static build:**

**Option 1: Serve with HTTP server (recommended)**
```bash
pnpm slidev:serve
```
The server will start on `http://localhost:8080`. Open this URL in your browser to view the static build.

**Option 2: Open directly**
- Navigate to `RBI-Architecture-Service/rbi-pitch/` folder
- Open `index.html` in your browser
- Note: Some browsers may have security restrictions with ES modules when opening files directly

### Exporting to PDF

```bash
pnpm slidev:export
```

This generates `RBI_PITCH_DECK_SLIDEV.pdf`

## Port Configuration

**Development Mode (`pnpm slidev`):**
- Default port: `3030`
- If port 3030 is already in use, Slidev will automatically use the next available port
- Check the terminal output for the actual port number
- To specify a custom port: `pnpm slidev --port 3031`

**Static Build Serve (`pnpm slidev:serve`):**
- Default port: `8080`
- The static build is served at `http://localhost:8080`
- To use a different port, modify the `slidev:serve` script in `package.json`

## Keyboard Shortcuts

- **Arrow keys** or **Space** - Navigate slides
- **`p`** - Toggle presenter mode
- **`f`** - Fullscreen
- **`o`** - Overview mode
- **`g`** - Go to slide number
- **`?`** - Show all shortcuts

