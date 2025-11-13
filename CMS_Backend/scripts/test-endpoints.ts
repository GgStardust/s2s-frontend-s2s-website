/**
 * Endpoint Testing Script
 * 
 * Tests all newly created endpoints to verify they work correctly
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  response?: any;
}

const results: TestResult[] = [];

async function testEndpoint(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any
): Promise<TestResult> {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body && method === 'POST') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return {
      endpoint,
      method,
      status: response.ok ? 'pass' : 'fail',
      message: response.ok ? 'OK' : `Error: ${response.status} ${response.statusText}`,
      response: data
    };
  } catch (error) {
    return {
      endpoint,
      method,
      status: 'fail',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function runTests() {
  console.log('🧪 Testing Endpoints\n');
  console.log(`Base URL: ${BASE_URL}\n`);
  console.log('='.repeat(60));

  // Test 1: Console Content API
  console.log('\n1. Testing Console Content API...');
  results.push(await testEndpoint('/api/console/content'));
  results.push(await testEndpoint('/api/console/content?console_context=compiled_chapter'));

  // Test 2: RBI Book Validation
  console.log('\n2. Testing RBI Book Validation...');
  // Need a book ID - will skip if not available
  const { data: books } = await fetch(`${BASE_URL}/api/books`).then(r => r.json()).catch(() => ({ data: [] }));
  if (books && books.length > 0) {
    results.push(await testEndpoint('/api/rbi/validate-book', 'POST', { book_id: books[0].id }));
  } else {
    results.push({ endpoint: '/api/rbi/validate-book', method: 'POST', status: 'skip', message: 'No books available' });
  }

  // Test 3: Concept Map Console API
  console.log('\n3. Testing Concept Map Console API...');
  results.push(await testEndpoint('/api/console/concept-map'));

  // Test 4: Book Export API
  console.log('\n4. Testing Book Export API...');
  if (books && books.length > 0) {
    results.push(await testEndpoint(`/api/books/${books[0].id}/export?format=markdown`));
  } else {
    results.push({ endpoint: '/api/books/[id]/export', method: 'GET', status: 'skip', message: 'No books available' });
  }

  // Test 5: Orb Personalities API
  console.log('\n5. Testing Orb Personalities API...');
  results.push(await testEndpoint('/api/orbital/personalities'));
  results.push(await testEndpoint('/api/orbital/personalities?orb=1'));

  // Test 6: Reference APIs
  console.log('\n6. Testing Reference APIs...');
  results.push(await testEndpoint('/api/reference/tag-registry'));
  results.push(await testEndpoint('/api/reference/processing-workflow'));

  // Test 7: Codex Destinations API
  console.log('\n7. Testing Codex Destinations API...');
  results.push(await testEndpoint('/api/codex/destinations'));

  // Test 8: Auto-Sync API
  console.log('\n8. Testing Auto-Sync API...');
  results.push(await testEndpoint('/api/sync/auto'));
  results.push(await testEndpoint('/api/sync/auto', 'POST', { action: 'status' }));

  // Test 9: RBI Field-Sensing API
  console.log('\n9. Testing RBI Field-Sensing API...');
  // Need content IDs - will skip if not available
  const { data: contentFiles } = await fetch(`${BASE_URL}/api/content-files`).then(r => r.json()).catch(() => ({ data: [] }));
  if (contentFiles && contentFiles.length > 0) {
    const contentIds = contentFiles.slice(0, 3).map((f: any) => f.id);
    results.push(await testEndpoint('/api/rbi/field-sense', 'POST', { content_ids: contentIds }));
  } else {
    results.push({ endpoint: '/api/rbi/field-sense', method: 'POST', status: 'skip', message: 'No content files available' });
  }

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results Summary\n');

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`📝 Total: ${results.length}\n`);

  console.log('Detailed Results:');
  console.log('-'.repeat(60));

  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⏭️';
    console.log(`${icon} ${result.method} ${result.endpoint}`);
    console.log(`   ${result.message}`);
    if (result.status === 'fail' && result.response) {
      console.log(`   Response: ${JSON.stringify(result.response).substring(0, 100)}...`);
    }
    console.log('');
  }

  // Exit with error code if any tests failed
  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runTests().catch(error => {
    console.error('Test execution error:', error);
    process.exit(1);
  });
}

export { runTests };

