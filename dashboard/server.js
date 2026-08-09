// Internship Hunter Dashboard Server
// Zero-dependency Node.js HTTP server
// Proxies Notion API queries across 4 regional databases

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8420;
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config', 'notion-dbs.json'), 'utf-8'));
const TOKEN = CONFIG.notionToken.startsWith('env:') ? process.env[CONFIG.notionToken.split(':')[1]] : CONFIG.notionToken;
const NOTION_VERSION = CONFIG.notionVersion;
const REGIONS = CONFIG.regions;

// ─── Cache ────────────────────────────────────────────────────
let CACHE = { data: null, time: 0, loading: false };
const CACHE_TTL = 300000; // 5 min

// MIME types for static files
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

// ─── Notion API helper ───────────────────────────────────────────
function notionRequest(endpoint, method, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, 'https://api.notion.com');
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method || 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { resolve({ error: 'Parse error', raw: data.substring(0, 200) }); }
      });
    });
    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ─── Fetch all internships from all 4 regional databases ─────────
async function fetchAllInternships(filters) {
  const results = [];
  const targetRegions = filters.region
    ? { [filters.region]: REGIONS[filters.region] }
    : REGIONS;

  for (const [key, region] of Object.entries(targetRegions)) {
    if (!region) continue;
    try {
      // Cursor-based pagination to get ALL entries
      let allPages = [];
      let cursor = null;
      do {
        const body = cursor ? { page_size: 100, start_cursor: cursor } : { page_size: 100 };
        const data = await notionRequest(`/v1/databases/${region.id}/query`, 'POST', body);
        allPages = allPages.concat(data.results || []);
        cursor = data.has_more ? data.next_cursor : null;
      } while (cursor);

      for (const page of allPages) {
        const props = page.properties;
        const entry = {
          id: page.id,
          url: page.url,
          region: key,
          regionFlag: region.flag,
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
        };
        results.push(entry);
      }
    } catch (e) {
      console.error(`Error fetching ${key}:`, e.message);
    }
  }

  // Apply filters in JS
  let filtered = results;

  if (filters.industry && filters.industry !== 'All') {
    filtered = filtered.filter(e => e.industry.includes(filters.industry));
  }
  if (filters.year && filters.year !== 'All') {
    filtered = filtered.filter(e => e.year === filters.year);
  }
  if (filters.status && filters.status !== 'All') {
    filtered = filtered.filter(e => e.jobStatus === filters.status);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(e =>
      e.company.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q) ||
      e.country.toLowerCase().includes(q)
    );
  }

  // Sort
  const sort = filters.sort || 'deadline';
  if (sort === 'deadline') {
    // Put entries with deadlines first (ascending), then rolling (null) last
    filtered.sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.localeCompare(b.deadline);
    });
  } else if (sort === 'newest') {
    filtered.sort((a, b) => b.createdTime.localeCompare(a.createdTime));
  } else if (sort === 'company') {
    filtered.sort((a, b) => a.company.localeCompare(b.company));
  }

  return filtered;
}

// ─── Static file server ──────────────────────────────────────────
function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (e) {
    res.writeHead(404);
    res.end('Not found');
  }
}

