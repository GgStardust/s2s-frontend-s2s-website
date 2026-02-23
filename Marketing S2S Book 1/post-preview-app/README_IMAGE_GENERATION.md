# Image Generation for Buffer Bulk Upload

**Fully automated workflow** - One command generates everything you need for Buffer.

## Quick Start (3 Steps)

1. **Install dependencies** (one-time):
   ```bash
   npm install
   ```

2. **Generate everything** (images + CSV + notes):
   ```bash
   npm run generate-images
   ```

3. **Upload & Import**:
   - Upload images from `generated-images/` to your hosting service
   - Add image URLs to `buffer-import.csv`
   - Import CSV into Buffer

That's it! ✅

## What Gets Generated Automatically

### 1. **Instagram-Ready Images** (1080x1350 PNG - 4:5 ratio)
- All posts rendered as high-quality images
- Saved to `generated-images/` directory
- Includes trademark symbols (™) and proper formatting

### 2. **Buffer CSV** (`buffer-import.csv`)
- Post text (with ™ symbols and formatting)
- Image URLs (empty - you add after uploading)
- **Auto-generated hashtags** (5 per post, optimized for discovery)
- Calculated posting times (Mon/Wed/Fri at 10 AM)

### 3. **Publishing Notes** (`PUBLISHING_NOTES.md`)
- Complete checklist for Buffer import
- Post-by-post details
- Hashtag strategy explanation
- Trademark usage guidelines

## Automatic Features

### ✅ Trademark Protection
- **"Stardust to Sovereignty™"** added on first use in every post
- **Orb names** (e.g., "Origin Intelligence™") in Orb posts
- **Book title** formatted with italics: *Book One: The Cosmic Tapestry*

### ✅ Smart Hashtag Generation
Every post automatically includes 5 hashtags:
- `#stardusttosovereignty` (always)
- `#consciousnessarchitecture` (always)
- 3 content-specific tags based on post type:
  - Gateway: `#structuralcoherence`, `#patternrecognition`
  - Scrollstream: `#sovereignfield`, `#consciousnesstechnology`
  - Definition: `#structuralcoherence`, `#consciousnesstechnology`
  - Excerpt: `#bookone`, `#thecosmictapestry`
  - Orb: `#orbsystem`, `#consciousnesstechnology`

**Strategy**: Discovery-focused, not trend-following. Avoids spiritual/wellness hashtags.

### ✅ Posting Schedule
- **Monday**: Gateway posts
- **Wednesday**: Scrollstream posts
- **Friday**: Definition/Excerpt/Orb posts
- **Time**: 10:00 AM (adjustable in CSV)
- **Launch**: February 28, 2026

## Complete Workflow

```bash
# Step 1: Generate posts (if not already done)
npm run generate-posts

# Step 2: Generate images + CSV + notes
npm run generate-images

# Step 3: Upload images to hosting service
# (Cloudinary, S3, etc.)

# Step 4: Update CSV with image URLs
# Open buffer-import.csv and add URLs to "Image URL" column

# Step 5: Import to Buffer
# Use Buffer's bulk upload feature
```

## Image Quality

- **Resolution**: 1080x1350 (Instagram 4:5 portrait format - preferred ratio)
- **Aspect Ratio**: 4:5 (portrait)
- **Quality**: 2x device scale (2160x2700 rendered, saved at 1080x1350)
- **Format**: PNG (maximum quality)
- **Ready for**: Direct Instagram upload

## Troubleshooting

**Images not generating?**
- Make sure Puppeteer installed: `npm install`
- Check that `data/all-posts.json` exists (run `npm run generate-posts` first)

**CSV format issues?**
- Buffer requires specific format - the script generates it correctly
- Make sure image URLs are full URLs (https://...)

**Hashtags not showing?**
- Hashtags are in the "Tags" column of the CSV
- Buffer will add them to your posts automatically

## Notes

- All trademark symbols (™) are added automatically
- Hashtags are optimized for follower growth while maintaining brand integrity
- Posting times can be adjusted in the CSV before importing
- Publishing notes include complete checklist and guidelines
