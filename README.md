<p align="center">
  <img src="https://img.shields.io/badge/internships-822-blue?style=for-the-badge" alt="822 internships">
  <img src="https://img.shields.io/badge/companies-600+-green?style=for-the-badge" alt="600+ companies">
  <img src="https://img.shields.io/badge/countries-33-orange?style=for-the-badge" alt="33 countries">
  <img src="https://img.shields.io/badge/industries-10-purple?style=for-the-badge" alt="10 industries">
</p>

<h1 align="center">🎯 Internship Hunter</h1>
<p align="center"><strong>全球实习机会一站式发现与追踪平台</strong></p>
<p align="center">The most comprehensive global internship tracker — 822 positions across 600+ companies in 33 countries</p>

<p align="center">
  <a href="https://internship-hunter-six.vercel.app"><strong>🔗 Live Site</strong></a> ·
  <a href="#-features">Features</a> ·
  <a href="#-data-coverage">Coverage</a> ·
  <a href="#-tech-stack">Tech Stack</a> ·
  <a href="#-quick-start">Quick Start</a>
</p>

---

## ✨ Features

<table>
<tr><td>🔍 <strong>Discover</strong></td><td>Browse & filter 822 internships by industry, function, region, country, tier, year, visa sponsorship, and keyword search</td></tr>
<tr><td>⭐ <strong>Favorites</strong></td><td>Save internships with one click — scoped to your user account</td></tr>
<tr><td>📋 <strong>Track</strong></td><td>Track application status: Applied → Interview → Offer → Accepted/Rejected</td></tr>
<tr><td>📊 <strong>Analytics</strong></td><td>Funnel visualization, industry breakdown, application stage tracking</td></tr>
<tr><td>👤 <strong>Multi-User</strong></td><td>Username + PIN login system — each user has their own favorites, tracking, and profile</td></tr>
<tr><td>🌙 <strong>Dark/Light</strong></td><td>Full theme toggle with CSS custom properties design system</td></tr>
<tr><td>📥 <strong>Export</strong></td><td>Download filtered results as CSV (with BOM for Excel compatibility)</td></tr>
<tr><td>🆕 <strong>Fresh Data</strong></td><td>Built from live Notion databases, deployable in seconds</td></tr>
<tr><td>💰 <strong>Zero Cost</strong></td><td>Static JSON hosted on Vercel CDN — no server, no database, no ongoing cost</td></tr>
</table>

## 📊 Data Coverage

### By Region
| Region | Entries | Highlights |
|--------|---------|------------|
| 🇺🇸 North America | 451 | FAANG, Fortune 500, Unicorns, Gov/NPO |
| 🇪🇺 Europe | 216 | Siemens, Airbus, LVMH, Roche, Shell, IKEA |
| 🌏 APAC | 138 | Tencent (10K+ offers), Samsung, TSMC, Nubank |
| 🌐 Remote | 17 | GitLab, Zapier, Automattic, Binance |

### By Industry
| Industry | Count | Example Companies |
|----------|-------|-------------------|
| 💻 Technology & Internet | 288 | Google, Meta, Apple, Microsoft, ByteDance, Stripe |
| 💰 Finance & Fintech | 169 | Goldman Sachs, JPMorgan, Stripe, HSBC, Nubank |
| 🏭 Industrial & Manufacturing | 89 | Tesla, SpaceX, Boeing, Toyota, Siemens, Foxconn |
| 🛍️ Consumer & Retail | 81 | Nike, LVMH, P&G, IKEA, Nestlé, PepsiCo |
| 🏥 Healthcare & Life Sciences | 45 | Pfizer, Novartis, Roche, Moderna, Merck |
| 📊 Consulting & Advisory | 36 | McKinsey, BCG, Bain, Deloitte, PwC, EY, KPMG |
| 🎬 Media & Entertainment | 33 | Disney, Netflix, Spotify, EA, Roblox, Epic Games |
| ⚡ Energy & CleanTech | 32 | Shell, BP, Equinor, Ørsted, CATL, NextEra |
| 🪙 Crypto & Web3 | 22 | Coinbase, Binance, Kraken, Ripple, Circle, Polygon |
| 🏛️ Government & Public Sector | 18 | World Bank, UN, OECD, IMF, NATO, WHO |

