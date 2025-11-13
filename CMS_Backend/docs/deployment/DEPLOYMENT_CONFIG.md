# Deployment Configuration

## Port Configuration

### CMS_Backend (API Server)
- **Port**: `3000`
- **URL**: `http://localhost:3000`
- **Start Command**: `cd CMS_Backend && npm run dev`
- **Purpose**: Backend API server, data source, RBI computation, Orbital Brain

### S2S_Console (Frontend)
- **Port**: `5001`
- **URL**: `http://localhost:5001`
- **Start Command**: `cd S2S_Console && npm run dev`
- **Purpose**: Pure presentation layer, calls CMS_Backend APIs

---

## Architecture

```
┌─────────────────┐         HTTP API         ┌─────────────────┐
│  S2S_Console    │ ────────────────────────> │  CMS_Backend    │
│  Port: 5001     │                          │  Port: 3000     │
│  (Frontend)     │ <──────────────────────── │  (Backend)      │
└─────────────────┘      JSON Responses       └─────────────────┘
```

### Separation
- ✅ **S2S_Console**: No business logic, no RBI computation, no data storage
- ✅ **CMS_Backend**: All business logic, RBI computation, data storage, Orbital Brain

### Connection
- ✅ Console calls CMS_Backend via `NEXT_PUBLIC_CMS_BACKEND_URL` env var
- ✅ Default: `http://localhost:3000`
- ✅ All API calls go through `/api/*` endpoints

---

## Environment Variables

### S2S_Console
```bash
NEXT_PUBLIC_CMS_BACKEND_URL=http://localhost:3000
```

### CMS_Backend
```bash
# Database
SUPABASE_URL=...
SUPABASE_ANON_KEY=...

# OpenAI
OPENAI_API_KEY=...

# Other services...
```

---

## Startup Sequence

1. **Start CMS_Backend** (must be first):
   ```bash
   cd CMS_Backend
   npm run dev
   # Server starts on http://localhost:3000
   ```

2. **Start S2S_Console**:
   ```bash
   cd S2S_Console
   npm run dev
   # Server starts on http://localhost:5001
   ```

3. **Access Console**:
   - Open browser to `http://localhost:5001`
   - Console will call CMS_Backend at `http://localhost:3000`

---

## API Endpoints (CMS_Backend)

All endpoints are available at `http://localhost:3000/api/*`:

- `/api/ai/conversation` - AI conversation with Orbital Brain
- `/api/console/content` - Console content filtering
- `/api/orbital/personalities` - Orb personality data
- `/api/console/concept-map` - Concept map visualization
- `/api/rbi/field-sense` - Real-time field sensing
- `/api/books/*` - Book management
- `/api/chapters/*` - Chapter management
- `/api/content-files/*` - Content file management

---

## Verification

### Check Backend is Running:
```bash
curl http://localhost:3000/api/orbital/personalities
```

### Check Console is Running:
```bash
curl http://localhost:5001
```

### Check Connection:
- Open browser console on `http://localhost:5001`
- Submit an inquiry
- Check Network tab for calls to `http://localhost:3000/api/*`

---

## Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

### Connection Errors
- Verify CMS_Backend is running on port 3000
- Check `NEXT_PUBLIC_CMS_BACKEND_URL` in S2S_Console
- Check CORS settings in CMS_Backend (if needed)

### API Errors
- Check CMS_Backend logs
- Verify environment variables are set
- Check database connection

