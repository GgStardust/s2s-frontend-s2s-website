# Content Consolidation Guide

This guide explains how to use the consolidated content system to reduce duplication across pages.

## Structure

### 1. `/lib/content.ts` - Central Content Constants
All shared text, quotes, and messaging is defined here. This is the single source of truth.

**Key Exports:**
- `QUOTES` - All manuscript quotes and key phrases
- `BOOK_DESCRIPTIONS` - Book descriptions (short, full, withSystem variants)
- `PRESALE_INFO` - Presale announcements and shipping dates
- `CONSOLE_INFO` - Console access messaging
- `SELF_PUBLISHING` - Self-publishing explanations
- `BUTTON_LABELS` - Standard button text
- `SECTION_HEADINGS` - Common section headings

### 2. Reusable Components

#### `PresaleBanner`
Displays the presale announcement banner.

```tsx
import PresaleBanner from '@/components/PresaleBanner';

// Full announcement
<PresaleBanner variant="full" />

// Short announcement
<PresaleBanner variant="short" />
```

#### `ParadigmSection`
The "Paradigm" section that appears on multiple pages.

```tsx
import ParadigmSection from '@/components/ParadigmSection';

// Full version (homepage)
<ParadigmSection variant="full" />

// Compact version (about page)
<ParadigmSection variant="compact" />
```

#### `BookDescription`
Standardized book description with optional buttons.

```tsx
import BookDescription from '@/components/BookDescription';

// Basic description
<BookDescription />

// With "full system" wording
<BookDescription variant="withSystem" />

// With action buttons
<BookDescription showButtons={true} />
```

#### `ManuscriptQuote`
Consistent quote formatting with source attribution.

```tsx
import ManuscriptQuote from '@/components/ManuscriptQuote';

<ManuscriptQuote 
  quote="bodyListens" 
  source="Chapter 2: The Body as Advanced Biological Technology"
  variant="default"
/>

<ManuscriptQuote 
  quote="consciousnessSpeaksToMatter" 
  variant="highlight"
/>
```

## Migration Strategy

### Phase 1: Use Content Constants Directly
Replace hardcoded strings with imports from `lib/content.ts`:

**Before:**
```tsx
<p>Ships February 28, 2026</p>
```

**After:**
```tsx
import { PRESALE_INFO } from '@/lib/content';

<p>Ships {PRESALE_INFO.shipDate}</p>
```

### Phase 2: Replace Sections with Components
Replace entire repeated sections with reusable components:

**Before:**
```tsx
<section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
  <div className="terminator-border">
    <div className="p-8 bg-cosmic-blue rounded-lg">
      <h2>The Paradigm</h2>
      <p>A system reveals itself...</p>
    </div>
  </div>
</section>
```

**After:**
```tsx
import ParadigmSection from '@/components/ParadigmSection';

<ParadigmSection variant="full" />
```

## Benefits

1. **Single Source of Truth**: Update content in one place, it updates everywhere
2. **Type Safety**: TypeScript ensures you're using valid quote keys
3. **Consistency**: Guaranteed consistent wording across pages
4. **Maintainability**: Easier to update shipping dates, announcements, etc.
5. **Flexibility**: Components support variants for page-specific needs

## Next Steps

1. Gradually migrate pages to use these components
2. Add more shared content to `lib/content.ts` as patterns emerge
3. Create additional components for other repeated sections (e.g., "What Book One Contains")

