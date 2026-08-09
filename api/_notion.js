// Shared Notion API helpers for Vercel serverless functions
const https = require('https');

const REGIONS = {
  "North America": { id: "3b72ee6a-4a2c-8158-be56-fab4086b5f3b", flag: "🇺🇸" },
  "Europe": { id: "3b72ee6a-4a2c-813b-a102-e1ddaab86f4e", flag: "🇪🇺" },
  "APAC": { id: "3b72ee6a-4a2c-816b-90ee-cd2d65109a1e", flag: "🌏" },
  "Remote": { id: "3b72ee6a-4a2c-8150-98fb-f4072d0a40a7", flag: "🌐" },
};

const TOKEN = process.env.NOTION_TOKEN || '';
if (!TOKEN) { console.error('NOTION_TOKEN required'); }
const NOTION_VERSION = "2022-06-28";

function notionRequest(endpoint, method, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, 'https://api.notion.com');
    const options = {
      hostname: url.hostname, path: url.pathname + url.search, method: method || 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': NOTION_VERSION, 'Content-Type': 'application/json' },
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
    let cursor = null;
    do {
      const body = cursor ? { page_size: 100, start_cursor: cursor } : { page_size: 100 };
      const data = await notionRequest(`/v1/databases/${region.id}/query`, 'POST', body);
      for (const page of data.results || []) {
        const props = page.properties;
        results.push({
          id: page.id, url: page.url, region: key, regionFlag: region.flag,
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
          source: props.Source?.url || '',
          publishedDate: props['Published Date']?.date?.start || '',
          notes: props.Notes?.rich_text?.[0]?.plain_text || '',
          jdSummary: (props.Notes?.rich_text?.[0]?.plain_text || '').substring(0, 300),
          visaSponsorship: props['Visa Sponsorship']?.checkbox || false,
          specialization: props.Specialization?.multi_select?.map(s => s.name) || [],
          function: props.Specialization?.multi_select?.map(s => s.name) || [],
          companyTier: props['Company Tier']?.select?.name || '',
          createdTime: page.created_time,
        });
      }
      cursor = data.has_more ? data.next_cursor : null;
    } while (cursor);
  }
  return results;
}

// In-memory cache for Vercel (survives between warm invocations)
let CACHE = null;
let CACHE_TIME = 0;
const TTL = 300000; // 5 min

async function getCachedData() {
  if (!CACHE || Date.now() - CACHE_TIME > TTL) {
    CACHE = await fetchAll();
    CACHE_TIME = Date.now();
  }
  return CACHE;
}

module.exports = { REGIONS, TOKEN, NOTION_VERSION, notionRequest, fetchAll, getCachedData };
