const fetch = require('node-fetch');
fetch('http://localhost:4000/api/console/v3/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})
.then(r => r.json())
.then(d => console.log('✅ API works:', Object.keys(d)))
.catch(e => console.error('❌ API error:', e.message));
