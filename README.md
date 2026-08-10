<p align="center">
  <img src="https://img.shields.io/badge/internships-822-blue?style=for-the-badge" alt="822 internships">
  <img src="https://img.shields.io/badge/companies-600+-green?style=for-the-badge" alt="600+ companies">
  <img src="https://img.shields.io/badge/countries-33-orange?style=for-the-badge" alt="33 countries">
  <img src="https://img.shields.io/badge/industries-10-purple?style=for-the-badge" alt="10 industries">
</p>

<h1 align="center">🎯 Internship Hunter · 实习猎手</h1>
<p align="center"><strong>全球实习机会一站式发现与追踪平台</strong></p>

<p align="center">
  <a href="https://internship-hunter-six.vercel.app"><strong>🔗 Live Site · 在线体验</strong></a>
</p>

<details open>
<summary><strong>🇺🇸 English</strong> (click for 中文)</summary>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Discover** | Browse & filter 822 internships by industry, function, region, country, tier, year, visa sponsorship, and keyword search |
| ⭐ **Favorites** | Save internships with one click — scoped to your user account |
| 📋 **Track** | Track application status: Applied → Interview → Offer → Accepted/Rejected |
| 📊 **Analytics** | Funnel visualization, industry breakdown, application stage tracking |
| 👤 **Multi-User** | Username + PIN login system — each user has their own favorites, tracking, and profile |
| 🌐 **i18n** | Chinese / English one-click toggle |
| 🌙 **Dark/Light** | Full theme toggle with CSS custom properties design system |
| 📥 **Export** | Download filtered results as CSV (with BOM for Excel compatibility) |
| 💰 **Zero Cost** | Static JSON hosted on Vercel CDN — no server, no database, no ongoing cost |

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

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- A Notion API token (for data refresh)
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
│   ├── app.js             — All frontend logic (~500 lines, incl. i18n)
│   ├── style.css          — Design system + responsive CSS
│   └── data.json          — Pre-built internship data (~650KB)
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

## 📄 License

MIT — see [LICENSE](LICENSE) file.

---

<p align="center">
  Built with ❤️ using Notion API + Vercel · 
  <a href="https://internship-hunter-six.vercel.app">Live Demo</a>
</p>

</details>

<details>
<summary><strong>🇨🇳 中文</strong> (点击切换 English)</summary>

---

## ✨ 功能

| 功能 | 说明 |
|------|------|
| 🔍 **发现** | 按行业、职能、地区、国家、公司级别、年份、签证赞助等维度筛选浏览 822 个实习机会 |
| ⭐ **收藏** | 一键收藏实习机会，按用户账号隔离数据 |
| 📋 **追踪** | 追踪投递状态：已投递 → 面试 → 录取 → 已拒绝/已接受 |
| 📊 **分析** | 漏斗可视化、行业分布、投递阶段统计 |
| 👤 **多用户** | 用户名 + PIN 码登录，每个用户拥有独立的收藏、追踪和资料 |
| 🌐 **国际化** | 中/英文一键切换 |
| 🌙 **主题** | 深色/浅色模式切换，CSS 自定义属性设计系统 |
| 📥 **导出** | 导出筛选结果为 CSV（含 BOM，兼容 Excel） |
| 💰 **零成本** | 静态 JSON 托管于 Vercel CDN，无需服务器，无需数据库 |

## 📊 数据覆盖

### 按地区
| 地区 | 条目数 | 亮点 |
|------|--------|------|
| 🇺🇸 北美 | 451 | FAANG、世界500强、独角兽、政府/非营利 |
| 🇪🇺 欧洲 | 216 | 西门子、空客、LVMH、罗氏、壳牌、宜家 |
| 🌏 亚太 | 138 | 腾讯（10000+ 实习 offer）、三星、台积电、Nubank |
| 🌐 远程 | 17 | GitLab、Zapier、Automattic、币安 |

