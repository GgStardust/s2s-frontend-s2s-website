# **CONTENT FLOW ARCHITECTURE**
## **Frontend ↔ Backend ↔ Database - Orbital's Spec**

**Created:** October 6, 2025

---

## **QUICK ANSWER**

**In Orbital's brief, content flows like this:**

```
SOURCE OF TRUTH:
/09_PROCESSED/ (86+ markdown files with YAML frontmatter)
        ↓
    SUPABASE DATABASE
    (content_files table with embeddings)
        ↓
    ┌─────────┴─────────┐
    ↓                   ↓
BACKEND CMS         PUBLIC FRONTEND
(/creator/*)         (/, /orb/*, /library/*)
    ↓                   ↓
WRITES/EDITS        READS ONLY
CONTENT             CONTENT
```

**Key Points:**
1. ✅ **Same database** - Both frontend and backend read from Supabase
2. ✅ **Backend writes** - You create/edit content in `/creator/*`
3. ✅ **Frontend reads** - Public dashboard queries via API routes
4. ✅ **Completely separate** - Different UI, different routes, same data

---

## **DETAILED ARCHITECTURE**

### **Layer 1: Source Files (09_PROCESSED/)**

```
09_PROCESSED/
├── 02d_Orb_Essays/
│   ├── orb_1_origin_intelligence.md
│   ├── orb_7_alchemical_current_foundational.md
│   └── ... (13 total)
├── 02e_scrolls/
│   ├── scroll_3_made_it_blissed_out.md
│   └── ... (40+ scrolls)
├── existential_architecture.md
├── star_love_living_constellation.md
└── ... (86+ total files)
```

**Each file has YAML frontmatter:**
```yaml
---
title: "Orb 7: Alchemical Current"
author: "Gigi Stardust"
type: "orb_essay"
status: "public"  # or "member" or "premium" or "hold"
orb_associations:
  - "Orb 7: Alchemical Current"
tags:
  - "@alchemy"
  - "@transformation"
  - "@scrollstream"
---

Content here...
**@scrollstream** "Density becomes light through compression"
```

---

### **Layer 2: Supabase Database**

**Orbital's Spec Says:**
> "Source of Truth: /content/codex/ (from 09_PROCESSED)"

**This means:**

```sql
-- content_files table (main storage)
CREATE TABLE content_files (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  author TEXT,
  type TEXT,  -- 'orb_essay', 'scroll', 'essay', etc.
  status TEXT,  -- 'public', 'member', 'premium', 'hold'
  content TEXT,  -- Full markdown content
  excerpt TEXT,
  orb_associations JSONB,  -- [1,2,5,12]
  tags JSONB,  -- ["@alchemy", "@transformation"]
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  embedding VECTOR(1536)  -- OpenAI embeddings for AI search
);

-- scrollstream_fragments table (extracted scrolls)
CREATE TABLE scrollstream_fragments (
  id UUID PRIMARY KEY,
  text TEXT,
  source_file_id UUID REFERENCES content_files(id),
  orb_associations JSONB,
  tags JSONB,
  created_at TIMESTAMP
);
```

**How it gets populated:**
1. **Initial import:** Run script to parse all 09_PROCESSED files → insert into Supabase
2. **Ongoing:** Backend CMS writes new content → saves to Supabase
3. **AI embeddings:** OpenAI API generates vectors → stored in `embedding` column

---

### **Layer 3: Backend CMS (/creator/*)**

**Purpose:** Content management (desktop only)

**Routes:**
```
/creator/library          → View all 86+ files
/creator/library/new      → Create new content
/creator/library/[id]/edit → Edit existing content
/creator/scrollstreams    → Manage scrolls
/creator/book-compiler    → Compile books
/creator/orbital          → Orb management
```

**How it works:**

```typescript
// Backend WRITES to Supabase
// app/creator/library/new/page.tsx

import { createClient } from '@/lib/supabase/server';

async function handleSaveContent(formData) {
  const supabase = createClient();

  // Insert new content
  const { data, error } = await supabase
    .from('content_files')
    .insert({
      slug: generateSlug(formData.title),
      title: formData.title,
      type: formData.type,
      status: formData.status,  // 'public' or 'member' or 'premium'
      content: formData.markdown,
      orb_associations: formData.orbs,  // [1, 7, 12]
      tags: formData.tags,
      embedding: await generateEmbedding(formData.content)
    });

  // Also extract scrollstreams if tagged
  if (formData.content.includes('**@scrollstream**')) {
    await extractAndSaveScrollstreams(data.id, formData.content);
  }
}
```

**User Experience:**
1. You log into `/creator/library`
2. Click "Create New"
3. Write markdown content with YAML tags
4. Click "Publish"
5. Saves to Supabase → immediately available on public frontend

---

### **Layer 4: Content API (/api/content/***)**

**Orbital's Spec:**
> "/api/content/byOrb?orb=5 → essays + scrolls tagged @orb5"
> "/api/content/scrollstream → list of scroll fragments"
> "/api/content/library → surfaced Codex files with metadata"

