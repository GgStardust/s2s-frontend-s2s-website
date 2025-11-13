/**
 * orbital-preprocessor.ts
 * Purpose: Run Orbital processing before importing Markdown into Supabase.
 *
 * Placement: /scripts/orbital-preprocessor.ts
 * Called by: import-content.ts
 * Environment: Node 18+, Next.js 14 (App Router)
 *
 * Required ENV:
 *  - OPENAI_API_KEY
 *  - SUPABASE_URL
 *  - SUPABASE_SERVICE_ROLE_KEY
 *  - VERCEL_REVALIDATE_SECRET (optional, if auto-sync)
 */

import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import matter from "gray-matter";
import fs from "fs/promises";
import path from "path";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* ---------------------------------------------------------------------------
   1.  ORBITAL SYSTEM PROMPT
   ------------------------------------------------------------------------- */

const ORBITAL_SYSTEM_PROMPT = `
You are Orbital, the Codex-integrated intelligence for Stardust to Sovereignty.
Use affirmative definitions, preserve cadence, and always output full Markdown
with YAML frontmatter. Apply Orb and Undercurrent associations, snake_case tags,
and scrollstream extractions where present. Do not summarize.
`;

/* ---------------------------------------------------------------------------
   2.  PROCESS FUNCTION
   ------------------------------------------------------------------------- */

export async function processOrbitalInput(rawText: string, contentType = "observation") {
  const userPrompt = `
TASK: Convert the following content into Codex-ready Markdown with YAML.
Template: match contentType = ${contentType}.
Include orb_associations, undercurrent_links, tags, and scrollstream lines.
OUTPUT: Markdown + YAML only.
INPUT:
${rawText}
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-5-turbo",
    temperature: 0.7,
    messages: [
      { role: "system", content: ORBITAL_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const mdOutput = completion.choices[0]?.message?.content ?? "";
  return mdOutput.trim();
}

/* ---------------------------------------------------------------------------
   3.  SAVE + IMPORT PIPELINE
   ------------------------------------------------------------------------- */

export async function orbitalPreprocessAndImport(filePath: string) {
  const rawText = await fs.readFile(filePath, "utf8");

  console.log("Running Orbital preprocessing...");
  const processedMarkdown = await processOrbitalInput(rawText);

  const { data: parsed } = matter(processedMarkdown);

  // Store file to Supabase
  const { data, error } = await supabase
    .from("content_files")
    .insert({
      title: parsed.title ?? path.basename(filePath),
      type: parsed.type ?? "codex_entry",
      orb_associations: parsed.orb_associations ?? [],
      undercurrent_links: parsed.undercurrent_links ?? [],
      tags: parsed.tags ?? [],
      yaml_frontmatter: parsed,
      body: processedMarkdown,
      source_path: filePath,
    })
    .select();

  if (error) throw error;

  console.log("Saved content:", data[0].id);

  // Optional: trigger ISR revalidation on public dashboard
  if (process.env.VERCEL_REVALIDATE_SECRET) {
    await fetch(
      `https://your-site.vercel.app/api/revalidate?secret=${process.env.VERCEL_REVALIDATE_SECRET}&path=/scrollstream`
    );
  }

  return data[0];
}

/* ---------------------------------------------------------------------------
   4.  CLI USAGE (optional)
   ------------------------------------------------------------------------- */

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: ts-node orbital-preprocessor.ts <path-to-input.txt>");
    process.exit(1);
  }

  orbitalPreprocessAndImport(file)
    .then(() => console.log("✅ Orbital preprocessing complete."))
    .catch((err) => console.error(err));
}
