# 🚀 Deploy to Vercel (Zero Cost)

## One-time Setup

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login (GitHub/GitLab/Email):
```bash
vercel login
```

## Deploy

```bash
cd C:\Users\richa\projects\internship-hunter
vercel
```

First deploy asks:
- Set up and deploy? → **Y**
- Which scope? → your account
- Link to existing project? → **N**
- Project name → `internship-hunter` (or whatever)
- Root directory? → `.` (default)
- Override settings? → **N**

After confirmation, Vercel builds and deploys. You'll get a URL like:
`https://internship-hunter-xxxxx.vercel.app`

## Production Deploy

```bash
vercel --prod
```

This gives you a permanent URL.

## Custom Domain (Optional, Still Free)

1. Buy a domain (e.g., Namecheap $10/yr — not free but cheap)
2. In Vercel dashboard → Project → Settings → Domains → Add
3. Follow DNS instructions

## Architecture

```
Browser → Vercel CDN (static HTML/CSS/JS)
         ↓
Vercel Serverless Functions (/api/*)
         ↓
Notion API (4 regional databases, 567 entries)
```

Static files: `public/`
Serverless functions: `api/internships.js`, `api/stats.js`, `api/profile.js`
Shared Notion logic: `api/_notion.js` (cached, 5-min TTL)

## Limits (Vercel Hobby / Free)

| Resource | Limit | Status |
|----------|-------|--------|
| Bandwidth | 100 GB/month | ✅ Plenty |
| Serverless executions | 100K/day | ✅ Fine |
| Function timeout | 10 seconds | ✅ Works (cached after first call) |
| Build time | 45 min/month | ✅ |

First visit after deploy: ~10s (cold start + Notion pagination for 567 entries)
Subsequent visits: <500ms (cached)
