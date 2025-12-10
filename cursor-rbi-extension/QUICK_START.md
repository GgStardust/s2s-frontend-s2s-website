# Quick Start Guide

## For Non-Developers

### Step 1: Build RBI-Kernel (One Time Setup)

Open a terminal in Cursor and run:

```bash
cd ../RBI-Kernel
npm install
npm run build
```

This creates the files the extension needs.

### Step 2: Install Extension Dependencies

```bash
cd ../cursor-rbi-extension
npm install
```

### Step 3: Compile the Extension

```bash
npm run compile
```

### Step 4: Test the Extension

1. Press `F5` in Cursor (or click "Run Extension" in the debug panel)
2. A new Cursor window will open (Extension Development Host)
3. In that new window, open any workspace/folder
4. Look at the bottom-right status bar - you should see "RBI: XX%"
5. Click it to open the dashboard

### Step 5: Use the Extension

- **Status Bar**: Shows your project's coherence score (bottom-right)
- **Dashboard**: Click status bar or use command "RBI: Show Dashboard"
- **Commands**: 
  - `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
  - Type "RBI" to see all commands

## What You'll See

1. **Status Bar Indicator**: Shows coherence percentage
   - Green/High = Good coherence (80%+)
   - Yellow/Medium = Moderate coherence (60-80%)
   - Red/Low = Low coherence (<60%)

2. **Dashboard**: Shows:
   - Overall project coherence
   - Files analyzed
   - Files with low coherence
   - Issues and warnings

## Troubleshooting

**"RBI-Kernel not found"**
- Make sure you ran `npm run build` in RBI-Kernel directory
- Check that `RBI-Kernel/dist` folder exists

**Extension not showing in status bar**
- Check Output panel (View → Output → Select "RBI Coherence Extension")
- Look for error messages
- Make sure you compiled: `npm run compile`

**Nothing happens when I open a file**
- The extension analyzes files automatically on save
- Use command "RBI: Analyze Workspace" to analyze all files
- Check settings: `rbi.enabled` should be `true`

## Next Steps

Once it's working:
1. The extension will automatically monitor your code
2. Files are analyzed when you save them
3. Check the dashboard regularly to see project health
4. Fix files with low coherence scores

## Need Help?

Check the main README.md for detailed documentation.
