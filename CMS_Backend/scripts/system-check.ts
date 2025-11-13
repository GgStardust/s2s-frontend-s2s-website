/**
 * System Integrity Check Script
 * 
 * Verifies all critical system components are operational.
 * 
 * Step 6 of Backend Stabilization Plan
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { runResonanceValidation } from '@/lib/resonance-api';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail';
  message: string;
  duration?: number;
}

const results: CheckResult[] = [];

/**
 * Run a check and record result
 */
async function runCheck(
  name: string,
  checkFn: () => Promise<boolean> | boolean
): Promise<void> {
  const startTime = Date.now();
  try {
    const passed = await checkFn();
    const duration = Date.now() - startTime;
    results.push({
      name,
      status: passed ? 'pass' : 'fail',
      message: passed ? 'OK' : 'Failed',
      duration,
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    results.push({
      name,
      status: 'fail',
      message: error.message || 'Unknown error',
      duration,
    });
  }
}

/**
 * Check Supabase connection
 */
async function checkSupabase(): Promise<boolean> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { error } = await supabase.from('content_files').select('id').limit(1);
  return !error;
}

/**
 * Check required tables exist
 */
async function checkTables(): Promise<boolean> {
  const requiredTables = [
    'content_files',
    'chapters',
    'books',
    'scrollstreams',
  ];

  const optionalTables = [
    'resonance_scores', // May not exist yet, optional
  ];

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Check required tables
  for (const table of requiredTables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.error(`   ❌ Table ${table}: ${error.message}`);
      return false;
    }
  }
  
  // Check optional tables (warn but don't fail)
  for (const table of optionalTables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.warn(`   ⚠️  Optional table ${table} not found (non-critical)`);
    }
  }
  
  return true;
}

/**
 * Check RBI kernel
 */
async function checkRBIKernel(): Promise<boolean> {
  const testContent = `# Test Content
  
This is a test document for RBI kernel validation.
It contains references to resonance and coherence.

@orb1 @orb2
`;
  
  try {
    const result = await runResonanceValidation(testContent, 'Test Document');
    return (
      result.coherenceScore >= 0 &&
      result.coherenceScore <= 1 &&
      Array.isArray(result.validatedOrbs) &&
      typeof result.metrics === 'object'
    );
  } catch (error) {
    return false;
  }
}

/**
 * Check API endpoints
 */
async function checkAPIEndpoints(): Promise<boolean> {
  try {
    // Check content-files endpoint
    const contentResponse = await fetch(`${SITE_URL}/api/content-files?limit=1`);
    if (!contentResponse.ok) {
      console.error(`   ❌ /api/content-files: HTTP ${contentResponse.status}`);
      return false;
    }

    // Check resonance/analyze endpoint
    const resonanceResponse = await fetch(`${SITE_URL}/api/resonance/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Test content', title: 'Test' }),
    });
    if (!resonanceResponse.ok && resonanceResponse.status !== 400) {
      console.error(`   ❌ /api/resonance/analyze: HTTP ${resonanceResponse.status}`);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error(`   ❌ API endpoint check failed: ${error.message}`);
    return false;
  }
}

/**
 * Check required environment variables
 */
function checkEnvVars(): boolean {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const optional = [
    'OPENAI_API_KEY',
    'REDIS_HOST',
    'SITE_URL',
  ];

  let allRequired = true;
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`   ❌ Missing required env var: ${key}`);
      allRequired = false;
    }
  }

  for (const key of optional) {
    if (!process.env[key]) {
      console.warn(`   ⚠️  Missing optional env var: ${key}`);
    }
  }

  return allRequired;
}

/**
 * Main system check function
 */
async function systemCheck() {
  console.log('🔍 Running System Integrity Check...\n');

  // Check environment variables
  await runCheck('Environment Variables', checkEnvVars);

  // Check Supabase connection
  await runCheck('Supabase Connection', checkSupabase);

  // Check required tables
  await runCheck('Database Tables', checkTables);

  // Check RBI kernel
  await runCheck('RBI Kernel', checkRBIKernel);

  // Check API endpoints
  await runCheck('API Endpoints', checkAPIEndpoints);

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('📊 System Check Results');
  console.log('='.repeat(60));

  let allPassed = true;
  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : '❌';
    const duration = result.duration ? ` (${result.duration}ms)` : '';
    console.log(`${icon} ${result.name}: ${result.message}${duration}`);
    if (result.status === 'fail') {
      allPassed = false;
    }
  }

  console.log('='.repeat(60));
  console.log(`\n${allPassed ? '✅' : '❌'} System Check: ${allPassed ? 'PASSED' : 'FAILED'}\n`);

  return allPassed;
}

// Run if called directly
if (require.main === module) {
  systemCheck()
    .then((passed) => {
      process.exit(passed ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { systemCheck };

