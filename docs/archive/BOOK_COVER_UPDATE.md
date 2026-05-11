# Book Cover Image Update

## Image File
The book cover image should be saved as: `/public/book-cover.jpeg`

**Image Details:**
- Title: "STARDUST TO SOVEREIGNTY"
- Subtitle: "BOOK ONE: THE COSMIC TAPESTRY"
- Author: "Gigi Stardust"
- Format: JPEG
- Recommended dimensions: 400x600px (or maintain aspect ratio)

## Where It's Used

### 1. Books Page (`/books`)
- Displayed in the Book One section with 3D hover effect
- Alt text: "Stardust to Sovereignty Book One: The Cosmic Tapestry by Gigi Stardust"

### 2. SEO & Social Sharing
- Open Graph image for social media sharing
- Twitter card image
- Included in JSON-LD structured data (Book schema)

### 3. Metadata
- Referenced in `layout.tsx` for OG tags
- Included in book structured data

## Next Steps

1. **Save the image file:**
   - Place the book cover image in `/public/book-cover.jpeg`
   - Ensure it's optimized (compressed but high quality)

2. **Verify display:**
   - Check books page shows the cover correctly
   - Test on mobile devices
   - Verify social sharing shows the image

3. **Optional: Add to other pages**
   - Could add to preorder page hero section
   - Could add to homepage if desired

## Current Implementation

The code is already set up to use `/book-cover.jpeg`. Just ensure the file is in the `public` folder with that exact filename.
