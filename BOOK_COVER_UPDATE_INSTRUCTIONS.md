# Book Cover Update Instructions

## Current Location
The book cover image is located at: `public/book-cover.jpeg`

## To Update the Book Cover

1. **Prepare your new image:**
   - Format: JPEG (.jpeg or .jpg)
   - Recommended dimensions: 400x600 pixels (or 2:3 aspect ratio)
   - File size: Keep under 500KB for web performance

2. **Replace the file:**
   - Navigate to: `/Users/gigi/Projects/S2S_RBI_System/s2s-frontend/s2s-website/public/`
   - Replace `book-cover.jpeg` with your new image
   - Keep the same filename: `book-cover.jpeg`

3. **Commit and push:**
   ```bash
   cd /Users/gigi/Projects/S2S_RBI_System/s2s-frontend/s2s-website
   git add public/book-cover.jpeg
   git commit -m "Update book cover image"
   git push origin main
   ```

4. **Vercel will automatically redeploy** with the new image

## Image Usage

The book cover is used in:
- `/app/books/page.tsx` - Books listing page
- `/app/layout.tsx` - Open Graph metadata for social sharing
- Any other pages that reference `/book-cover.jpeg`

## Notes

- The image is optimized by Next.js automatically
- If you need a different filename, update the references in:
  - `app/books/page.tsx` (Image src)
  - `app/layout.tsx` (Open Graph metadata)