// ─── HTTP Server ──────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // API: Get internships
  if (url.pathname === '/api/internships') {
    try {
      // Check cache
      if (!CACHE.data || Date.now() - CACHE.time > CACHE_TTL) {
        CACHE.data = await fetchAllInternships({});
        CACHE.time = Date.now();
      }
      const allData = CACHE.data;
      const filters = {
        region: url.searchParams.get('region') || null,
        industry: url.searchParams.get('industry') || 'All',
        year: url.searchParams.get('year') || 'All',
        status: url.searchParams.get('status') || 'All',
        search: url.searchParams.get('search') || null,
        sort: url.searchParams.get('sort') || 'deadline',
        page: parseInt(url.searchParams.get('page')) || 1,
      };
      // Apply filters to cached data
      let data = [...allData];
      if (filters.region) data = data.filter(e => e.region === filters.region);
      if (filters.industry && filters.industry !== 'All') data = data.filter(e => e.industry.includes(filters.industry));
      if (filters.year && filters.year !== 'All') data = data.filter(e => e.year === filters.year);
      if (filters.status && filters.status !== 'All') data = data.filter(e => e.jobStatus === filters.status);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        data = data.filter(e => e.company.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.country.toLowerCase().includes(q));
      }
      // Sort
      if (filters.sort === 'deadline') {
        data.sort((a, b) => { if (!a.deadline && !b.deadline) return 0; if (!a.deadline) return 1; if (!b.deadline) return -1; return a.deadline.localeCompare(b.deadline); });
      } else if (filters.sort === 'newest') {
        data.sort((a, b) => b.createdTime.localeCompare(a.createdTime));
      } else if (filters.sort === 'company') {
        data.sort((a, b) => a.company.localeCompare(b.company));
      }
      const pageSize = 50;
      const start = (filters.page - 1) * pageSize;
      const paged = data.slice(start, start + pageSize);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        total: data.length,
        page: filters.page,
        pageSize,
        results: paged,
        filters,
      }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Count by region/industry
  if (url.pathname === '/api/stats') {
    try {
      if (!CACHE.data || Date.now() - CACHE.time > CACHE_TTL) {
        CACHE.data = await fetchAllInternships({});
        CACHE.time = Date.now();
      }
      const data = CACHE.data;
      const stats = {
        total: data.length,
        byRegion: {},
        byIndustry: {},
        byYear: {},
        byStatus: {},
      };
      for (const e of data) {
        stats.byRegion[e.region] = (stats.byRegion[e.region] || 0) + 1;
        for (const ind of e.industry) {
          stats.byIndustry[ind] = (stats.byIndustry[ind] || 0) + 1;
        }
        stats.byYear[e.year] = (stats.byYear[e.year] || 0) + 1;
        stats.byStatus[e.jobStatus] = (stats.byStatus[e.jobStatus] || 0) + 1;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(stats));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Get/Set Profile
  if (url.pathname === '/api/profile') {
    const profilePath = path.join(__dirname, '..', 'my-materials', 'candidate_profile.json');
    if (req.method === 'GET') {
      try {
        const data = fs.readFileSync(profilePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      } catch (e) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Profile not found' }));
      }
      return;
    }
    if (req.method === 'POST') {
      try {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          fs.writeFileSync(profilePath, JSON.stringify(JSON.parse(body), null, 2), 'utf-8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        });
      } catch (e) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }
  }

  // API: Generate Apply Prompt
  if (url.pathname === '/api/apply' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const { company, role, applyUrl, id } = JSON.parse(body);
        const profilePath = path.join(__dirname, '..', 'my-materials', 'candidate_profile.json');
        let profileLoaded = false;
        try { fs.readFileSync(profilePath); profileLoaded = true; } catch (e) {}

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          prompt: `Apply to ${company} - ${role} at ${applyUrl}. Use my candidate profile from C:\\Users\\richa\\projects\\internship-hunter\\my-materials\\ to fill the application form. PREVIEW everything before clicking submit.`,
          ready: profileLoaded,
          warnings: profileLoaded ? [] : ['Candidate profile is empty. Fill it in Settings first.'],
          steps: [
            'Open ' + applyUrl + ' with Playwright browser_navigate',
            'Read my-materials/candidate_profile.json for personal info',
            'Upload my-materials/resume.pdf if file input exists',
            'Read my-materials/experience_bank.md for project details',
            'Read my-materials/answer_bank.md for standard answers',
            'Fill the form — never guess, ask me if unclear',
            'Take a screenshot and show me ALL fields before submitting',
            'Wait for my YES before clicking Submit'
          ]
        }));
      });
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Serve static files
  if (url.pathname === '/' || url.pathname === '') {
    serveStatic(res, path.join(__dirname, 'index.html'));
  } else {
    serveStatic(res, path.join(__dirname, url.pathname));
  }
});

server.listen(PORT, () => {
  console.log(`\n🎯 Internship Hunter Dashboard`);
  console.log(`   http://localhost:${PORT}\n`);
  console.log(`   API: http://localhost:${PORT}/api/internships`);
  console.log(`   Stats: http://localhost:${PORT}/api/stats\n`);
});
