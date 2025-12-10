/**
 * Run Console V3 Database Migration
 *
 * This script helps run the Console V3 diagnostic system migration
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'set' : 'missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'set' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTablesExist() {
  const tables = [
    'diagnostic_questions',
    'diagnostic_sessions',
    'diagnostic_responses',
    'pathway_templates',
    'pathway_steps',
    'user_pathways',
    'practices',
    'products',
    'orders',
    'access_tokens',
    'user_products',
  ];

  console.log('Checking if Console V3 tables exist...\n');
  
  const results: Record<string, boolean> = {};
  
  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    const exists = !error || error.code !== 'PGRST116';
    results[table] = exists;
    
    if (exists) {
      console.log(`✓ ${table} exists`);
    } else {
      console.log(`✗ ${table} does not exist`);
    }
  }
  
  return results;
}

async function runMigration() {
  try {
    console.log('📊 Console V3 Migration Helper\n');
    console.log('==========================================\n');

    // Check current state
    const tableStatus = await checkTablesExist();
    const allExist = Object.values(tableStatus).every(exists => exists);
    
    if (allExist) {
      console.log('\n✅ All Console V3 tables already exist!');
      console.log('Migration may have already been run.\n');
      return;
    }

    // Read the migration file
    const migrationPath = path.join(
      process.cwd(),
      'supabase',
      'migrations',
      '20250126_console_v3_diagnostic_system.sql'
    );

    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Migration file not found: ${migrationPath}`);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('\n⚠️  SQL execution via script requires admin access.');
    console.log('Please run the following SQL in your Supabase SQL Editor:\n');
    console.log('Dashboard URL: https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql\n');
    console.log('---\n');
    console.log(migrationSQL);
    console.log('\n---\n');

    // Try to verify tables after manual migration
    console.log('\nAfter running the migration, you can verify with:');
    console.log('  npm run verify-console-v3-migration\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

runMigration();