### 按行业
| 行业 | 数量 | 代表公司 |
|------|------|----------|
| 💻 科技与互联网 | 288 | Google, Meta, Apple, Microsoft, 字节跳动, Stripe |
| 💰 金融与金融科技 | 169 | Goldman Sachs, JPMorgan, HSBC, Nubank, Stripe |
| 🏭 工业与制造 | 89 | Tesla, SpaceX, Boeing, Toyota, Siemens, 富士康 |
| 🛍️ 消费与零售 | 81 | Nike, LVMH, P&G, IKEA, Nestlé, PepsiCo |
| 🏥 医疗与生命科学 | 45 | Pfizer, Novartis, Roche, Moderna, Merck |
| 📊 咨询 | 36 | McKinsey, BCG, Bain, Deloitte, PwC, EY, KPMG |
| 🎬 媒体与娱乐 | 33 | Disney, Netflix, Spotify, EA, Roblox, Epic Games |
| ⚡ 能源与清洁技术 | 32 | Shell, BP, Equinor, Ørsted, 宁德时代, NextEra |
| 🪙 加密与Web3 | 22 | Coinbase, Binance, Kraken, Ripple, Circle, Polygon |
| 🏛️ 政府与公共部门 | 18 | 世界银行, 联合国, OECD, IMF, NATO, WHO |

### 按职能
| 职能 | 数量 |
|------|------|
| 工程与开发 | 469 |
| AI / ML 与数据 | 110 |
| 市场与增长 | 89 |
| 咨询与研究 | 50 |
| 运营与战略 | 37 |
| 产品与设计 | 27 |
| 财务与会计 | 25 |
| 销售与商务 | 24 |
| 人力资源 | 18 |
| 量化金融 | 18 |

### 按级别
- **世界500强 / 全球企业**: 500+ 条
- **独角兽 / 成长期**: 175+ 条
- **初创 / SME**: 25+ 条
- **政府 / 非营利**: 18 条

## 🏗️ 技术栈

```
Internship Hunter
├── 前端: 原生 HTML/CSS/JS（零框架依赖）
├── 数据: 静态 JSON，通过 Notion API 预构建
├── 构建: Node.js 脚本 (scripts/build-data.js)
├── 部署: Vercel 静态托管（免费套餐）
├── 认证: localStorage 多用户系统
└── CI/CD: GitHub Actions（每日数据刷新）
```

**架构**: Notion 数据库 → `node scripts/build-data.js` → `public/data.json` → Vercel CDN

- **零服务器成本** — 所有筛选、排序、分页均在前端完成
- **亚秒级加载** — Vercel 全球 CDN + 轻量代码（~650KB 数据 + ~15KB 应用）
- **无框架依赖** — 原生 JavaScript 约 500 行

## 🚀 快速开始

### 环境要求
- Node.js v18+
- Notion API token（用于数据刷新）
- Vercel 账号（用于部署）

### 本地开发
```bash
git clone https://github.com/ippq/internship-hunter.git
cd internship-hunter

# 从 Notion 重建数据（需要 token）
export NOTION_TOKEN=ntn_...
node scripts/build-data.js

# 本地运行
npx serve public
```

### 部署到 Vercel
```bash
npx vercel --prod --yes
```

### 每日自动刷新 (GitHub Actions)
1. 在 GitHub Secrets 中添加 `NOTION_TOKEN`（Settings → Secrets and variables → Actions）
2. `.github/workflows/refresh.yml` 每天 UTC 6:00 自动运行

## 📁 项目结构

```
├── public/               — 静态站点（部署到 Vercel）
│   ├── index.html         — 应用骨架
│   ├── app.js             — 前端逻辑（含 i18n 中英文切换）
│   ├── style.css          — 设计系统 + 响应式 CSS
│   └── data.json          — 预构建实习数据（~650KB）
├── scripts/
│   ├── build-data.js      — Notion API → 静态 JSON
│   ├── insert-batch.js    — 批量导入新条目到 Notion
│   └── new-entries.json   — 新条目暂存文件
├── config/
│   └── notion-dbs.json    — 区域数据库 ID
├── .github/workflows/
│   └── refresh.yml        — 每日数据刷新 Action
├── vercel.json            — Vercel 部署配置
└── .env                   — NOTION_TOKEN (gitignored)
```

## 🔒 数据管道

1. **收集**: 通过 Anysearch 搜索 + 公司官网验证
2. **存储**: 4 个 Notion 数据库（北美 / 欧洲 / 亚太 / 远程），统一 Schema
3. **构建**: `build-data.js` 通过 Notion API 游标分页拉取全部数据，展平为 JSON
4. **部署**: `data.json` 提交到仓库，作为静态资源部署至 Vercel CDN
5. **刷新**: GitHub Action 每日运行，或手动 `node scripts/build-data.js`

## 📄 许可证

MIT — 详见 [LICENSE](LICENSE) 文件。

---

<p align="center">
  用 Notion API + Vercel 构建 ❤️ · 
  <a href="https://internship-hunter-six.vercel.app">在线体验</a>
</p>

</details>
