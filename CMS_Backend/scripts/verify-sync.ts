#!/usr/bin/env tsx

/**
 * Verify V4 content sync status
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifySync() {
  console.log('🔍 Verifying V4 content sync...\n');
  
  // Check for V4-editorial files
  const { data: v4Files, error } = await supabase
    .from('content_files')
    .select('file_path, title, yaml_frontmatter')
    .like('file_path', '%02g_generated_book_content%')
    .limit(50);
  
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  console.log(`📊 Found ${v4Files?.length || 0} files from 02g_generated_book_content\n`);
  
  // Check for V4-editorial version
  const v4Updated = v4Files?.filter(f => {
    const yaml = f.yaml_frontmatter as any;
    return yaml?.version === 'V4-editorial';
  }) || [];
  
  console.log(`✅ V4-editorial files: ${v4Updated.length}`);
  console.log(`⚠️  Other versions: ${(v4Files?.length || 0) - v4Updated.length}\n`);
  
  if (v4Updated.length > 0) {
    console.log('📝 V4-editorial files:\n');
    v4Updated.slice(0, 10).forEach(f => {
      console.log(`   ✅ ${f.file_path}`);
    });
    if (v4Updated.length > 10) {
      console.log(`   ... and ${v4Updated.length - 10} more\n`);
    }
  } else {
    console.log('⚠️  No V4-editorial files found. Sync may have failed.\n');
  }
}

verifySync();

