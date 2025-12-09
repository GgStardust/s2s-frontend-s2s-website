/**
 * Run Order Index Constraint Fix Migration
 * Fixes the order_index constraint to allow more values
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function runMigration() {
  console.log('========================================');
  console.log('Fixing order_index Constraint');
  console.log('========================================\n');

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Read migration file
    const migrationPath = resolve(process.cwd(), 'supabase/migrations/20250126_fix_order_index_constraint.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📝 Migration SQL:');
    console.log('---\n');
    console.log(migrationSQL);
    console.log('\n---\n');

    // Execute migration using RPC (if available) or direct SQL
    // Note: Supabase JS client doesn't support DDL directly, so we'll use SQL editor approach
    console.log('⚠️  Supabase JS client cannot execute DDL statements directly.');
    console.log('Please run this migration in your Supabase SQL Editor:\n');
    console.log('Dashboard: https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql/new\n');
    console.log('Or if you have psql access, run:');
    console.log(`psql [connection_string] -f ${migrationPath}\n`);

    // Verify current constraint (if we can query it)
    console.log('Verifying current state...\n');
    const { data: testQuestion, error: testError } = await supabase
      .from('diagnostic_questions')
      .select('id, order_index')
      .limit(1)
      .single();

    if (testError) {
      console.error('Error querying questions:', testError.message);
    } else {
      console.log(`✅ Can query questions. Current order_index sample: ${testQuestion?.order_index}`);
    }

    console.log('\n========================================');
    console.log('Next Steps:');
    console.log('========================================');
    console.log('1. Run the migration SQL in Supabase SQL Editor');
    console.log('2. Verify the constraint is fixed');
    console.log('3. Try loading questions again\n');

    return true;
  } catch (error: any) {
    console.error('\n❌ Error:');
    console.error(error);
    return false;
  }
}

if (require.main === module) {
  runMigration()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { runMigration };

