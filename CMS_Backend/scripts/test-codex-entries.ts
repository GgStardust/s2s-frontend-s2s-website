import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testCodexEntries() {
  console.log('Testing Codex Entries API readiness...\n');

  // Test 1: Check if content_files table exists
  console.log('1. Checking content_files table...');
  const { error: tableError } = await supabase.from('content_files').select('id').limit(1);
  if (tableError) {
    console.log('   ❌ Table check failed:', tableError.message);
    return;
  }
  console.log('   ✅ Table exists');

  // Test 2: Check total content_files count
  console.log('\n2. Checking total content_files...');
  const { count: totalCount, error: countError } = await supabase
    .from('content_files')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.log('   ❌ Count failed:', countError.message);
  } else {
    console.log(`   ✅ Total files: ${totalCount || 0}`);
  }

  // Test 3: Check codex-ready entries
  console.log('\n3. Checking codex-ready entries...');
  const { data: codexReady, error: codexError, count: codexCount } = await supabase
    .from('content_files')
    .select('*', { count: 'exact' })
    .eq('console_ready', true)
    .eq('visibility', 'codex');
  
  if (codexError) {
    console.log('   ❌ Query failed:', codexError.message);
  } else {
    console.log(`   ✅ Codex-ready entries: ${codexCount || 0}`);
    
    if (codexCount && codexCount > 0) {
      console.log('\n   Sample entries:');
      codexReady?.slice(0, 5).forEach((entry: any, i: number) => {
        console.log(`   ${i + 1}. ${entry.title || 'Untitled'}`);
        console.log(`      - ID: ${entry.id}`);
        console.log(`      - Type: ${entry.content_type || 'N/A'}`);
        console.log(`      - Category: ${entry.codex_category || 'N/A'}`);
        console.log(`      - Orbs: ${Array.isArray(entry.orb_associations) ? entry.orb_associations.join(', ') : 'N/A'}`);
        console.log(`      - Created: ${entry.created_at || 'N/A'}`);
      });
    } else {
      console.log('   ⚠️  No codex-ready entries found');
      console.log('   💡 Need to mark entries with console_ready=true and visibility=\'codex\'');
    }
  }

  // Test 4: Check by content_type
  console.log('\n4. Checking by content_type...');
  const { data: byType, error: typeError } = await supabase
    .from('content_files')
    .select('content_type', { count: 'exact' })
    .not('content_type', 'is', null);
  
  if (typeError) {
    console.log('   ❌ Query failed:', typeError.message);
  } else {
    const typeCounts: Record<string, number> = {};
    byType?.forEach((entry: any) => {
      const type = entry.content_type || 'unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    console.log('   ✅ Content types:');
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`      - ${type}: ${count}`);
    });
  }

  // Test 5: Test the actual API endpoint structure
  console.log('\n5. Testing API endpoint structure...');
  const { data: apiTest, error: apiError } = await supabase
    .from('content_files')
    .select('id, title, content_type, codex_category, orb_associations, console_ready, visibility, created_at')
    .eq('console_ready', true)
    .eq('visibility', 'codex')
    .order('created_at', { ascending: false })
    .limit(3);
  
  if (apiError) {
    console.log('   ❌ API test failed:', apiError.message);
  } else {
    console.log(`   ✅ API structure test: ${apiTest?.length || 0} entries returned`);
    if (apiTest && apiTest.length > 0) {
      console.log('   ✅ Sample entry structure:');
      console.log(JSON.stringify(apiTest[0], null, 2));
    }
  }

  console.log('\n' + '='.repeat(50));
  if (codexCount && codexCount > 0) {
    console.log('✅ Supabase is READY for Codex entries');
    console.log(`   ${codexCount} entries available`);
  } else {
    console.log('⚠️  Supabase has NO codex-ready entries');
    console.log('   Options:');
    console.log('   1. Mark existing entries as codex-ready');
    console.log('   2. Use file-based fallback (read markdown files directly)');
  }
}

testCodexEntries().catch(console.error);