### By Function
| Function | Count |
|----------|-------|
| Engineering & Development | 469 |
| AI / ML & Data | 110 |
| Marketing & Growth | 89 |
| Consulting & Research | 50 |
| Operations & Strategy | 37 |
| Product & Design | 27 |
| Finance & Accounting | 25 |
| Sales & BD | 24 |
| People & Culture | 18 |
| Quantitative Finance | 18 |

### By Tier
- **Fortune 500 / Global Corp**: 500+ entries
- **Unicorn / Growth Stage**: 175+ entries
- **Startup / SME**: 25+ entries
- **Government / Non-profit**: 18 entries

## 🏗️ Tech Stack

```
Internship Hunter
├── Frontend: Vanilla HTML/CSS/JS (zero framework dependencies)
├── Data: Static JSON pre-built from Notion API
├── Build: Node.js script (scripts/build-data.js)
├── Deploy: Vercel static hosting (free tier)
├── Auth: localStorage-based multi-user system
└── CI/CD: GitHub Actions (daily data refresh)
```

**Architecture**: Notion databases → `node scripts/build-data.js` → `public/data.json` → Vercel CDN

- **Zero server cost** — All filtering, sorting, and pagination happens client-side from a single static JSON file
- **Sub-second loads** — Vercel global CDN + minimal HTML/CSS/JS footprint (~650KB data + ~15KB app)
- **No framework bloat** — Purpose-built vanilla JS under 500 lines

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- A Notion API token (for data refresh)
- Vercel account (for deployment)

### Local Development
```bash
# Clone the repo
git clone https://github.com/ippq/internship-hunter.git
cd internship-hunter

# Rebuild data from Notion (requires token)
export NOTION_TOKEN=ntn_...
node scripts/build-data.js

# Serve locally
npx serve public
# Or: cd public && python3 -m http.server 8420
```

### Deploy to Vercel
```bash
# One-click deploy
npx vercel --prod --yes

# Or via Vercel dashboard
# 1. Import repo
# 2. Set output directory: public
# 3. Set build command: echo 'Data pre-built; set NOTION_TOKEN in Vercel env for auto-refresh'
# 4. Add NOTION_TOKEN in Environment Variables
```

### GitHub Actions (Daily Refresh)
1. Add `NOTION_TOKEN` to GitHub Secrets (Settings → Secrets and variables → Actions)
2. The workflow in `.github/workflows/refresh.yml` runs daily at 6am UTC

## 📁 Project Structure

```
├── public/               — Static site (deployed to Vercel)
│   ├── index.html         — Application shell
│   ├── app.js             — All frontend logic (~400 lines)
│   ├── style.css          — Design system + responsive CSS
│   └── data.json          — Pre-built internship data (822 entries, ~650KB)
├── scripts/
│   ├── build-data.js      — Notion API → static JSON
│   ├── insert-batch.js    — Batch insert new entries into Notion
│   └── new-entries.json   — Staging file for new entries
├── config/
│   └── notion-dbs.json    — Regional database IDs
├── .github/workflows/
│   └── refresh.yml        — Daily data refresh action
├── vercel.json            — Vercel deployment config
└── .env                   — NOTION_TOKEN (gitignored)
```

## 🔒 Data Pipeline

1. **Collection**: Internships researched via Anysearch + verified against company career pages
2. **Storage**: 4 Notion databases (NA / EU / APAC / Remote), each with standardized schema
3. **Build**: `build-data.js` fetches all pages via Notion API (cursor pagination), flattens to JSON
4. **Deploy**: `data.json` committed to repo, deployed to Vercel CDN as static asset
5. **Refresh**: GitHub Action runs daily, or manually via `node scripts/build-data.js`

## 📝 Notion Schema

Each entry has: Company (title), Role, Industry (multi-select), Country, City, Region, Year, Season, Apply URL, Deadline, Job Status, Visa Sponsorship, Specialization (function), Company Tier, Notes, Created Time.

## 🎯 Use Cases

- **Students**: Find 2026-2027 internships matching your field, filter by visa sponsorship, track applications
- **Career Centers**: Embed as a resource for students; export filtered lists
- **Recruiters**: Benchmark competitor internship programs
- **Researchers**: Analyze internship market trends across industries and regions

## 📄 License

MIT — see [LICENSE](LICENSE) file.

---

<p align="center">
  Built with ❤️ using Notion API + Vercel · 
  <a href="https://internship-hunter-six.vercel.app">Live Demo</a>
</p>
