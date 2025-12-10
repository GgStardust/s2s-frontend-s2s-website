# Testing Instructions - Step 4

## ✅ Steps 1-3 Complete!

- ✅ **Step 1**: RBI-Kernel built successfully
- ✅ **Step 2**: Extension dependencies installed
- ✅ **Step 3**: Extension compiled successfully

## Step 4: Test the Extension

### Option 1: Run in Development Mode (Recommended)

1. **Open the extension folder in Cursor:**
   - File → Open Folder
   - Navigate to: `/Users/gigi/Projects/S2S_RBI_System/cursor-rbi-extension`

2. **Start debugging:**
   - Press `F5` (or `Fn+F5` on some Macs)
   - OR click the "Run and Debug" icon in the sidebar
   - OR go to Run → Start Debugging
   - Select "Run Extension" from the dropdown

3. **A new Cursor window will open** (Extension Development Host)

4. **In the new window:**
   - Open any workspace/folder (File → Open Folder)
   - Or open an existing project

5. **Look for the extension:**
   - Check the **status bar** (bottom-right corner)
   - You should see: `RBI: XX%` or `RBI: Analyzing...`
   - Click it to open the dashboard

### Option 2: Install as VSIX Package

1. **Package the extension:**
   ```bash
   cd /Users/gigi/Projects/S2S_RBI_System/cursor-rbi-extension
   npm run package
   ```

2. **Install the .vsix file:**
   - In Cursor, go to Extensions
   - Click the "..." menu (top-right)
   - Select "Install from VSIX..."
   - Choose the `.vsix` file from `cursor-rbi-extension/` folder

## What to Look For

### ✅ Success Indicators:

1. **Status Bar Indicator:**
   - Bottom-right corner shows `RBI: XX%`
   - Color changes based on coherence:
     - Green/High = 80%+ coherence
     - Yellow/Medium = 60-80% coherence  
     - Red/Low = <60% coherence

2. **Dashboard:**
   - Click status bar or use command `RBI: Show Dashboard`
   - Should show:
     - Overall coherence percentage
     - Number of files analyzed
     - Files with low coherence
     - Issues and warnings

3. **Commands Work:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "RBI"
   - Should see:
     - "RBI: Show Dashboard"
     - "RBI: Analyze Workspace"
     - "RBI: Refresh"

### ⚠️ Troubleshooting:

**Extension not showing in status bar:**
- Check Output panel: View → Output → Select "RBI Coherence Extension"
- Look for error messages
- Make sure you opened a workspace/folder in the Extension Development Host

**"RBI-Kernel not found" error:**
- Verify RBI-Kernel is built: `ls /Users/gigi/Projects/S2S_RBI_System/RBI-Kernel/dist`
- Check settings: `rbi.rbiKernelPath` should point to RBI-Kernel
- Default should work if RBI-Kernel is at `../RBI-Kernel` relative to extension

**Nothing happens when saving files:**
- Files are analyzed on save (with 1 second delay by default)
- Use command "RBI: Analyze Workspace" to analyze all files immediately
- Check that `rbi.enabled` is `true` in settings

**TypeScript/Compilation errors:**
- Make sure you ran `npm run compile` successfully
- Check that all dependencies are installed: `npm install`

## Next Steps After Testing

Once you confirm it's working:
1. The extension will automatically monitor your code
2. Files are analyzed when you save them
3. Check the dashboard regularly for project health
4. Fix files with low coherence scores

## Need Help?

- Check the main `README.md` for detailed documentation
- Check `SETUP.md` for setup troubleshooting
- Check Output panel for error messages



