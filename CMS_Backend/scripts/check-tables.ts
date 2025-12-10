import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTables() {
  const tables = [
    'diagnostic_sessions',
    'diagnostic_responses',
    'pathway_templates',
    'pathway_steps',
    'user_pathways',
    'practices',
  ];

  console.log('Checking Console V3 tables...\n');

  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`✗ ${table}: NOT FOUND (${error.code})`);
      console.log(`  ${error.message}`);
    } else {
      console.log(`✓ ${table}: EXISTS`);
    }
  }
}

checkTables().catch(console.error);

