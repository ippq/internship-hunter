// Batch insert: reads scripts/new-entries.json and inserts into Notion
// Run: node scripts/insert-batch.js
const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.NOTION_TOKEN || '';
if (!TOKEN) { console.error('NOTION_TOKEN env var required'); process.exit(1); }

const REGIONS = {
  "North America": "3b72ee6a-4a2c-8158-be56-fab4086b5f3b",
  "Europe": "3b72ee6a-4a2c-813b-a102-e1ddaab86f4e",
  "APAC": "3b72ee6a-4a2c-816b-90ee-cd2d65109a1e",
  "Remote": "3b72ee6a-4a2c-8150-98fb-f4072d0a40a7",
};

function notionRequest(method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.notion.com',
      path: '/v1/pages',
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            console.error(`  ❌ HTTP ${res.statusCode}: ${parsed.message || data.substring(0, 200)}`);
            resolve(null);
          } else {
            resolve(parsed);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', (e) => { console.error(`  ❌ Network: ${e.message}`); resolve(null); });
    req.write(JSON.stringify(body));
    req.end();
  });
}

function buildPage(databaseId, entry) {
  const props = {
    "Company": { title: [{ text: { content: entry.company } }] },
    "Role": { rich_text: [{ text: { content: entry.role } }] },
    "Industry": { multi_select: (entry.industry || []).map(i => ({ name: i })) },
    "Country": { select: { name: entry.country || '' } },
    "City": { rich_text: [{ text: { content: entry.city || '' } }] },
    "Year": { select: { name: entry.year || '2027' } },
    "Season": { select: { name: entry.season || 'Summer' } },
    "Apply URL": { url: entry.applyUrl || '' },
    "Job Status": { status: { name: 'Open' } },
    "Notes": { rich_text: [{ text: { content: entry.notes || '' } }] },
    "Visa Sponsorship": { checkbox: entry.visaSponsorship || false },
    "Specialization": { multi_select: (entry.function || []).map(f => ({ name: f })) },
    "Company Tier": { select: { name: entry.companyTier || '' } },
  };
  // "Is Remote" property only exists in Remote database
  if (entry.region === 'Remote') {
    props["Is Remote"] = { checkbox: entry.isRemote || false };
  }
  // Optional deadline
  if (entry.deadline) {
    props["Deadline"] = { date: { start: entry.deadline } };
  }
  return {
    parent: { database_id: databaseId },
    properties: props,
  };
}

(async () => {
  const entriesPath = path.join(__dirname, 'new-entries.json');
  const entries = JSON.parse(fs.readFileSync(entriesPath, 'utf-8'));
  console.log(`📦 Inserting ${entries.length} entries into Notion...\n`);

  let success = 0, fail = 0;
  const regionCounts = {};

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const dbId = REGIONS[entry.region];
    if (!dbId) { console.error(`  ❌ Unknown region: ${entry.region} for ${entry.company}`); fail++; continue; }

    const page = buildPage(dbId, entry);
    const result = await notionRequest('POST', page);

    if (result) {
      success++;
      regionCounts[entry.region] = (regionCounts[entry.region] || 0) + 1;
      const label = `${entry.region.substring(0, 4)} | ${entry.company} — ${entry.role.substring(0, 40)}`;
      process.stdout.write(`  ✅ [${i+1}/${entries.length}] ${label}\n`);
    } else {
      fail++;
      process.stdout.write(`  ❌ [${i+1}/${entries.length}] FAILED: ${entry.company}\n`);
    }

    // Rate limit: 3 req/s for Notion API
    await new Promise(r => setTimeout(r, 350));
  }

  console.log(`\n📊 Results: ${success} success, ${fail} failed`);
  console.log('   By region:', JSON.stringify(regionCounts));
  console.log('\n⏭  Run: node scripts/build-data.js');
})();
