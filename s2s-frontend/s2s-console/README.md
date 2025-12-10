# S2S Console

The Sovereignty Console - A real-time navigation interface

## Development

### Start Development Server

```bash
npm run dev
```

The console runs on **port 5001** (not 5000).

### Access URLs

- **Console Home:** http://localhost:5001
- **Diagnostic:** http://localhost:5001/diagnostic
- **Pathway:** http://localhost:5001/pathway
- **Inquiry:** http://localhost:5001/inquiry

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CMS_BACKEND_URL=http://localhost:4000
```

### Port Configuration

The console is configured to run on port 5001 in `package.json`:
```json
"dev": "next dev -p 5001"
```

If you need to change the port, update the `dev` script in `package.json`.

---

## Architecture

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Design:** White Editorial Palette
  - Background: `#ffffff`
  - Text: `#111111`
  - Accent: `#c5a96e` (gold)

---

## Features

- ✅ Diagnostic System (Sovereign Field Inquiry)
- ✅ Pathway View
- ✅ Inquiry Interface (Phase 8.4)
- ✅ Responsive Design

---

## Troubleshooting

**Port 5001 already in use:**
```bash
# Kill existing process
lsof -ti:5001 | xargs kill -9

# Or use a different port
npm run dev -- -p 5002
```

**Backend not responding:**
- Ensure CMS_Backend is running on port 4000
- Check `NEXT_PUBLIC_CMS_BACKEND_URL` environment variable



