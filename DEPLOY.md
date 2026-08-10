# 🚀 Vercel Deployment Guide

## Architecture

```
Notion API → build-data.js → public/data.json → Vercel Static CDN
```

**Zero server cost. No serverless functions. Pure static hosting.**

- `public/data.json` is pre-built at deploy time (822 entries, ~650KB)
- All filtering, sorting, pagination happens client-side
- Vercel serves static HTML/CSS/JS globally via CDN

## Deploy

```bash
# Build data from Notion (requires NOTION_TOKEN)
export NOTION_TOKEN=ntn_...
node scripts/build-data.js

# Deploy to production
npx vercel --prod --yes
```

Live at: **https://internship-hunter-six.vercel.app**

## Daily Refresh

The GitHub Action (`.github/workflows/refresh.yml`) can auto-rebuild:
1. Add `NOTION_TOKEN` as a [GitHub Secret](https://github.com/ippq/internship-hunter/settings/secrets/actions)
2. The workflow runs daily at 6am UTC, rebuilds `data.json`, and commits

## Adding Notion Token to Vercel

To enable auto-refresh during Vercel builds:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add `NOTION_TOKEN` with your token value
3. Update `vercel.json` buildCommand to include `node scripts/build-data.js`

## Manual Refresh

```bash
export NOTION_TOKEN=ntn_...
node scripts/build-data.js   # Rebuild data.json
npx vercel --prod --yes      # Deploy
```

## Limits (Vercel Hobby)

| Resource | Limit | Usage |
|----------|-------|-------|
| Bandwidth | 100 GB/month | ~650KB per load, well within limits |
| Build time | 45 min/month | Build takes ~15 seconds |
| Static files | Unlimited | Single 650KB JSON |

No serverless functions used — the entire app is static HTML/CSS/JS.