**These API routes act as the bridge:**

```typescript
// app/api/content/byOrb/route.ts
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orbNumber = searchParams.get('orb');

  const supabase = createClient();

  // Query Supabase for content tagged with this Orb
  const { data, error } = await supabase
    .from('content_files')
    .select('*')
    .contains('orb_associations', [parseInt(orbNumber)])
    .eq('status', 'public')  // Only public content
    .order('created_at', { ascending: false });

  return Response.json(data);
}
```

```typescript
// app/api/content/scrollstream/route.ts
export async function GET(request: Request) {
  const supabase = createClient();

  const { data } = await supabase
    .from('scrollstream_fragments')
    .select(`
      *,
      source_file:content_files(title, slug)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  return Response.json(data);
}
```

```typescript
// app/api/content/library/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userTier = searchParams.get('tier') || 'visitor';  // from auth

  const supabase = createClient();

  // Filter by user's access tier
  const statusFilter = userTier === 'architect'
    ? ['public', 'member', 'premium']
    : userTier === 'member'
    ? ['public', 'member']
    : ['public'];

  const { data } = await supabase
    .from('content_files')
    .select('id, slug, title, excerpt, orb_associations, tags, type')
    .in('status', statusFilter)
    .order('created_at', { ascending: false });

  return Response.json(data);
}
```

---

### **Layer 5: Public Frontend (/, /orb/*, /library/*)**

**Purpose:** Display content to public (mobile + desktop)

**How it reads content:**

```typescript
// app/orb/[slug]/page.tsx - Orb Portal Page

import { createClient } from '@/lib/supabase/client';

export default async function OrbPortalPage({ params }) {
  const orbSlug = params.slug;  // e.g., "orb-7-alchemical-current"

  // Fetch Orb essay from Supabase
  const supabase = createClient();
  const { data: orbEssay } = await supabase
    .from('content_files')
    .select('*')
    .eq('slug', orbSlug)
    .eq('type', 'orb_essay')
    .single();

  // Fetch related scrolls
  const orbNumber = extractOrbNumber(orbSlug);  // 7
  const { data: relatedScrolls } = await supabase
    .from('scrollstream_fragments')
    .select('*')
    .contains('orb_associations', [orbNumber])
    .limit(5);

  return (
    <div>
      <h1>{orbEssay.title}</h1>
      {/* Render markdown verbatim */}
      <ReactMarkdown>{orbEssay.content}</ReactMarkdown>

      <div>
        <h3>Related Scrolls</h3>
        {relatedScrolls.map(scroll => (
          <ScrollCard key={scroll.id} {...scroll} />
        ))}
      </div>

      {/* AI Companion */}
      <AICompanion orbNumber={orbNumber} />
    </div>
  );
}
```

```typescript
// app/library/page.tsx - Sovereign Archive

