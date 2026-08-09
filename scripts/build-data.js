// Build script: fetches all Notion internship data → saves as static JSON
// Run: node scripts/build-data.js
const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.NOTION_TOKEN || '';
if (!TOKEN) { console.error('NOTION_TOKEN environment variable required'); process.exit(1); }
const REGIONS = {
  "North America": { id: "3b72ee6a-4a2c-8158-be56-fab4086b5f3b", flag: "🇺🇸" },
  "Europe": { id: "3b72ee6a-4a2c-813b-a102-e1ddaab86f4e", flag: "🇪🇺" },
  "APAC": { id: "3b72ee6a-4a2c-816b-90ee-cd2d65109a1e", flag: "🌏" },
  "Remote": { id: "3b72ee6a-4a2c-8150-98fb-f4072d0a40a7", flag: "🌐" },
};

function notionRequest(endpoint, method, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, 'https://api.notion.com');
    const options = {
      hostname: url.hostname, path: url.pathname + url.search, method: method || 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { resolve({ error: 'Parse error' }); } });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function fetchAll() {
  const results = [];
  for (const [key, region] of Object.entries(REGIONS)) {
    process.stdout.write(`  Fetching ${key}...`);
    let cursor = null;
    let count = 0;
    do {
      const body = cursor ? { page_size: 100, start_cursor: cursor } : { page_size: 100 };
      const data = await notionRequest(`/v1/databases/${region.id}/query`, 'POST', body);
      for (const page of data.results || []) {
        const props = page.properties;
        results.push({
          id: page.id,
          region: key, regionFlag: region.flag,
          company: props.Company?.title?.[0]?.plain_text || '',
          role: props.Role?.rich_text?.[0]?.plain_text || '',
          industry: props.Industry?.multi_select?.map(i => i.name) || [],
          country: props.Country?.select?.name || '',
          city: props.City?.rich_text?.[0]?.plain_text || '',
          isRemote: props['Is Remote']?.checkbox || false,
          year: props.Year?.select?.name || '',
          season: props.Season?.select?.name || '',
          applyUrl: props['Apply URL']?.url || '',
          deadline: props.Deadline?.date?.start || null,
          jobStatus: props['Job Status']?.status?.name || 'Open',
          notes: props.Notes?.rich_text?.[0]?.plain_text || '',
          jdSummary: (props.Notes?.rich_text?.[0]?.plain_text || '').substring(0, 300),
          visaSponsorship: props['Visa Sponsorship']?.checkbox || false,
          function: props.Specialization?.multi_select?.map(s => s.name) || [],
          companyTier: props['Company Tier']?.select?.name || '',
          createdTime: page.created_time,
        });
        count++;
      }
      cursor = data.has_more ? data.next_cursor : null;
    } while (cursor);
    console.log(` ${count} entries`);
  }
  return results;
}

(async () => {
  console.log('Building static data from Notion...\n');
  const start = Date.now();
  const data = await fetchAll();
  const outputPath = path.join(__dirname, '..', 'public', 'data.json');
  fs.writeFileSync(outputPath, JSON.stringify(data));
  const size = (fs.statSync(outputPath).size / 1024).toFixed(0);
  console.log(`\n✅ Done: ${data.length} entries (${size}KB) in ${((Date.now() - start)/1000).toFixed(1)}s`);
  console.log(`   Written to: ${outputPath}`);
})();
