#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function checkContent() {
  const { data: files } = await supabase
    .from('content_files')
    .select('file_path, title, markdown_body, yaml_frontmatter')
    .like('file_path', '%02g_generated_book_content/CHAPTER_01%')
    .limit(1);
  
  if (files && files.length > 0) {
    const file = files[0];
    const yaml = file.yaml_frontmatter as any;
    console.log('File:', file.file_path);
    console.log('Title:', file.title);
    console.log('Version:', yaml?.version);
    console.log('Markdown body length:', file.markdown_body?.length || 0);
    console.log('First 200 chars:', file.markdown_body?.substring(0, 200) || 'EMPTY');
  } else {
    console.log('No file found');
  }
}

checkContent();