export default async function LibraryPage() {
  // Fetch from API (which checks user tier)
  const response = await fetch('/api/content/library?tier=public');
  const files = await response.json();

  return (
    <div>
      <h1>Sovereign Archive</h1>
      {files.map(file => (
        <Link key={file.id} href={`/library/${file.slug}`}>
          <h3>{file.title}</h3>
          <p>{file.excerpt}</p>
          <div>
            {file.orb_associations.map(orb => (
              <OrbBadge key={orb} number={orb} />
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
```

```typescript
// app/scrollstream/page.tsx - Scrollstream Feed

export default async function ScrollstreamPage() {
  const response = await fetch('/api/content/scrollstream');
  const scrolls = await response.json();

  return (
    <div>
      <h1>Scrollstream</h1>
      {scrolls.map(scroll => (
        <ScrollCard
          key={scroll.id}
          text={scroll.text}
          sourceFile={scroll.source_file}
          orbs={scroll.orb_associations}
        />
      ))}
    </div>
  );
}
```

---

## **KEY SEPARATION PRINCIPLES**

### **1. Backend CMS (Creator Mode):**
```
Route: /creator/*
Access: Gigi only (authenticated)
Purpose: Content management
Actions: CREATE, READ, UPDATE, DELETE
UI: Desktop-optimized, functional, minimal
Database: WRITES to Supabase
```

### **2. Public Frontend:**
```
Route: /, /orb/*, /library/*, /scrollstream
Access: Public (with tier-based gating)
Purpose: Content display
Actions: READ ONLY
UI: Mobile-first, beautiful, minimal
Database: READS from Supabase via API
```

### **3. Shared Database (Supabase):**
```
Tables: content_files, scrollstream_fragments, users, subscriptions
Both frontend and backend connect to same database
Backend WRITES, Frontend READS
pgvector for AI embeddings (shared by both)
```

---

## **CONTENT VISIBILITY & ACCESS TIERS**

**Orbital's Spec:**
> "Tier | Label | Price | Access"
> "Visitor | Field Visitor | Free | Public modules"
> "Member | Field Member | $37/mo | Relational + extended"
> "Architect Circle | $97/mo | Premium + consulting"

**How it works:**

```typescript
// Middleware or API route checks user tier
async function getAccessibleContent(userId: string) {
  const { data: user } = await supabase
    .from('users')
    .select('tier')
    .eq('id', userId)
    .single();

  const tier = user.tier;  // 'visitor', 'member', 'architect'

  // Query content based on tier
  const statusFilter = {
    visitor: ['public'],
    member: ['public', 'member'],
    architect: ['public', 'member', 'premium']
  }[tier];

  const { data } = await supabase
    .from('content_files')
    .select('*')
    .in('status', statusFilter);

  return data;
}
```

**In Codex files (09_PROCESSED):**
```yaml
---
status: "public"    # Everyone can see
status: "member"    # $37/mo tier only
status: "premium"   # $97/mo tier only
status: "hold"      # Not published yet (backend only)
---
```

---

## **AI COMPANION INTEGRATION**

**Orbital's Spec:**
> "AI Companion: Active at launch"
> "Embedded GPT-4 endpoint with Supabase pgvector embeddings per Orb"

**How it works:**

```typescript
// app/api/ai/ask-orb/route.ts

import { OpenAI } from 'openai';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { orbNumber, question, userId } = await request.json();

  const supabase = createClient();
  const openai = new OpenAI();

  // 1. Generate embedding for user's question
  const questionEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question
  });

  // 2. Search Supabase for relevant content (pgvector similarity search)
  const { data: relevantContent } = await supabase.rpc(
    'match_codex_content',
    {
      query_embedding: questionEmbedding.data[0].embedding,
      match_threshold: 0.78,
      match_count: 5,
      orb_filter: orbNumber  // Only content tagged with this Orb
    }
  );

  // 3. Build context from relevant content
  const context = relevantContent
    .map(c => `${c.title}:\n${c.content}`)
    .join('\n\n---\n\n');

  // 4. Get Orb personality from synthesis
  const { data: orbEssay } = await supabase
    .from('content_files')
    .select('content')
    .eq('type', 'orb_essay')
    .contains('orb_associations', [orbNumber])
    .single();

  // 5. Call GPT-4 with Orb personality + context
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are Orb ${orbNumber} from the Stardust to Sovereignty system.

Your personality and voice:
${orbEssay.content.slice(0, 2000)}

Respond to questions using:
- Affirmative definitions (not "it's not X", say "it IS Y")
- Layered meaning and cadence from the Codex
- Reference specific scrolls or essays when relevant

Relevant Codex content for this question:
${context}

Reply in Orb ${orbNumber}'s voice.`
      },
      {
        role: 'user',
        content: question
      }
    ]
  });

  return Response.json({
    answer: response.choices[0].message.content,
    sources: relevantContent.map(c => ({ title: c.title, slug: c.slug }))
  });
}
```

**Frontend usage:**
```typescript
// components/AICompanion.tsx

export function AICompanion({ orbNumber }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  async function handleAsk() {
    const response = await fetch('/api/ai/ask-orb', {
      method: 'POST',
      body: JSON.stringify({ orbNumber, question, userId })
    });

    const data = await response.json();
    setAnswer(data.answer);
  }

  return (
    <div>
      <h3>Ask the Field</h3>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask Orb {orbNumber}..."
      />
      <button onClick={handleAsk}>Ask</button>

      {answer && (
        <div>
          <p>{answer}</p>
          <div>
            Sources: {data.sources.map(s => (
              <Link key={s.slug} href={`/library/${s.slug}`}>
                {s.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## **SUMMARY - THE COMPLETE FLOW**

### **Content Creation (Backend):**
```
1. You write content in /creator/library/new
2. Add YAML frontmatter (Orbs, tags, status)
3. AI analysis suggests tags/scrolls
4. Click "Publish"
5. Saves to Supabase → generates embeddings
6. Immediately available on public frontend
```

### **Content Display (Frontend):**
```
1. User visits / (landing)
2. Clicks Orb 7
3. /orb/orb-7-alchemical-current page loads
4. Fetches Orb essay from Supabase
5. Fetches related scrolls
6. Renders markdown verbatim
7. AI Companion ready to answer questions
```

### **Data Flow:**
```
09_PROCESSED/ (source files)
     ↓
Supabase (database + embeddings)
     ↓
/api/content/* (API layer)
     ↓
Public pages (read-only display)

Backend CMS writes to same Supabase
```

---

## **YOUR QUESTION ANSWERED**

**"How is content and information handled between front and back end?"**

**Answer:**

1. **Shared Database:** Both use same Supabase database
2. **Backend Writes:** `/creator/*` creates/edits content
3. **Frontend Reads:** `/*` queries content via API routes
4. **API Layer:** `/api/content/*` bridges the two
5. **Access Control:** User tier determines what content is visible
6. **AI Integration:** Shared embeddings for semantic search
7. **Complete Separation:** Different routes, different UI, same data

**It's a clean separation** - backend is your private content studio, frontend is the public stage. Both read the same script (Supabase database), but only backend can edit it.

---

**Status:** This is Orbital's architecture
**Next:** Rebuild public frontend to implement this flow
