# GitHub Authentication Guide

**Repository:** `https://github.com/GgStardust/rbi-kernel.git`

---

## Authentication Methods

### Method 1: Personal Access Token (Recommended)

**Step 1: Create a Personal Access Token**

1. Go to GitHub: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "RBI-Kernel Push Access"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

**Step 2: Use Token to Push**

When pushing, use the token as your password:

```bash
cd RBI-Kernel
git push origin v1.0.0
# Username: GgStardust
# Password: [paste your personal access token]
```

**Step 3: Store Credentials (Optional)**

To avoid entering credentials each time:

```bash
# macOS Keychain (recommended for macOS)
git config --global credential.helper osxkeychain

# Or use Git Credential Manager
git config --global credential.helper manager
```

After first push with token, it will be stored securely.

---

### Method 2: SSH Key Authentication

**Step 1: Check for Existing SSH Key**

```bash
ls -la ~/.ssh/id_*.pub
```

**Step 2: Generate SSH Key (if needed)**

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location
# Enter passphrase (optional but recommended)
```

**Step 3: Add SSH Key to GitHub**

1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy the output
   ```

2. Go to GitHub: https://github.com/settings/keys
3. Click "New SSH key"
4. Paste your public key
5. Click "Add SSH key"

**Step 4: Change Remote URL to SSH**

```bash
cd RBI-Kernel
git remote set-url origin git@github.com:GgStardust/rbi-kernel.git
```

**Step 5: Test Connection**

```bash
ssh -T git@github.com
# Should see: "Hi GgStardust! You've successfully authenticated..."
```

**Step 6: Push**

```bash
git push origin v1.0.0
# No password needed with SSH!
```

---

### Method 3: GitHub CLI (gh)

**Step 1: Install GitHub CLI**

```bash
# macOS
brew install gh

# Or download from: https://cli.github.com/
```

**Step 2: Authenticate**

```bash
gh auth login
# Follow the prompts:
# - GitHub.com
# - HTTPS (or SSH)
# - Authenticate Git with your GitHub credentials
# - Login with a web browser
```

**Step 3: Push**

```bash
cd RBI-Kernel
git push origin v1.0.0
# Authentication handled by gh CLI
```

---

## Quick Start (Easiest Method)

### Using Personal Access Token

1. **Create token:** https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Check `repo` scope
   - Copy token

2. **Push with token:**
   ```bash
   cd RBI-Kernel
   git push origin v1.0.0
   ```
   - Username: `GgStardust`
   - Password: `[paste your token]`

3. **Store credentials (one-time setup):**
   ```bash
   git config --global credential.helper osxkeychain
   ```

---

## Troubleshooting

### "Permission Denied" Error

**Problem:** Authentication failed

**Solutions:**
1. Verify token has `repo` scope
2. Check username is correct: `GgStardust`
3. Try using SSH instead of HTTPS
4. Regenerate token if expired

### "Repository Not Found" Error

**Problem:** Repository doesn't exist or you don't have access

**Solutions:**
1. Verify repository exists: https://github.com/GgStardust/rbi-kernel
2. Check you have push access
3. Verify remote URL: `git remote -v`

### "Tag Already Exists" Error

**Problem:** Tag v1.0.0 already exists on remote

**Solutions:**
1. Check remote tags: `git ls-remote --tags origin`
2. Delete remote tag (if needed): `git push origin --delete v1.0.0`
3. Re-push: `git push origin v1.0.0`

### Credentials Not Stored

**Problem:** Have to enter credentials every time

**Solutions:**
```bash
# macOS
git config --global credential.helper osxkeychain

# Linux
git config --global credential.helper store

# Windows
git config --global credential.helper wincred
```

---

## Security Best Practices

1. **Use Personal Access Tokens** instead of passwords
2. **Set token expiration** (30-90 days recommended)
3. **Use minimal scopes** (only `repo` for this use case)
4. **Store credentials securely** (use credential helper)
5. **Rotate tokens regularly**
6. **Never commit tokens** to repository

---

## Verification

After successful push, verify:

```bash
# Check remote tags
git ls-remote --tags origin

# Should see: v1.0.0
```

Or check on GitHub:
- Go to: https://github.com/GgStardust/rbi-kernel/tags
- Should see `v1.0.0` tag listed

---

## Next Steps After Authentication

Once authenticated, you can:

1. **Push the tag:**
   ```bash
   git push origin v1.0.0
   ```

2. **Push all tags:**
   ```bash
   git push --tags
   ```

3. **Push commits (if any):**
   ```bash
   git push origin main
   # or
   git push origin master
   ```

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-11

