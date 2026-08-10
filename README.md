<p align="center">
  <img src="https://img.shields.io/badge/internships-822-blue?style=for-the-badge" alt="822 internships">
  <img src="https://img.shields.io/badge/companies-600+-green?style=for-the-badge" alt="600+ companies">
  <img src="https://img.shields.io/badge/countries-33-orange?style=for-the-badge" alt="33 countries">
  <img src="https://img.shields.io/badge/industries-10-purple?style=for-the-badge" alt="10 industries">
</p>

<h1 align="center">🎯 Internship Hunter</h1>
<p align="center"><strong>Global Internship Discovery & Tracking Platform</strong></p>
<p align="center">822 positions across 600+ companies in 33 countries — the most comprehensive open-source internship tracker</p>

<p align="center">
  <a href="https://internship-hunter-six.vercel.app"><strong>🔗 Live Site</strong></a> ·
  <a href="#-features">Features</a> ·
  <a href="#-data-coverage">Coverage</a> ·
  <a href="#-tech-stack">Tech Stack</a> ·
  <a href="#-quick-start">Quick Start</a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Discover** | Browse & filter 822 internships by industry, function, region, country, tier, year, visa sponsorship, and keyword search |
| ⭐ **Favorites** | Save internships with one click — scoped to your user account |
| 📋 **Track** | Track application status: Applied → Interview → Offer → Accepted/Rejected |
| 📊 **Analytics** | Funnel visualization, industry breakdown, application stage tracking |
| 👤 **Multi-User** | Username + PIN login — each user has their own favorites, tracking, and profile |
| 🌐 **i18n** | Chinese / English one-click toggle |
| 🌙 **Dark/Light** | Full theme toggle with CSS custom properties design system |
| 📥 **Export** | Download filtered results as CSV (with BOM for Excel) |
| 💰 **Zero Cost** | Static JSON on Vercel CDN — no server, no database, no ongoing cost |

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
├── Frontend: Vanilla HTML/CSS/JS (zero framework)
├── Data: Static JSON pre-built from Notion API
├── Build: Node.js (scripts/build-data.js)
├── Deploy: Vercel static hosting (free tier)
├── Auth: localStorage multi-user system
└── CI/CD: GitHub Actions (daily data refresh)
```

**Architecture**: Notion databases → `node scripts/build-data.js` → `public/data.json` → Vercel CDN

- **Zero server cost** — all filtering, sorting, pagination happens client-side from a single static JSON
- **Sub-second loads** — Vercel global CDN + minimal footprint (~650KB data + ~15KB app)
- **No framework bloat** — vanilla JS under 500 lines

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Notion API token (for data refresh)
- Vercel account (for deployment)

### Local Development
```bash
git clone https://github.com/ippq/internship-hunter.git
cd internship-hunter

# Rebuild data from Notion (requires token)
export NOTION_TOKEN=ntn_...
node scripts/build-data.js

# Serve locally
npx serve public
```

### Deploy to Vercel
```bash
npx vercel --prod --yes
```

### Daily Refresh (GitHub Actions)
1. Add `NOTION_TOKEN` to GitHub Secrets (Settings → Secrets and variables → Actions)
2. The workflow in `.github/workflows/refresh.yml` runs daily at 6am UTC

## 📁 Project Structure

```
├── public/               — Static site (deployed to Vercel)
│   ├── index.html         — Application shell
│   ├── app.js             — Frontend logic (~500 lines, incl. i18n)
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
2. **Storage**: 4 Notion databases (NA / EU / APAC / Remote), standardized schema
3. **Build**: `build-data.js` fetches all pages via Notion API (cursor pagination), flattens to JSON
4. **Deploy**: `data.json` committed to repo, deployed to Vercel CDN as static asset
5. **Refresh**: GitHub Action runs daily, or manually via `node scripts/build-data.js`

## 📄 License

MIT — see [LICENSE](LICENSE) file.

---

<p align="center">
  Built with ❤️ using Notion API + Vercel · 
  <a href="https://internship-hunter-six.vercel.app">Live Demo</a>
</p>
