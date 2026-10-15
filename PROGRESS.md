# PROGRESS.md

> Paste this file to the AI agent at the start of a new session so it knows where we are.
> Update it after every completed task.

## Current status

**Phase:** 0, Setup — locally done, waiting for GitHub repo creation by user
**Last updated:** 2026-10-16
**Summary:** Project scaffolded locally (Next.js 15 + TS + Tailwind v4 + RTL/Vazirmatn). Build, typecheck, and tests pass. Committed locally on `main`. GitHub repo not yet created.

## Git

- Repo: (GitHub URL here — needs user to create)
- Last commit: `4c7e40a` chore: initial project setup with Next.js, TS, Tailwind, RTL
- Pending (not committed yet): none

## Next step

0. (BLOCKED — human action) User creates empty GitHub repo, runs `git remote add origin <url> && git push -u origin main`
1. Create the project folder and initialize Next.js + TypeScript + Tailwind ✅ done
2. Design the database schema
3. Prepare the data collection sheet

## Key decisions

| Decision            | Choice                                     | Why                                                            |
| ------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| Market              | Car repair price comparison                | Fits Torob's challenge, differentiated from "airplane tickets" |
| Scope               | One city (Tehran)                          | Depth beats breadth; 1 good city > 10 empty ones               |
| Price display       | Min-max range                              | Repair prices vary by damage and car model                     |
| Data source         | Manual collection + optional official APIs | Safe, honest, enough for a demo                                |
| Drivers / transport | Out of scope                               | Separate marketplace, doesn't fit a 5-minute demo              |
| Torob crawling      | Never                                      | Bad idea for a Torob applicant                                 |
| Next.js version    | 15.3.4 (latest)                            | App Router, stable                                             |
| Tailwind version    | v4 (CSS-based config)                      | Modern, no separate config file needed                         |
| Font                | Vazirmatn (self-hosted woff2)              | Works offline, no CDN dependency, good for Iran                |

## Roadmap

### Phase 0: Setup

- [x] Create repo and project (Next.js, TS, Tailwind, shadcn/ui) — scaffolded, shadcn deferred to Phase 4 when components are needed
- [x] Add RTL + Vazirmatn font — self-hosted woff2, `dir="rtl"`, `lang="fa"`
- [x] Set up env variables and `.gitignore` — `.env.example` created, `.gitignore` covers `.env`, `node_modules`, `.next`
- [ ] Push to GitHub — waiting for user to create the repo

### Phase 1: Data

- [ ] Define DB schema (`shops`, `services`, `price_offers`, `reviews`)
- [ ] Collect 100-300 price records for Tehran (manual)
- [ ] Mark each record real or synthetic
- [ ] Seed script to load data

### Phase 2: AI core (the heart of the project)

- [ ] Query parser: natural language to `{service, car, city, intent}`
- [ ] Normalization pipeline: messy text to standard record
- [ ] Zod schemas for all LLM outputs
- [ ] Evaluation set (50 cases) + accuracy report

### Phase 3: Search and ranking

- [ ] Search API
- [ ] Ranking by intent (cheapest, nearest, best rated, best value)
- [ ] AI explanation of the best choice
- [ ] Suspicious price detection (vs market average)

### Phase 4: UI

- [ ] Search page (RTL, clean)
- [ ] Results list with price ranges
- [ ] Map view (MapLibre)
- [ ] Simple rating

### Phase 5: Demo and delivery

- [ ] Deploy (live link)
- [ ] Write README with architecture and data notes
- [ ] "How it works" page
- [ ] Record 5-minute demo video
- [ ] Submit on jobs.torob.com

### Optional (only if time remains)

- [ ] Estimated shipping price module (calculation only)

## Done log

| Date | What was done |
| ---- | ------------- |
| 2026-10-16 | Phase 0 local setup: git init, .gitignore, Next.js 15 + TS + Tailwind v4 scaffold, RTL layout with self-hosted Vazirmatn font, .env.example, vitest smoke test. Build + typecheck + tests pass. |

## Problems / open questions

- GitHub repo creation blocked on user (needs their credentials).

## Notes for the demo video

Ideas to show in the 5 minutes:

1. The problem: people get overcharged on repairs
2. Type a messy query, show the AI understanding it
3. Show messy raw data becoming clean records
4. Ranked results + the explanation of the best choice
5. Map
6. Evaluation numbers
7. Future: more cities, mechanics claiming profiles, drivers/transport
