# 🎯 Internship Hunter

All-in-one internship discovery + application dashboard. Combines a Notion internship database (135 entries across 4 regions) with JobHuntBot's Playwright-based application workflow.

## Quick Start

```bash
cd dashboard
node server.js
```

Then open **http://localhost:8420** in your browser.

## Features

- **🔍 Discover** — Browse 135 internships across NA/EU/APAC/Remote, filterable by region, industry, year, and deadline
- **🚀 Smart Apply** — Click on any card to open a Playwright-powered automated form filler (requires Claude Code + Playwright MCP)
- **📋 Track** — Applied and Ended views for tracking application outcomes
- **⚙️ Settings** — Configure Notion connection, candidate profile, and Playwright status

## Project Structure

```
├── dashboard/           — All-in-one web panel
│   ├── server.js        — Node.js HTTP server (zero dependencies)
│   ├── index.html       — Main dashboard UI
│   ├── style.css        — Dashboard styles
│   ├── app.js           — Frontend logic
│   └── start.bat        — Windows launcher
├── config/              — Configuration files
│   ├── notion-dbs.json  — 4 regional Notion DB IDs
│   └── regions.json     — Region definitions + search templates
├── my-materials/        — Your private candidate materials (gitignored)
│   ├── candidate_profile.json
│   ├── resume.pdf
│   ├── experience_bank.md
│   └── answer_bank.md
├── skills/              — Claude Code skills
│   └── apply.md         — Playwright form-filling workflow
└── README.md
```

## Prerequisites

- **Node.js** (for the dashboard server)
- **Claude Code + Playwright MCP** (for Smart Apply): `claude mcp add playwright npx '@playwright/mcp@latest'`
- **Notion API token** (already configured)

## Setup Your Profile

1. Edit `my-materials/candidate_profile.json` with your details
2. Place your resume as `my-materials/resume.pdf`
3. Fill in `my-materials/experience_bank.md` with your projects and work experience
4. Fill in `my-materials/answer_bank.md` with reusable answers

## Data Sources

The dashboard reads directly from 4 Notion databases:
- 🇺🇸 North America (99 entries)
- 🇪🇺 Europe (23 entries)
- 🌏 APAC (9 entries)
- 🌐 Remote/Global (4 entries)

New internships are added automatically via the n8n internship-pipeline workflow.

## Credits

- Application workflow adapted from [JobHuntBot](https://github.com/DanielPan12/JobHuntBot) (MIT License)
- Original ApplyPilot by Yvonne He
