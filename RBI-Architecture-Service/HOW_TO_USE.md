# How to Use the RBI Architecture Service

## ✅ Server Status

**Your server is running!** It's listening on `http://localhost:3001`

---

## Quick Access

### In Your Browser

Open these URLs in your browser:

1. **Health Check:**
   ```
   http://localhost:3001/health
   ```

2. **Architecture Manifest:**
   ```
   http://localhost:3001/architecture/manifest
   ```

3. **Field Status:**
   ```
   http://localhost:3001/field/status
   ```

### Using curl (Terminal)

```bash
# Health check
curl http://localhost:3001/health

# Architecture manifest
curl http://localhost:3001/architecture/manifest

# Field status
curl http://localhost:3001/field/status
```

---

## Testing Endpoints

### 1. Score Content
```bash
curl -X POST http://localhost:3001/field/score \
  -H "Content-Type: application/json" \
  -d '{"content": "This is a test of the RBI coherence architecture."}'
```

### 2. Find Similar Items
```bash
curl -X POST http://localhost:3001/field/neighbors \
  -H "Content-Type: application/json" \
  -d '{
    "query": { "text": "Transaction: North region, Electronics" },
    "candidates": [
      { "id": "1", "text": "Transaction: North, Electronics, Corporate" },
      { "id": "2", "text": "Transaction: South, Clothing, Retail" }
    ],
    "topN": 2
  }'
```

### 3. Full Analysis
```bash
curl -X POST http://localhost:3001/field/analyze \
  -H "Content-Type: application/json" \
  -d '{"content": "Network log showing unusual activity pattern"}'
```

---

## If Server Isn't Running

### Start the Server

```bash
cd RBI-Architecture-Service
npm run dev
```

You should see:
```
🌀 RBI Architecture Service v1.1.0-service
📡 Running on http://localhost:3001
...
```

### Check if Port is in Use

```bash
# Check what's using port 3001
lsof -i :3001

# Kill process if needed
kill -9 <PID>
```

### Use Different Port

Set environment variable:
```bash
PORT=3002 npm run dev
```

---

## Common Issues

### "Cannot connect to localhost:3001"
- Make sure server is running: `npm run dev`
- Check if port is available: `lsof -i :3001`
- Try different port: `PORT=3002 npm run dev`

### "Module not found"
- Install dependencies: `npm install`
- Make sure RBI-Kernel is built: `cd ../RBI-Kernel && npm run build`

### Server starts but endpoints don't work
- Check console for errors
- Verify RBI-Kernel is accessible
- Check middleware isn't blocking requests

---

## For Tableau Demo

1. **Server is running** ✅ (you're here)
2. **Test with sample data:**
   ```bash
   curl -X POST http://localhost:3001/field/score \
     -H "Content-Type: application/json" \
     -d '{"content": "Transaction TXN001: $1250.50 on 2025-01-15 in North region, Electronics category, Corporate customer"}'
   ```
3. **See demo script:** `examples/tableau-demo.js`

---

**Your server is ready!** Access it at `http://localhost:3001`

